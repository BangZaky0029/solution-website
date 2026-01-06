// =========================================
// FILE: src/main.jsx - UPDATED
// =========================================

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './hooks/useAuth'

// ===== GLOBAL STYLES =====
import './styles/Global.css'

// ===== WEBSITE STYLES =====
import './styles/Style_forWebsite/Home.css'
import './styles/Style_forWebsite/Auth.css'
import './styles/Style_forWebsite/Profile.css'
import './styles/Style_forWebsite/Payment.css'
import './styles/Style_forWebsite/Info.css'

// ===== COMPONENT STYLES (NEW) =====
import './styles/components/Features.enhanced.css'

// ===== MOBILE STYLES =====
import './styles/Style_forMobile/Home.mobile.css'
import './styles/Style_forMobile/Auth.mobile.css'
import './styles/Style_forMobile/Profile.mobile.css'
import './styles/Style_forMobile/Payment.mobile.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)