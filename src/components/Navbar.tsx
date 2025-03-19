
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-truthscan-black/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-white font-medium"
        >
          <Shield className="w-6 h-6 text-truthscan-blue" />
          <span className="text-xl font-bold">TruthScan</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm transition-all hover:text-truthscan-blue ${
              isActive('/') ? 'text-truthscan-blue' : 'text-white/90'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/scanner" 
            className={`text-sm transition-all hover:text-truthscan-blue ${
              isActive('/scanner') ? 'text-truthscan-blue' : 'text-white/90'
            }`}
          >
            Scanner
          </Link>
          <Link 
            to="/about" 
            className={`text-sm transition-all hover:text-truthscan-blue ${
              isActive('/about') ? 'text-truthscan-blue' : 'text-white/90'
            }`}
          >
            About
          </Link>
          <Link
            to="/scanner"
            className="px-5 py-2 bg-truthscan-blue rounded-md text-white text-sm font-medium transition-all hover:bg-truthscan-blue/90"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-truthscan-black/95 backdrop-blur-lg shadow-lg animate-slide-down">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`text-sm py-2 transition-all hover:text-truthscan-blue ${
                isActive('/') ? 'text-truthscan-blue' : 'text-white/90'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/scanner" 
              className={`text-sm py-2 transition-all hover:text-truthscan-blue ${
                isActive('/scanner') ? 'text-truthscan-blue' : 'text-white/90'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Scanner
            </Link>
            <Link 
              to="/about" 
              className={`text-sm py-2 transition-all hover:text-truthscan-blue ${
                isActive('/about') ? 'text-truthscan-blue' : 'text-white/90'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/scanner"
              className="px-5 py-2 bg-truthscan-blue rounded-md text-white text-sm font-medium transition-all hover:bg-truthscan-blue/90 text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
