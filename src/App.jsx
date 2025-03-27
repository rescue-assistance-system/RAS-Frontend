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
import './App.css';

function App() {
  const { isOpen, isLoggedIn } = useSidebarStore();
  return (
    <Router>
      <Routes>
        {/* Route cho trang Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route cho trang chính */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <div className="flex">
                <Sidebar />
                <div
                  className={`flex-1 transition-all duration-300 ${
                    isOpen ? 'ml-54' : 'ml-22'
                  }`}
                >
                  <Header />
                </div>
              </div>
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
