// =========================================
// FILE: src/components/common/Footer.jsx
// =========================================
import { Link } from 'react-router-dom';
import logo from '../../assets/images/nuansaLogo.png';

// Import styling khusus mobile (full width fix)
import '../../styles/Style_forMobile/Footer.mobile.css';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-20">
      {/* Container utama dengan max-width untuk desktop, full width di mobile */}
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        {/* Grid layout: 1 kolom di mobile, 4 kolom di desktop */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* BRAND SECTION */}
          <div>
            <img
              src={logo}
              alt="Nuansasolution"
              className="w-32 mb-6"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Platform pembayaran terpadu dengan berbagai tools dan features unggulan.
            </p>
          </div>

          {/* PRODUCT */}
          <div>
            <h4 className="font-bold mb-4 text-gray-300 text-lg">Product</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link to="/features" className="hover:text-white transition duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition duration-200">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition duration-200">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="font-bold mb-4 text-gray-300 text-lg">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white transition duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="font-bold mb-4 text-gray-300 text-lg">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link to="/privacy" className="hover:text-white transition duration-200">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition duration-200">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-white transition duration-200">
                  Security
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2022–2026 nuansasolution.id. | All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;