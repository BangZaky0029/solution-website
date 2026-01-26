// C:\codingVibes\nuansasolution\.mainweb\payments\solution-website\src\App.jsx
// Enhanced with Forgot Password Routes

import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Protected Route
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VerifyOTPPage from './pages/VerifyOTPPage';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Profile from './pages/Profile/Profile';
import PaymentPage from './pages/Payment/PaymentPage';
import PaymentConfirmation from './pages/Payment/PaymentConfirmation';
import FeaturesPage from './pages/Features/FeaturesPage';
import NotFound from './pages/NotFound';

// Info Pages
import {
  About,
  Blog,
  Contact,
  Privacy,
  Terms,
  Security,
  FAQ
} from './pages/Info';

import './App.css';

function App() {
  return (
    <ToastProvider>
      <Routes>

        {/* ================= AUTH (NO HEADER / FOOTER) ================= */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* 🔥 GANTI DENGAN COMPONENT BARU */}
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* ================= MAIN (WITH HEADER / FOOTER) ================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          
          {/* 🔒 Protected Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          } />
          <Route path="/payment-confirmation" element={
            <ProtectedRoute>
              <PaymentConfirmation />
            </ProtectedRoute>
          } />
          
          <Route path="/features" element={<FeaturesPage />} />

          {/* Info Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/security" element={<Security />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </ToastProvider>
  );
}

export default App;