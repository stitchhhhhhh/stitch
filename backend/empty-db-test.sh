#!/usr/bin/env bash
set -Eeuo pipefail

# ============================================================
# LMS EMPTY BUSINESS DATABASE TEST
# ============================================================
# Creates an isolated PostgreSQL schema, applies migrations,
# seeds only reference/authentication data, starts the backend
# on a separate port, and verifies empty-state API behavior.
# The main/public schema is never reset, truncated, or dropped.
# ============================================================

PROJECT_DIR="${PROJECT_DIR:-$(pwd)}"
TEST_PORT="${TEST_PORT:-3101}"
TEST_SCHEMA="${TEST_SCHEMA:-lms_empty_test_$(date +%Y%m%d_%H%M%S)}"
KEEP_TEST_SCHEMA="${KEEP_TEST_SCHEMA:-0}"
TEST_PASSWORD="${TEST_PASSWORD:-LmsTest123!}"
REPORT_DIR="${REPORT_DIR:-$PROJECT_DIR/test-reports}"
REPORT_FILE="$REPORT_DIR/empty-db-test-$(date +%Y%m%d_%H%M%S).log"
SERVER_LOG="$REPORT_DIR/empty-db-server-$(date +%Y%m%d_%H%M%S).log"
TEMP_ENV="$(mktemp)"
SERVER_PID=""
PASS=0
FAIL=0
WARN=0

mkdir -p "$REPORT_DIR"
log(){ printf '%s\n' "$*" | tee -a "$REPORT_FILE"; }
pass(){ PASS=$((PASS+1)); log "PASS  $*"; }
fail(){ FAIL=$((FAIL+1)); log "FAIL  $*"; }
warn(){ WARN=$((WARN+1)); log "WARN  $*"; }

cleanup(){
  local code=$?
  if [[ -n "${SERVER_PID:-}" ]] && kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  rm -f "$TEMP_ENV"
  if [[ "$KEEP_TEST_SCHEMA" != "1" && -n "${TEST_DATABASE_URL:-}" ]]; then
    printf 'DROP SCHEMA IF EXISTS "%s" CASCADE;\n' "$TEST_SCHEMA" |
      DATABASE_URL="$TEST_DATABASE_URL" npx prisma db execute --schema prisma/schema.prisma --stdin >/dev/null 2>&1 || true
  fi
  exit "$code"
}
trap cleanup EXIT INT TERM

cd "$PROJECT_DIR"
for cmd in node curl npx; do command -v "$cmd" >/dev/null 2>&1 || { echo "Missing command: $cmd" >&2; exit 1; }; done
[[ -f .env ]] || { echo "ERROR: .env not found" >&2; exit 1; }
[[ -f prisma/schema.prisma ]] || { echo "ERROR: prisma/schema.prisma not found" >&2; exit 1; }

TEST_DATABASE_URL="$(TEST_SCHEMA="$TEST_SCHEMA" node <<'NODE'
require('dotenv').config()
const raw = process.env.DATABASE_URL
if (!raw) process.exit(1)
const url = new URL(raw)
url.searchParams.set('schema', process.env.TEST_SCHEMA)
process.stdout.write(url.toString())
NODE
)"

cp .env "$TEMP_ENV"
{
  printf '\nDATABASE_URL=%s\n' "$TEST_DATABASE_URL"
  printf 'PORT=%s\n' "$TEST_PORT"
  printf 'JWT_SECRET=%s\n' "${JWT_SECRET_TEST:-empty-db-test-secret}"
  printf 'NODE_ENV=test\n'
} >> "$TEMP_ENV"

log "============================================================"
log "LMS EMPTY BUSINESS DATABASE TEST"
log "Test schema : $TEST_SCHEMA"
log "Test port   : $TEST_PORT"
log "Main schema : NOT MODIFIED"
log "============================================================"

printf 'CREATE SCHEMA IF NOT EXISTS "%s";\n' "$TEST_SCHEMA" |
  DATABASE_URL="$TEST_DATABASE_URL" npx prisma db execute --schema prisma/schema.prisma --stdin >>"$REPORT_FILE" 2>&1
