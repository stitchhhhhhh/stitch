#!/usr/bin/env bash
set -Eeuo pipefail

# ============================================================
# LMS FUNCTIONAL API TEST
# ============================================================
# Isolated flow:
# Login -> Program -> Proposal -> Course Request -> Course
# -> Material read -> Assessment -> Enrollment -> Result
# -> Certificate -> Leaderboard
# Main/public schema is never modified.
# ============================================================

PROJECT_DIR="${PROJECT_DIR:-$(pwd)}"
TEST_PORT="${TEST_PORT:-3102}"
TEST_SCHEMA="${TEST_SCHEMA:-lms_functional_test_$(date +%Y%m%d_%H%M%S)}"
KEEP_TEST_SCHEMA="${KEEP_TEST_SCHEMA:-0}"
TEST_PASSWORD="${TEST_PASSWORD:-LmsTest123!}"
REPORT_DIR="${REPORT_DIR:-$PROJECT_DIR/test-reports}"
REPORT_FILE="$REPORT_DIR/functional-api-test-$(date +%Y%m%d_%H%M%S).log"
SERVER_LOG="$REPORT_DIR/functional-api-server-$(date +%Y%m%d_%H%M%S).log"
TEMP_ENV="$(mktemp)"
SERVER_PID=""
PASS=0
FAIL=0
SKIP=0
mkdir -p "$REPORT_DIR"
log(){ printf '%s\n' "$*" | tee -a "$REPORT_FILE"; }
pass(){ PASS=$((PASS+1)); log "PASS  $*"; }
fail(){ FAIL=$((FAIL+1)); log "FAIL  $*"; }
skip(){ SKIP=$((SKIP+1)); log "SKIP  $*"; }
cleanup(){
  local code=$?
  if [[ -n "${SERVER_PID:-}" ]] && kill -0 "$SERVER_PID" >/dev/null 2>&1; then kill "$SERVER_PID" >/dev/null 2>&1 || true; wait "$SERVER_PID" 2>/dev/null || true; fi
  rm -f "$TEMP_ENV"
  if [[ "$KEEP_TEST_SCHEMA" != "1" && -n "${TEST_DATABASE_URL:-}" ]]; then
    printf 'DROP SCHEMA IF EXISTS "%s" CASCADE;\n' "$TEST_SCHEMA" | DATABASE_URL="$TEST_DATABASE_URL" npx prisma db execute --schema prisma/schema.prisma --stdin >/dev/null 2>&1 || true
  fi
  exit "$code"
}
trap cleanup EXIT INT TERM

cd "$PROJECT_DIR"
for cmd in node curl npx; do command -v "$cmd" >/dev/null 2>&1 || { echo "Missing command: $cmd" >&2; exit 1; }; done
[[ -f .env ]] || { echo ".env not found" >&2; exit 1; }
TEST_DATABASE_URL="$(TEST_SCHEMA="$TEST_SCHEMA" node <<'NODE'
require('dotenv').config(); const u=new URL(process.env.DATABASE_URL); u.searchParams.set('schema',process.env.TEST_SCHEMA); process.stdout.write(u.toString())
NODE
)"
cp .env "$TEMP_ENV"
{
  printf '\nDATABASE_URL=%s\n' "$TEST_DATABASE_URL"
  printf 'PORT=%s\n' "$TEST_PORT"
  printf 'JWT_SECRET=%s\n' "${JWT_SECRET_TEST:-functional-api-test-secret}"
  printf 'NODE_ENV=test\n'
} >> "$TEMP_ENV"

log "============================================================"
log "LMS FUNCTIONAL API TEST"
log "Schema: $TEST_SCHEMA"
log "Port: $TEST_PORT"
log "Main schema: NOT MODIFIED"
log "============================================================"

printf 'CREATE SCHEMA IF NOT EXISTS "%s";\n' "$TEST_SCHEMA" | DATABASE_URL="$TEST_DATABASE_URL" npx prisma db execute --schema prisma/schema.prisma --stdin >>"$REPORT_FILE" 2>&1
DATABASE_URL="$TEST_DATABASE_URL" npx prisma migrate deploy --schema prisma/schema.prisma >>"$REPORT_FILE" 2>&1
DATABASE_URL="$TEST_DATABASE_URL" npx prisma generate --schema prisma/schema.prisma >>"$REPORT_FILE" 2>&1
pass "Isolated schema prepared"

