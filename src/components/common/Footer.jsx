// =========================================
// FILE: src/components/common/Footer.jsx
// =========================================
import { Link } from 'react-router-dom';
import logo from '../../assets/images/nuansaLogo.png';

const Footer = () => {

  return (
    <footer className="bg-gray-900 text-white py-20">
      <div className="container-max">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          
          {/* BRAND */}
          <div>
            <img src={logo} alt="Nuansasolution" className="w-32 mb-1" />
            <p className="text-gray-400 text-sm">
              Platform pembayaran terpadu dengan berbagai tools dan features unggulan.
            </p>
          </div>

          {/* PRODUCT */}
          <div>
            <h4 className="font-bold mb-4 text-gray-300">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/#features" className="hover:text-white transition">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/#pricing" className="hover:text-white transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="font-bold mb-4 text-gray-300">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="font-bold mb-4 text-gray-300">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-white transition">
                  Security
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-10 text-center text-sm text-gray-400">
          <p>&copy; 2022 nuansasolution.id. | All rights reserved.</p>
        </div>  
      </div>
    </footer>
  );
};

export default Footer;