DATABASE_URL="$TEST_DATABASE_URL" npx prisma migrate deploy --schema prisma/schema.prisma >>"$REPORT_FILE" 2>&1
DATABASE_URL="$TEST_DATABASE_URL" npx prisma generate --schema prisma/schema.prisma >>"$REPORT_FILE" 2>&1
pass "Isolated schema created and migrated"

DATABASE_URL="$TEST_DATABASE_URL" TEST_PASSWORD="$TEST_PASSWORD" node <<'NODE' >>"$REPORT_FILE" 2>&1
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main(){
  const passwordHash = await bcrypt.hash(process.env.TEST_PASSWORD, 10)
  const roles = {}
  for (const name of ['HR','MANAGER','TRAINER','EMPLOYEE']) {
    roles[name] = await prisma.role.upsert({where:{name},update:{},create:{name}})
  }
  const department = await prisma.department.upsert({
    where:{name:'Empty Test Department'},
    update:{},
    create:{name:'Empty Test Department',description:'Reference-only test department'}
  })
  const hr = await prisma.user.upsert({
    where:{email:'empty.hr@test.local'},
    update:{password_hash:passwordHash,status:'active'},
    create:{
      role_id:roles.HR.id,
      department_id:department.id,
      full_name:'Empty Database Test HR',
      email:'empty.hr@test.local',
      status:'active',
      password_hash:passwordHash
    }
  })
  console.log(JSON.stringify({departmentId:department.id,hrUserId:hr.id}))
}
main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect())
NODE
pass "Reference/authentication data seeded"

DATABASE_URL="$TEST_DATABASE_URL" node <<'NODE' >>"$REPORT_FILE" 2>&1
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main(){
  const counts = {
    programProposal: await prisma.programProposal.count(),
    trainingProgram: await prisma.trainingProgram.count(),
    courseRequest: await prisma.courseRequest.count(),
    course: await prisma.course.count(),
    learningMaterial: await prisma.learningMaterial.count(),
    assessment: await prisma.assessment.count(),
    question: await prisma.question.count(),
    courseEnrollment: await prisma.courseEnrollment.count(),
    materialProgress: await prisma.materialProgress.count(),
    assessmentResult: await prisma.assessmentResult.count(),
    notification: await prisma.notification.count(),
    certificate: await prisma.certificate.count(),
    auditLog: await prisma.auditLog.count(),
    badge: await prisma.badge.count(),
    userBadge: await prisma.userBadge.count()
  }
  console.log(JSON.stringify(counts,null,2))
  const bad = Object.entries(counts).filter(([,v])=>v!==0)
  if (bad.length) process.exit(1)
}
main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect())
NODE
pass "All business tables are empty"

set -a
# shellcheck disable=SC1090
source "$TEMP_ENV"
set +a
node src/index.js >"$SERVER_LOG" 2>&1 &
SERVER_PID=$!
BASE_URL="http://127.0.0.1:$TEST_PORT"
for _ in $(seq 1 30); do curl -sS -o /dev/null "$BASE_URL/api/auth/logout" && break || true; sleep 1; done
if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then fail "Backend failed to start"; tail -n 100 "$SERVER_LOG" | tee -a "$REPORT_FILE"; exit 1; fi
pass "Backend started on isolated port"

request(){
  local method="$1" path="$2" token="${3:-}" body="${4:-}" tmp status response
  tmp="$(mktemp)"
  local args=(-sS -X "$method" -o "$tmp" -w '%{http_code}' -H 'Accept: application/json')
  [[ -n "$token" ]] && args+=(-H "Authorization: Bearer $token")
  [[ -n "$body" ]] && args+=(-H 'Content-Type: application/json' --data "$body")
  status="$(curl "${args[@]}" "$BASE_URL$path" || printf '000')"
  response="$(cat "$tmp")"; rm -f "$tmp"
  printf '%s\t%s\n' "$status" "$response"
}

assert_status(){ local label="$1" expected="$2" actual="$3"; [[ "$actual" == "$expected" ]] && pass "$label — HTTP $actual" || fail "$label — expected $expected, got $actual"; }
assert_not_500(){ local label="$1" status="$2" body="$3"; [[ "$status" == "500" || "$status" == "000" ]] && fail "$label — HTTP $status — $body" || pass "$label — HTTP $status"; }