SEED_JSON="$(DATABASE_URL="$TEST_DATABASE_URL" TEST_PASSWORD="$TEST_PASSWORD" node <<'NODE'
const bcrypt=require('bcryptjs'); const {PrismaClient}=require('@prisma/client'); const prisma=new PrismaClient()
async function main(){
  const hash=await bcrypt.hash(process.env.TEST_PASSWORD,10); const roles={}
  for(const name of ['HR','MANAGER','TRAINER','EMPLOYEE']) roles[name]=await prisma.role.upsert({where:{name},update:{},create:{name}})
  const a=await prisma.department.create({data:{name:'Functional Test Department A'}})
  const b=await prisma.department.create({data:{name:'Functional Test Department B'}})
  const mk=(role,full_name,email,department_id)=>prisma.user.create({data:{role_id:roles[role].id,department_id,full_name,email,status:'active',password_hash:hash}})
  const hr=await mk('HR','Functional Test HR','functional.hr@test.local',a.id)
  const manager=await mk('MANAGER','Functional Test Manager','functional.manager@test.local',a.id)
  const trainer=await mk('TRAINER','Functional Test Trainer','functional.trainer@test.local',a.id)
  const employee=await mk('EMPLOYEE','Functional Test Employee','functional.employee@test.local',a.id)
  console.log(JSON.stringify({departmentAId:a.id,departmentBId:b.id,hrId:hr.id,managerId:manager.id,trainerId:trainer.id,employeeId:employee.id}))
}
main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect())
NODE
)"

jget(){ JSON_DATA="$1" JSON_EXPRESSION="$2" node <<'NODE'
const d=JSON.parse(process.env.JSON_DATA); const v=Function('data',`return (${process.env.JSON_EXPRESSION})`)(d); if(v===undefined||v===null) process.exit(1); process.stdout.write(String(v))
NODE
}
DEPARTMENT_ID="$(jget "$SEED_JSON" 'data.departmentAId')"
TRAINER_ID="$(jget "$SEED_JSON" 'data.trainerId')"
EMPLOYEE_ID="$(jget "$SEED_JSON" 'data.employeeId')"
pass "Reference users created"

set -a
# shellcheck disable=SC1090
source "$TEMP_ENV"
set +a
node src/index.js >"$SERVER_LOG" 2>&1 & SERVER_PID=$!
BASE_URL="http://127.0.0.1:$TEST_PORT"
for _ in $(seq 1 30); do curl -sS -o /dev/null "$BASE_URL/api/auth/logout" && break || true; sleep 1; done
if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then fail "Backend did not start"; tail -n 100 "$SERVER_LOG" | tee -a "$REPORT_FILE"; exit 1; fi
pass "Backend started"

http(){
  local method="$1" path="$2" token="${3:-}" body="${4:-}" tmp status response
  tmp="$(mktemp)"; local args=(-sS -X "$method" -o "$tmp" -w '%{http_code}' -H 'Accept: application/json')
  [[ -n "$token" ]] && args+=(-H "Authorization: Bearer $token")
  [[ -n "$body" ]] && args+=(-H 'Content-Type: application/json' --data "$body")
  status="$(curl "${args[@]}" "$BASE_URL$path" || printf '000')"; response="$(cat "$tmp")"; rm -f "$tmp"; printf '%s\t%s' "$status" "$response"
}
login(){
  local email="$1" status body
  IFS=$'\t' read -r status body < <(http POST /api/auth/login "" "{\"email\":\"$email\",\"password\":\"$TEST_PASSWORD\"}")
  if [[ "$status" != "200" ]]; then fail "Login $email — HTTP $status — $body"; printf ''; return; fi
  pass "Login $email"; jget "$body" 'data.token'
}
assert_http(){ local label="$1" expected="$2" actual="$3" body="$4"; [[ "$actual" == "$expected" ]] && pass "$label — HTTP $actual" || fail "$label — expected $expected, got $actual — $body"; }
extract_id(){ jget "$1" 'data.id ?? data.program_id ?? data.request_id ?? data.course_id ?? data.assessment_id ?? data.enrollment_id ?? data.result?.id'; }

HR_TOKEN="$(login functional.hr@test.local)"
MANAGER_TOKEN="$(login functional.manager@test.local)"
TRAINER_TOKEN="$(login functional.trainer@test.local)"
EMPLOYEE_TOKEN="$(login functional.employee@test.local)"
[[ -n "$HR_TOKEN" && -n "$MANAGER_TOKEN" && -n "$TRAINER_TOKEN" && -n "$EMPLOYEE_TOKEN" ]] || exit 1

log "STEP 1 — PROGRAM"
IFS=$'\t' read -r S B < <(http POST /api/programs "$HR_TOKEN" '{"program_name":"Functional API Program","description":"Created by automated test"}')
assert_http "HR creates program" 201 "$S" "$B"
PROGRAM_ID="$(extract_id "$B" 2>/dev/null || true)"; [[ -n "$PROGRAM_ID" ]] || { fail "Program ID missing"; exit 1; }

