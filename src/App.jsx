import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/auth/Login';

import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import CourseDetail from './pages/employee/CourseDetail';

import ComingSoon from './components/common/ComingSoon';
import AssessmentPage from './pages/employee/AssessmentPage';

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

          {/* ================= EMPLOYEE ================= */}
          <Route
            path="/employee"
            element={
              <DashboardLayout title="Dashboard Overview" />
            }
          >
            <Route
              index
              element={<EmployeeDashboard />}
            />

            <Route
              path="courses"
              element={<CourseDetail />}
            />

            {/* TAMBAHKAN INI */}
            <Route
              path="assessment/1"
              element={<AssessmentPage />}
            />

            <Route
              path="certificates"
              element={<ComingSoon title="My Certificates" />}
            />

            <Route
              path="notifications"
              element={<ComingSoon title="Notifications" />}
            />

            <Route
              path="settings"
              element={<ComingSoon title="Settings" />}
            />
          </Route>

          {/* ================= MANAGER ================= */}
          <Route
            path="/manager"
            element={
              <DashboardLayout title="Manager Dashboard" />
            }
          >
            <Route
              index
              element={<ComingSoon title="Manager Dashboard" />}
            />

            <Route
              path="proposals"
              element={<ComingSoon title="Training Proposals" />}
            />

            <Route
              path="progress"
              element={<ComingSoon title="Employee Progress" />}
            />

            <Route
              path="notifications"
              element={<ComingSoon title="Notifications" />}
            />

            <Route
              path="settings"
              element={<ComingSoon title="Settings" />}
            />
          </Route>

          {/* ================= HR ================= */}
          <Route
            path="/hr"
            element={
              <DashboardLayout title="HR Dashboard" />
            }
          >
            <Route
              index
              element={<ComingSoon title="HR Dashboard" />}
            />

            <Route
              path="programs"
              element={<ComingSoon title="General Training Program" />}
            />

            <Route
              path="course-requests"
              element={<ComingSoon title="Course Requests" />}
            />

            <Route
              path="reports"
              element={<ComingSoon title="Training Reports" />}
            />

            <Route
              path="settings"
              element={<ComingSoon title="Settings" />}
            />
          </Route>

          {/* ================= TRAINER ================= */}
          <Route
            path="/trainer"
            element={
              <DashboardLayout title="Trainer Dashboard" />
            }
          >
            <Route
              index
              element={<ComingSoon title="Trainer Dashboard" />}
            />

            <Route
              path="requests"
              element={<ComingSoon title="Course Requests" />}
            />

            <Route
              path="courses"
              element={<ComingSoon title="My Courses" />}
            />

            <Route
              path="curriculum"
              element={<ComingSoon title="Curriculum Design Studio" />}
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