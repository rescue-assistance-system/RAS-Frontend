import { Outlet } from 'react-router-dom';
// import LoginPage from '../pages/Login';

const AuthLayout = () => {
  return (
    <div className="auth-container">
      {/* <LoginPage/> */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