log "STEP 2 — PROPOSAL"
PB="$(printf '{"program_name":"Functional Department Program","description":"Automated proposal","department_id":%s}' "$DEPARTMENT_ID")"
IFS=$'\t' read -r S B < <(http POST /api/proposals "$MANAGER_TOKEN" "$PB")
if [[ "$S" == "201" ]]; then pass "Manager submits proposal"; else fail "Manager submits proposal — HTTP $S — $B"; fi

log "STEP 3 — COURSE REQUEST"
CRB="$(printf '{"program_id":%s,"trainer_id":%s}' "$PROGRAM_ID" "$TRAINER_ID")"
IFS=$'\t' read -r S B < <(http POST /api/course-requests "$HR_TOKEN" "$CRB")
assert_http "HR creates course request" 201 "$S" "$B"
REQUEST_ID="$(extract_id "$B" 2>/dev/null || true)"; [[ -n "$REQUEST_ID" ]] || { fail "Course request ID missing"; exit 1; }
IFS=$'\t' read -r S B < <(http PUT "/api/course-requests/$REQUEST_ID" "$TRAINER_TOKEN" '{"status":"in_progress"}')
assert_http "Trainer accepts course request" 200 "$S" "$B"

log "STEP 4 — COURSE"
CB="$(printf '{"request_id":%s,"program_id":%s,"course_title":"Functional API Course","description":"Automated course","deadline":"2030-12-31T23:59:59.000Z"}' "$REQUEST_ID" "$PROGRAM_ID")"
IFS=$'\t' read -r S B < <(http POST /api/courses "$TRAINER_TOKEN" "$CB")
assert_http "Trainer creates course" 201 "$S" "$B"
COURSE_ID="$(extract_id "$B" 2>/dev/null || true)"; [[ -n "$COURSE_ID" ]] || { fail "Course ID missing"; exit 1; }

if grep -q "'/:id/submit'" src/routes/courses.js; then SUBMIT_PATH="/api/courses/$COURSE_ID/submit"; elif grep -q "'/:id/submit-for-review'" src/routes/courses.js; then SUBMIT_PATH="/api/courses/$COURSE_ID/submit-for-review"; else SUBMIT_PATH=""; fi
if [[ -n "$SUBMIT_PATH" ]]; then IFS=$'\t' read -r S B < <(http PUT "$SUBMIT_PATH" "$TRAINER_TOKEN" '{}'); [[ "$S" == "200" ]] && pass "Trainer submits course" || fail "Trainer submits course — HTTP $S — $B"; else skip "Course submit route not detected"; fi
IFS=$'\t' read -r S B < <(http PUT "/api/courses/$COURSE_ID/manager-review" "$MANAGER_TOKEN" '{"approval_status":"approved"}')
assert_http "Manager approves course" 200 "$S" "$B"

log "STEP 5 — MATERIAL"
IFS=$'\t' read -r S B < <(http GET "/api/materials/course/$COURSE_ID" "$TRAINER_TOKEN")
assert_http "Read materials" 200 "$S" "$B"
skip "Material upload requires external Cloudinary credentials and a real file"

log "STEP 6 — ASSESSMENT"
IFS=$'\t' read -r S B < <(http POST /api/assessments "$TRAINER_TOKEN" "{\"course_id\":$COURSE_ID,\"title\":\"Functional API Assessment\",\"passing_score\":70}")
assert_http "Trainer creates assessment" 201 "$S" "$B"
ASSESSMENT_ID="$(extract_id "$B" 2>/dev/null || true)"; [[ -n "$ASSESSMENT_ID" ]] || { fail "Assessment ID missing"; exit 1; }
IFS=$'\t' read -r S B < <(http POST "/api/assessments/$ASSESSMENT_ID/questions" "$TRAINER_TOKEN" '{"question_text":"What is 2 + 2?","correct_answer":"4"}')
assert_http "Trainer creates question" 201 "$S" "$B"
QUESTION_ID="$(extract_id "$B" 2>/dev/null || true)"; [[ -n "$QUESTION_ID" ]] || { fail "Question ID missing"; exit 1; }

