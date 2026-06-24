import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRightToLine,
  Info,
  ShieldCheck,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import loginIllustration from '../../assets/login-illustration.png';
import { loginWithRole, loginWithGoogle } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../mock/entitySchemas';

const DASHBOARD_PATH_BY_ROLE = {
  [ROLES.EMPLOYEE]: '/employee',
  [ROLES.MANAGER]: '/manager',
  [ROLES.HR]: '/hr',
  [ROLES.TRAINER]: '/trainer',
};

const ROLE_OPTIONS = [
  { value: ROLES.EMPLOYEE, label: 'Employee' },
  { value: ROLES.MANAGER, label: 'Manager' },
  { value: ROLES.HR, label: 'HR' },
  { value: ROLES.TRAINER, label: 'Trainer' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState(ROLES.EMPLOYEE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSsoLogin() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loginWithRole(selectedRole);
      login(result);
      navigate(DASHBOARD_PATH_BY_ROLE[result.role] ?? '/employee');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-16 items-center">

        {/* LEFT PANEL */}
        <div className="flex flex-col items-center justify-center bg-[#EEF3FF] rounded-[32px] px-16 py-14">
          <div className="w-[360px] overflow-hidden rounded-[40px] border-[10px] border-black bg-white shadow-2xl">
            <img
              src={loginIllustration}
              alt="Enterprise Learning"
              className="w-full object-cover"
            />
          </div>
          <h2 className="mt-10 text-[42px] font-bold text-brand-700 text-center">
            Empower Your Workforce
          </h2>
          <p className="mt-5 max-w-md text-center text-lg leading-8 text-gray-500">
            Industry-leading professional development and adaptive learning
            experiences designed for the modern enterprise.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex justify-center">
          <div className="w-full max-w-[500px] rounded-[32px] bg-white px-14 py-16 shadow-xl">

            {/* LOGO */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-brand-600 text-3xl font-bold text-white shadow-lg">
                E
              </div>
              <h1 className="mt-8 text-[32px] font-bold leading-tight text-gray-900">
                Corporate Training & Learning
                <br />
                Management System
              </h1>
              <p className="mt-4 text-sm leading-7 text-gray-500">
                Welcome back. Please sign in to access your dashboard.
              </p>
            </div>

            {/* GOOGLE LOGIN BUTTON */}
            <button
              onClick={handleGoogleLogin}
              className="mt-10 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-4 font-semibold text-gray-700 shadow-md transition hover:bg-gray-50"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                width={20}
                alt="Google"
              />
              Login with Google
            </button>

            {/* DIVIDER */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="text-[11px] tracking-[2px] text-gray-400">
                ATAU TESTING
              </span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            {/* ROLE - testing only */}
            <div>
              <label className="mb-2 block text-xs text-gray-500">
                Login as (testing only)
              </label>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-brand-400"
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            {/* SSO LOGIN BUTTON - testing only */}
            <button
              onClick={handleSsoLogin}
              disabled={isLoading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-4 font-semibold text-white shadow-lg transition hover:bg-brand-600"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <ArrowRightToLine size={18} />
                  Login with Company Account
                </>
              )}
            </button>

            {error && (
              <p className="mt-3 text-center text-sm text-red-500">{error}</p>
            )}

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Info size={14} />
              Sign in using your corporate Google account.
            </div>

            {/* DIVIDER */}
            <div className="my-10 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="text-[11px] tracking-[2px] text-gray-400">
                CORPORATE ENVIRONMENT
              </span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            {/* HELP */}
            <div className="text-center">
              <button className="text-sm font-medium text-brand-600 hover:underline">
                Having trouble signing in?
              </button>
            </div>

            {/* SECURITY BADGE */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2 text-xs text-gray-500">
                <ShieldCheck size={14} />
                SECURE ENTERPRISE AUTHENTICATION
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}