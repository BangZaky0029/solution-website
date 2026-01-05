// =========================================
// FILE: src/App.jsx - FINAL FIX
// =========================================

import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';

import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VerifyOTP from './pages/Auth/VerifyOTP';
import Profile from './pages/Profile/Profile';
import PaymentPage from './pages/Payment/PaymentPage';
import PaymentConfirmation from './pages/Payment/PaymentConfirmation';
import FeaturesPage from './pages/Features/FeaturesPage';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;
