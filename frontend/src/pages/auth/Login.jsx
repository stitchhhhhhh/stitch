import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Info,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import loginIllustration from "../../assets/login-illustration.png";

import {
  loginWithEmail,
  loginWithGoogle,
} from "../../services/authService";

import { useAuth } from "../../context/AuthContext";

const LOGIN_ERROR_MESSAGES = {
  not_registered:
    "Your account is not registered in this system. Please contact the administrator.",

  account_inactive:
    "Your account is currently inactive. Please contact the administrator.",

  email_not_found:
    "An email address could not be retrieved from your Google account.",

  unauthorized:
    "You are not authorized to access this system.",

  login_failed:
    "Google sign-in failed. Please try again.",
};

const DASHBOARD_PATH_BY_ROLE = {
  EMPLOYEE: "/employee",
  MANAGER: "/manager",
  TRAINER: "/trainer",
  HR: "/hr",
};

function getRoleName(data) {
  return (
    data?.role?.name ||
    data?.role?.role_name ||
    data?.role ||
    data?.user?.role?.name ||
    data?.user?.role?.role_name ||
    data?.user?.role_name ||
    ""
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /*
   * Penting:
   * login berasal dari AuthContext.
   * Ini yang membuat Topbar, Sidebar, dan dashboard
   * membaca role yang benar.
   */
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [emailLoading, setEmailLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const callbackError = searchParams.get("error");

  useEffect(() => {
    if (!callbackError) {
      return;
    }

    setError(
      LOGIN_ERROR_MESSAGES[callbackError] ||
        "Authentication failed. Please try again."
    );

    setGoogleLoading(false);
  }, [callbackError]);

  async function handleEmailLogin(event) {
    event.preventDefault();

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setError("");
      setEmailLoading(true);

      const data = await loginWithEmail(
        normalizedEmail,
        password
      );

      console.log("EMAIL LOGIN RESPONSE:", data);

      if (!data?.token) {
        throw new Error(
          "Login berhasil, tetapi token autentikasi tidak diterima."
        );
      }

      const role = String(getRoleName(data))
        .trim()
        .toUpperCase();

      if (!role) {
        throw new Error(
          "Login berhasil, tetapi role pengguna tidak ditemukan."
        );
      }

      const destination =
        DASHBOARD_PATH_BY_ROLE[role];

      if (!destination) {
        throw new Error(
          `Dashboard untuk role "${role}" tidak ditemukan.`
        );
      }

      /*
       * Menyimpan user, role, dan token ke AuthContext.
       * AuthContext kemudian menyimpannya sesuai
       * mekanisme aplikasi.
       */
      login({
        user: data.user,
        role,
        token: data.token,
      });

      navigate(destination, {
        replace: true,
      });
    } catch (loginError) {
      console.error(
        "EMAIL LOGIN ERROR:",
        loginError
      );

      setError(
        loginError?.message ||
          "Email or password is incorrect."
      );
    } finally {
      setEmailLoading(false);
    }
  }

  function handleGoogleLogin() {
    try {
      setError("");
      setGoogleLoading(true);

      loginWithGoogle();
    } catch (loginError) {
      console.error(
        "GOOGLE LOGIN ERROR:",
        loginError
      );

      setError(
        loginError?.message ||
          "Google sign-in failed. Please try again."
      );

      setGoogleLoading(false);
    }
  }

  const loading =
    emailLoading || googleLoading;

  return (
    <main className="min-h-screen bg-[#F7F8FC] px-4 py-4 sm:px-6 lg:h-screen lg:min-h-0 lg:overflow-hidden">
      <div className="mx-auto grid min-h-[calc(100vh-32px)] w-full max-w-6xl grid-cols-1 items-center gap-5 lg:h-full lg:min-h-0 lg:grid-cols-2 lg:gap-8">
        {/* Left panel */}
        <section className="hidden h-[calc(100vh-32px)] max-h-[720px] flex-col items-center justify-center overflow-hidden rounded-[28px] bg-[#EEF3FF] px-8 py-6 lg:flex">
          <div className="w-full max-w-[245px] overflow-hidden rounded-[30px] border-[7px] border-black bg-white shadow-xl">
            <img
              src={loginIllustration}
              alt="Enterprise learning illustration"
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </div>

          <h2 className="mt-5 text-center text-[28px] font-bold leading-tight text-brand-700">
            Empower Your Workforce
          </h2>

          <p className="mt-2 max-w-md text-center text-sm leading-5 text-gray-500">
            Professional development and adaptive
            learning experiences designed for the
            modern enterprise.
          </p>
        </section>

        {/* Right panel */}
        <section className="flex min-h-[calc(100vh-32px)] items-center justify-center lg:h-full lg:min-h-0 lg:overflow-hidden">
          <div className="w-full max-w-[420px] rounded-[26px] bg-white px-6 py-6 shadow-lg sm:px-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-xl font-bold text-white shadow-md">
                E
              </div>

              <h1 className="mt-4 text-[24px] font-bold leading-tight text-gray-900">
                Corporate Training &amp; Learning
                Management System
              </h1>

              <p className="mt-2 text-sm leading-5 text-gray-500">
                Welcome back. Please sign in to
                access your dashboard.
              </p>
            </div>

            <form
              onSubmit={handleEmailLogin}
              className="mt-5 space-y-3"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    autoComplete="email"
                    placeholder="Enter your registered email"
                    disabled={loading}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    placeholder="Enter your LMS password"
                    disabled={loading}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-gray-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {emailLoading && (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                )}

                {emailLoading
                  ? "Signing In..."
                  : "Sign In"}
              </button>
            </form>

            {error && (
              <div
                role="alert"
                className="mt-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
              >
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-500"
                />

                <p className="text-sm leading-5 text-red-600">
                  {error}
                </p>
              </div>
            )}

            <div className="my-4 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-xs font-medium text-gray-400">
                OR
              </span>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {googleLoading ? (
                <LoaderCircle
                  size={20}
                  className="animate-spin"
                />
              ) : (
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  width={20}
                  height={20}
                  alt="Google"
                />
              )}

              {googleLoading
                ? "Redirecting to Google..."
                : "Continue with Google"}
            </button>

            <div className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-gray-400">
              <Info
                size={14}
                className="shrink-0"
              />

              <span>
                Use your registered LMS account
                or Google account.
              </span>
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4 text-center">
              <p className="text-sm text-gray-500">
                Having trouble signing in?
              </p>

              <p className="mt-1 text-sm font-medium text-brand-600">
                Please contact the system
                administrator.
              </p>
            </div>

            <div className="mt-4 flex justify-center">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-[10px] text-gray-500">
                <ShieldCheck size={13} />

                <span>
                  SECURE ENTERPRISE AUTHENTICATION
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}