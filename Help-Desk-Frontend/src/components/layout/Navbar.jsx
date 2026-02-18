import React, { useState } from 'react';
import { Menu, X, LifeBuoy } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between relative">
          {/* Logo - Left */}
          <div className="flex items-center">
            <Link to="/" onClick={handleLogoClick} className="flex-shrink-0 flex items-center gap-2">
              <LifeBuoy className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-800">HelpDesk</span>
            </Link>
          </div>
          
          {/* Links - Center */}
          <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link to="/#layanan" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Layanan</Link>
            <Link to="/informasi" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Informasi</Link>
            <Link to="/histori" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Histori</Link>
          </div>

          {/* Button & Mobile Menu - Right */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <Link to="/buat-pengaduan" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Buat Pengaduan
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-blue-600 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/#layanan" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Layanan</Link>
            <Link to="/informasi" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Informasi</Link>
            <Link to="/histori" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Histori</Link>
            <Link to="/buat-pengaduan" className="block w-full text-center px-3 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Buat Pengaduan
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