IFS=$'\t' read -r LOGIN_STATUS LOGIN_BODY < <(request POST /api/auth/login "" "{\"email\":\"empty.hr@test.local\",\"password\":\"$TEST_PASSWORD\"}")
assert_status "HR login" 200 "$LOGIN_STATUS"
TOKEN="$(LOGIN_BODY="$LOGIN_BODY" node -e 'try{const d=JSON.parse(process.env.LOGIN_BODY);process.stdout.write(d.token||"")}catch{}')"
USER_ID="$(LOGIN_BODY="$LOGIN_BODY" node -e 'try{const d=JSON.parse(process.env.LOGIN_BODY);process.stdout.write(String(d.user?.user_id||""))}catch{}')"
[[ -n "$TOKEN" && -n "$USER_ID" ]] || { fail "Token or user ID missing"; exit 1; }
pass "Login response contains token and user ID"

IFS=$'\t' read -r S B < <(request GET /api/programs)
assert_status "Missing token is rejected" 401 "$S"

declare -a TESTS=(
  "GET|/api/auth/me|Authenticated profile"
  "GET|/api/departments|Departments"
  "GET|/api/programs|Programs"
  "GET|/api/proposals|Proposals"
  "GET|/api/course-requests|Course requests"
  "GET|/api/courses|Courses"
  "GET|/api/enrollments/user/$USER_ID|Enrollments"
  "GET|/api/assessment-results/user/$USER_ID|Assessment results"
  "GET|/api/notifications|Notifications"
  "GET|/api/leaderboard|Leaderboard"
  "GET|/api/certificates/user/$USER_ID|Certificates"
  "GET|/api/certificates/recent|Recent certificates"
  "GET|/api/assessment-results/recent|Recent assessment results"
  "GET|/api/analytics/company|Company analytics"
  "GET|/api/dashboard/summary|Dashboard summary"
  "GET|/api/hr/overview|HR overview"
)
for t in "${TESTS[@]}"; do IFS='|' read -r m p l <<<"$t"; IFS=$'\t' read -r s b < <(request "$m" "$p" "$TOKEN"); assert_not_500 "$l" "$s" "$b"; done

validate_json(){
  local label="$1" path="$2" expr="$3" status body
  IFS=$'\t' read -r status body < <(request GET "$path" "$TOKEN")
  if [[ "$status" != "200" ]]; then fail "$label — HTTP $status — $body"; return; fi
  if BODY="$body" EXPR="$expr" node <<'NODE'
const data=JSON.parse(process.env.BODY)
const ok=Function('data',`return Boolean(${process.env.EXPR})`)(data)
if(!ok) process.exit(1)
NODE
  then pass "$label"; else fail "$label — unexpected body: $body"; fi
}

validate_json "Programs returns []" /api/programs "Array.isArray(data)&&data.length===0"
validate_json "Proposals returns []" /api/proposals "Array.isArray(data)&&data.length===0"
validate_json "Course requests returns []" /api/course-requests "Array.isArray(data)&&data.length===0"
validate_json "Courses returns empty pagination" /api/courses "Array.isArray(data.data)&&data.data.length===0&&Number(data.pagination?.total)===0"
validate_json "Enrollments returns []" "/api/enrollments/user/$USER_ID" "Array.isArray(data)&&data.length===0"
validate_json "Assessment results returns []" "/api/assessment-results/user/$USER_ID" "Array.isArray(data)&&data.length===0"
validate_json "Certificates returns []" "/api/certificates/user/$USER_ID" "Array.isArray(data)&&data.length===0"
validate_json "Dashboard contains zero business totals" /api/dashboard/summary "Number(data.courses)===0&&Number(data.programs)===0&&Number(data.certificates)===0&&Number(data.enrollments)===0&&Number(data.completedEnrollments)===0&&Number(data.pendingProposals)===0&&Number(data.averageScore)===0"

log "============================================================"
log "EMPTY DATABASE TEST SUMMARY"
log "PASS: $PASS"
log "FAIL: $FAIL"
log "WARN: $WARN"
log "Report: $REPORT_FILE"
log "============================================================"
[[ "$FAIL" -eq 0 ]]
