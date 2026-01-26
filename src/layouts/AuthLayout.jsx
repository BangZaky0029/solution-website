// C:\codingVibes\nuansasolution\.mainweb\payments\solution-website\src\layouts\AuthLayout.jsx
// Fixed - Isolated layout untuk auth pages

import { Outlet } from 'react-router-dom';
import '../styles/Style_forWebsite/Auth.css';

const AuthLayout = () => {
  return (
    <div className="auth-layout-wrapper">
      <Outlet />
    </div>
  );
};

export default AuthLayout;