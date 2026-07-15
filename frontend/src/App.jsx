import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/auth/Login";
import AuthCallback from "./pages/auth/AuthCallback";

// ================= EMPLOYEE =================
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MyCourses from "./pages/employee/MyCourses";
import CourseDetail from "./pages/employee/CourseDetail";
import CertificatesPage from "./pages/employee/CertificatePage";
import AssessmentPage from "./pages/employee/AssessmentPage";
import Leaderboard from "./pages/employee/Leaderboard";
import EmployeeNotifications from "./pages/employee/Notifications";
import EmployeeSettings from "./pages/employee/Settings";

// ================= HR =================
import HRDashboard from "./pages/hr/HRDashboard";
import GeneralTraining from "./pages/hr/GeneralTraining";
import CourseRequests from "./pages/hr/CourseRequests";
import CourseRequestDetail from "./pages/hr/CourseRequestDetail";
import TrainingRequests from "./pages/hr/TrainingRequests";
import Analytics from "./pages/hr/Analytics";
import Reports from "./pages/hr/Reports";
import Notifications from "./pages/hr/Notifications";
import Settings from "./pages/hr/Settings";

// ================= MANAGER =================
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import TrainingProposals from "./pages/manager/TrainingProposals";
import DepartmentTraining from "./pages/manager/DepartmentTraining";
import EmployeeProgress from "./pages/manager/EmployeeProgress";
import ManagerAnalytics from "./pages/manager/Analytics";
import ManagerNotifications from "./pages/manager/Notifications";
import ManagerSettings from "./pages/manager/Settings";

// ================= TRAINER =================
import TrainerDashboard from "./pages/trainer/Dashboard";
import TrainerCourseRequests from "./pages/trainer/CourseRequests";
import TrainerMyCourses from "./pages/trainer/MyCourses";
import TrainerNotifications from "./pages/trainer/Notifications";
import TrainerSettings from "./pages/trainer/Settings";

// ================= COMMON =================
import ComingSoon from "./components/common/ComingSoon";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Redirect */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          {/* Login */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* OAuth */}
          <Route
            path="/auth/callback"
            element={<AuthCallback />}
          />

          {/* ========================================================= */}
          {/* EMPLOYEE */}
          {/* ========================================================= */}

          <Route
            path="/employee"
            element={<DashboardLayout title="Dashboard Overview" />}
          >
            <Route
              index
              element={<EmployeeDashboard />}
            />

            <Route
              path="courses"
              element={<MyCourses />}
            />

            <Route
              path="courses/:courseId"
              element={<CourseDetail />}
            />

            <Route
              path="courses/:courseId/assessment"
              element={<AssessmentPage />}
            />

            <Route
              path="certificates"
              element={<CertificatesPage />}
            />

            <Route
              path="leaderboard"
              element={<Leaderboard />}
            />

            <Route
              path="notifications"
              element={<EmployeeNotifications />}
            />

            <Route
              path="settings"
              element={<EmployeeSettings />}
            />
          </Route>

          {/* ========================================================= */}
          {/* MANAGER */}
          {/* ========================================================= */}

          <Route
            path="/manager"
            element={<DashboardLayout title="Manager Dashboard" />}
          >
            <Route
              index
              element={<ManagerDashboard />}
            />

            <Route
              path="proposals"
              element={<TrainingProposals />}
            />

            <Route
              path="department-training"
              element={<DepartmentTraining />}
            />

            <Route
              path="progress"
              element={<EmployeeProgress />}
            />

            <Route
              path="analytics"
              element={<ManagerAnalytics />}
            />

            <Route
              path="notifications"
              element={<ManagerNotifications />}
            />

            <Route
              path="settings"
              element={<ManagerSettings />}
            />
          </Route>

          {/* ========================================================= */}
          {/* HR */}
          {/* ========================================================= */}

          <Route
            path="/hr"
            element={<DashboardLayout title="HR Dashboard" />}
          >
            <Route
              index
              element={<HRDashboard />}
            />

            <Route
              path="programs"
              element={<GeneralTraining />}
            />

            <Route
              path="course-requests"
              element={<CourseRequests />}
            />

            <Route
              path="course-requests/:id"
              element={<CourseRequestDetail />}
            />

            <Route
              path="training-requests"
              element={<TrainingRequests />}
            />

            <Route
              path="analytics"
              element={<Analytics />}
            />

            <Route
              path="reports"
              element={<Reports />}
            />

            <Route
              path="notifications"
              element={<Notifications />}
            />

            <Route
              path="settings"
              element={<Settings />}
            />
          </Route>

          {/* ========================================================= */}
          {/* TRAINER */}
          {/* ========================================================= */}

          <Route
            path="/trainer"
            element={<DashboardLayout title="Trainer Dashboard" />}
          >
            <Route
              index
              element={<TrainerDashboard />}
            />

            <Route
              path="requests"
              element={<TrainerCourseRequests />}
            />

            <Route
              path="courses"
              element={<TrainerMyCourses />}
            />

            <Route
              path="curriculum"
              element={<ComingSoon title="Curriculum Design Studio" />}
            />

            <Route
              path="notifications"
              element={<TrainerNotifications />}
            />

            <Route
              path="settings"
              element={<TrainerSettings />}
            />
          </Route>

          {/* 404 */}

          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}