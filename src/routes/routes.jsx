import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import Dashboard from '../pages/Dashboard';
import NewsManagement from '../pages/NewsManagement';
import RescueTeamManagement from '../pages/RescueTeamManagement';
import FirstAidManagement from '../pages/FirstAidManagement';
// import Register from '../pages/Register';
import AuthLayout from '../layouts/AuthLayout';
import PublicRoute from './PublicRoutes';
import ProtectedRoute from './ProtectedRoutes';
import LoginPage from '../pages/Login';
import CoordinatorManagement from '../pages/CoordinatorManagement';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<AuthLayout />}>
        <Route
          path="login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        {/* <Route path="register" element={<Register />} /> */}
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<Dashboard />} />
          <Route path="alternate" element={<Dashboard />} />
        </Route>

        <Route path="news">
          <Route index element={<div>News Home</div>} />
          <Route path="news-emergency" element={<NewsManagement />} />
          <Route path="first-aid" element={<FirstAidManagement />} />
          <Route
            path="chat"
            element={<div className="p-4">Chat News Page</div>}
          />
        </Route>

        <Route path="rescue-teams">
          <Route index element={<RescueTeamManagement />} />
        </Route>
        <Route path="coordinators">
          <Route index element={<CoordinatorManagement />} />
        </Route>

        <Route path="analytics">
          <Route index element={<div className="p-4">Analytics Page</div>} />
        </Route>

        <Route path="user-management">
          <Route
            index
            element={<div className="p-4">User Management Page</div>}
          />
        </Route>

        <Route path="settings">
          <Route index element={<div className="p-4">Settings Page</div>} />
          <Route
            path="products"
            element={<div className="p-4">Products Settings Page</div>}
          />
        </Route>
      </Route>

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
