import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Menu, X } from 'lucide-react';
import authService from '../services/authService.ts';

interface AppNavbarProps {
  showAuthLinks?: boolean;
}

const AppNavbar = ({ showAuthLinks = true }: AppNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
    } catch {
      // ignore
    } finally {
      navigate('/', { replace: true });
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Parent Form', path: '/ParentForm' },
    { name: 'Societal', path: '/Societal' },
    ...(showAuthLinks
      ? [{ name: 'Login', path: '/login' }, { name: 'Signup', path: '/signup' }]
      : [{ name: 'Profile', path: '/profile' }]),
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-black/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#0D9488] rounded-xl flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#000000]">
              NaviRiti
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="text-[#000000] hover:text-[#0D9488] transition-colors font-medium text-base"
              >
                {link.name}
              </a>
            ))}
            {!showAuthLinks && (
              <button
                onClick={handleLogout}
                className="rounded-full border border-[#0D9488] px-3 py-1.5 text-sm font-semibold text-[#0D9488] hover:bg-[#0D9488] hover:text-white transition"
              >
                Logout
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#000000] hover:text-[#0D9488]"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="block py-2 text-[#000000] hover:text-[#0D9488] transition-colors"
              >
                {link.name}
              </a>
            ))}
            {!showAuthLinks && (
              <button
                onClick={handleLogout}
                className="mt-2 w-full rounded-full border border-[#0D9488] px-3 py-2 text-sm font-semibold text-[#0D9488] hover:bg-[#0D9488] hover:text-white transition"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppNavbar;


