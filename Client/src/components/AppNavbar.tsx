import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Users, 
  Globe, 
  Sparkles, 
  Star, 
  ChevronRight
} from 'lucide-react';
import authService from '../services/authService.ts';

interface AppNavbarProps {
  showAuthLinks?: boolean;
}

const AppNavbar = ({ showAuthLinks = true }: AppNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const navigate = useNavigate();

 const handleLogout = async () => {
  try {
    await authService.logoutUser();
  } catch {
    // ignore
  } finally {
    // Clear the token from localStorage
    localStorage.removeItem('authToken');
    
    // If we're already on the homepage, reload to trigger App component re-render
    if (window.location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/', { replace: true });
    }
  }
};

  // FIX: useMemo ensures star positions are calculated only ONCE.
  // This prevents them from jumping when you hover or type.
  const staticStars = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      opacity: 0.3 + Math.random() * 0.4
    }));
  }, []);

  const navLinks = [
    { 
      name: 'Input', 
      path: '/Input', 
      icon: <Compass className="w-4 h-4" />,
      description: 'AI Analysis'
    },
    {
      name: 'Celestial', 
      path: '/Celestialmapping', 
      icon: <Star className="w-4 h-4" />,
      description: 'Star Mapping'
    },
    { 
      name: 'Parent', 
      path: '/ParentForm', 
      icon: <Users className="w-4 h-4" />,
      description: 'Family Input'
    },
    { 
      name: 'Societal', 
      path: '/Societal', 
      icon: <Globe className="w-4 h-4" />,
      description: 'Social Context'
    },
    ...(showAuthLinks
      ? [
          { 
            name: 'Login', 
            path: '/login', 
            icon: <Sparkles className="w-4 h-4" />,
            description: 'Begin Journey'
          }, 
          { 
            name: 'Signup', 
            path: '/signup', 
            icon: <User className="w-4 h-4" />,
            description: 'Join Cosmos'
          }
        ]
      : [
          { 
            name: 'Profile', 
            path: '/profile', 
            icon: <User className="w-4 h-4" />,
            description: 'Your Star Chart'
          }
        ]),
  ];

  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        /* Compass Animations */
        @keyframes compass-rotate-3d {
          0%, 100% { transform: rotate(50deg); }
          25% { transform: rotate(-50deg); }
          50% { transform: rotate(50deg); }
          75% { transform: rotate(-50deg); }
        }

        @keyframes compass-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-compass-3d {
          animation: compass-rotate-3d 2.5s ease-in-out infinite;
          transform-origin: center;
          display: inline-block;
        }

        .animate-compass-spin {
          animation: compass-spin 1s linear infinite;
          transform-origin: center;
          display: inline-block;
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .constellation-dot {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 6px 1px rgba(165, 180, 252, 0.7);
        }
      `}</style>
      
      <nav className="fixed top-0 w-full backdrop-blur-xl bg-gray-900/95 border-b border-indigo-500/20 z-50">
        {/* Constellation Background Effect - Positions are now static and floating */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {staticStars.map((star, i) => (
            <div
              key={i}
              className="constellation-dot animate-twinkle animate-float"
              style={{
                left: star.left,
                top: star.top,
                animationDelay: star.delay,
                opacity: star.opacity
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <a 
              href="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center transition-all duration-300">
                  {/* Applied compass-3d and group-hover:spin as requested */}
                  <Compass className="w-6 h-6 text-white animate-compass-3d group-hover:animate-compass-spin" />
                  
                  <div className="absolute inset-0 rounded-xl border border-indigo-400/30 animate-pulse group-hover:border-indigo-300/50 transition-colors duration-300"></div>
                </div>
                {/* Yellow dot removed from here */}
              </div>
              
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
                  NaviRiti
                </span>
                <span className="text-xs text-gray-400 font-medium -mt-1">
                  Cosmic Career Guide
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="relative px-4 py-2 rounded-lg group/navlink transition-all duration-300"
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg transition-opacity duration-300 ${
                    hoveredLink === link.name ? 'opacity-100' : 'opacity-0'
                  }`}></div>
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex items-center space-x-2">
                      <div className={`transition-colors duration-300 ${
                        hoveredLink === link.name ? 'text-indigo-300' : 'text-gray-400'
                      }`}>
                        {link.icon}
                      </div>
                      <span className={`font-medium transition-colors duration-300 ${
                        hoveredLink === link.name 
                          ? 'text-white' 
                          : 'text-gray-300'
                      }`}>
                        {link.name}
                      </span>
                    </div>
                    
                    <div className={`absolute top-full mt-2 whitespace-nowrap text-xs text-gray-400 transition-all duration-300 transform ${
                      hoveredLink === link.name 
                        ? 'opacity-100 -translate-y-1' 
                        : 'opacity-0 -translate-y-4'
                    }`}>
                      {link.description}
                    </div>
                  </div>
                  
                  <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all duration-300 ${
                    hoveredLink === link.name ? 'w-3/4' : 'w-0'
                  }`}></div>
                </a>
              ))}
              
              {!showAuthLinks && (
                <button
                  onClick={handleLogout}
                  className="relative ml-2 px-4 py-2 rounded-lg backdrop-blur-sm bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 hover:border-rose-400/30 transition-all duration-300 group/logout"
                >
                  <div className="relative z-10 flex items-center space-x-2">
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span className="font-medium text-rose-300">Logout</span>
                  </div>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative p-2 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 text-gray-300"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full w-full backdrop-blur-xl bg-gray-900/95 border-b border-indigo-500/20">
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-4 rounded-xl backdrop-blur-sm bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group/mobile"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                      {link.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{link.name}</span>
                      <span className="text-xs text-gray-400">{link.description}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-indigo-400 opacity-0 group-hover/mobile:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
      
      <div className="h-16"></div>
    </>
  );
};

export default AppNavbar;