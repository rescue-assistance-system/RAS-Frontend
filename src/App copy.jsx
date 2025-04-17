import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import useSidebarStore from './stores/sidebarStore';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';
import NewsManagement from './pages/NewsManagement';
import RescueTeamManagement from './pages/RescueTeamManagement';
import FirstAidManagement from './pages/FirstAidManagement';

function App() {
  const { isOpen, isLoggedIn } = useSidebarStore();

  const MainLayout = ({ children }) => (
    <div className="flex">
      <Sidebar />
      <div
        className={`flex-1 transition-all duration-300 ${
          isOpen ? 'ml-54' : 'ml-22'
        }`}
      >
        <Header />
        <div className="mt-16">{children}</div>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            isLoggedIn ? (
              <MainLayout>
                <Navigate to="/dashboard" />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <MainLayout>
                <Dashboard />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/dashboard/alternate"
          element={
            isLoggedIn ? (
              <MainLayout>
                <Dashboard />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/news/news-emergency"
          element={
            isLoggedIn ? (
              <MainLayout>
                <NewsManagement />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/news/first-aid"
          element={
            isLoggedIn ? (
              <MainLayout>
                <FirstAidManagement />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/news/chat"
          element={
            isLoggedIn ? (
              <MainLayout>
                <div className="p-4">Chat News Page</div>
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/rescue-teams"
          element={
            isLoggedIn ? (
              <MainLayout>
                <RescueTeamManagement />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/analytics"
          element={
            isLoggedIn ? (
              <MainLayout>
                <div className="p-4">Analytics Page</div>
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/user-management"
          element={
            isLoggedIn ? (
              <MainLayout>
                <div className="p-4">User Management Page</div>
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/settings"
          element={
            isLoggedIn ? (
              <MainLayout>
                <div className="p-4">Settings Page</div>
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/settings/products"
          element={
            isLoggedIn ? (
              <MainLayout>
                <div className="p-4">Products Settings Page</div>
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