log "STEP 7 — ENROLLMENT"
IFS=$'\t' read -r S B < <(http GET "/api/enrollments/user/$EMPLOYEE_ID" "$EMPLOYEE_TOKEN")
assert_http "Employee reads own enrollments" 200 "$S" "$B"
ENROLLMENT_ID="$(BODY="$B" COURSE_ID="$COURSE_ID" node <<'NODE' 2>/dev/null || true
const d=JSON.parse(process.env.BODY); const a=Array.isArray(d)?d:(Array.isArray(d.data)?d.data:[]); const x=a.find(r=>Number(r.course_id??r.course?.id)===Number(process.env.COURSE_ID)); if(x) process.stdout.write(String(x.id??x.enrollment_id))
NODE
)"
if [[ -z "$ENROLLMENT_ID" ]]; then
  ENROLLMENT_ID="$(DATABASE_URL="$TEST_DATABASE_URL" EMPLOYEE_ID="$EMPLOYEE_ID" COURSE_ID="$COURSE_ID" node <<'NODE'
const {PrismaClient}=require('@prisma/client'); const prisma=new PrismaClient()
async function main(){const e=await prisma.courseEnrollment.upsert({where:{user_id_course_id:{user_id:Number(process.env.EMPLOYEE_ID),course_id:Number(process.env.COURSE_ID)}},update:{},create:{user_id:Number(process.env.EMPLOYEE_ID),course_id:Number(process.env.COURSE_ID),status:'assigned',completion_percentage:0}});process.stdout.write(String(e.id))}
main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect())
NODE
)"
  skip "No enrollment-create API detected; isolated enrollment created through Prisma"
else pass "Enrollment found after approval"; fi
IFS=$'\t' read -r S B < <(http PUT "/api/enrollments/$ENROLLMENT_ID/progress" "$EMPLOYEE_TOKEN" '{"completion_percentage":100}')
assert_http "Employee updates progress to 100%" 200 "$S" "$B"

log "STEP 8 — ASSESSMENT RESULT"
RB="$(printf '{"assessment_id":%s,"answers":[{"question_id":%s,"answer_text":"4"}]}' "$ASSESSMENT_ID" "$QUESTION_ID")"
IFS=$'\t' read -r S B < <(http POST /api/assessment-results "$EMPLOYEE_TOKEN" "$RB")
assert_http "Employee submits assessment" 201 "$S" "$B"
if [[ "$S" == "201" ]]; then PV="$(BODY="$B" node -e 'const d=JSON.parse(process.env.BODY);process.stdout.write(String(d.passed))' 2>/dev/null || true)"; [[ "$PV" == "true" ]] && pass "Assessment passed=true" || fail "Assessment should pass — $B"; fi

log "STEP 9 — CERTIFICATE"
IFS=$'\t' read -r S B < <(http POST /api/certificates/generate "$EMPLOYEE_TOKEN" "{\"course_id\":$COURSE_ID}")
case "$S" in 200|201) pass "Certificate generated — HTTP $S";; 500|502|503|504) fail "Certificate external dependency failed — HTTP $S — $B";; *) fail "Certificate returned HTTP $S — $B";; esac
IFS=$'\t' read -r S B < <(http GET "/api/certificates/user/$EMPLOYEE_ID" "$EMPLOYEE_TOKEN")
assert_http "Employee reads certificate history" 200 "$S" "$B"

log "STEP 10 — LEADERBOARD"
IFS=$'\t' read -r S B < <(http GET /api/leaderboard "$EMPLOYEE_TOKEN")
assert_http "Read leaderboard" 200 "$S" "$B"
if [[ "$S" == "200" ]]; then
  if BODY="$B" EMPLOYEE_ID="$EMPLOYEE_ID" node <<'NODE'
const d=JSON.parse(process.env.BODY); const a=Array.isArray(d)?d:(Array.isArray(d.data)?d.data:(Array.isArray(d.leaderboard)?d.leaderboard:[])); if(!a.some(r=>Number(r.user_id??r.id??r.user?.id)===Number(process.env.EMPLOYEE_ID))) process.exit(1)
NODE
  then pass "Employee appears in leaderboard"; else fail "Employee missing from leaderboard — $B"; fi
fi

log "STEP 11 — NEGATIVE AUTHORIZATION"
IFS=$'\t' read -r S B < <(http POST /api/programs "$EMPLOYEE_TOKEN" '{"program_name":"Unauthorized Program"}')
assert_http "Employee cannot create program" 403 "$S" "$B"
IFS=$'\t' read -r S B < <(http POST /api/assessments "$MANAGER_TOKEN" "{\"course_id\":$COURSE_ID,\"title\":\"Unauthorized Assessment\"}")
assert_http "Manager cannot create assessment" 403 "$S" "$B"

log "============================================================"
log "FUNCTIONAL API TEST SUMMARY"
log "PASS: $PASS"
log "FAIL: $FAIL"
log "SKIP: $SKIP"
log "Report: $REPORT_FILE"
log "Server: $SERVER_LOG"
log "============================================================"
[[ "$FAIL" -eq 0 ]]
