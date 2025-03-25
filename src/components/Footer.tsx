
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/20 border-t border-white/5">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-6 h-6 text-truthscan-blue" />
              <span className="text-xl font-bold text-white">TruthScan</span>
            </div>
            <p className="text-white/70 max-w-md mb-6">
              AI-powered detection technology for identifying manipulated images, documents, and deepfakes with precision and accuracy.
            </p>
            <p className="text-white/50 text-sm">
              &copy; {currentYear} TruthScan. All rights reserved.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/70 hover:text-truthscan-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/scanner" className="text-white/70 hover:text-truthscan-blue transition-colors">
                  Scanner
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/70 hover:text-truthscan-blue transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-truthscan-blue transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-truthscan-blue transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-truthscan-blue transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
