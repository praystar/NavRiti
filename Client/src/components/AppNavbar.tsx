/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Menu, 
  X, 
  User, 
  Users, 
  Globe, 
  Sparkles, 
  Star, 
  Home, 
  LayoutDashboard,
  ChevronRight
} from 'lucide-react';

interface AppNavbarProps {
  showAuthLinks?: boolean;
}

const AppNavbar = ({ showAuthLinks = true }: AppNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const navigate = useNavigate();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen && 
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target as Node) &&
        // Don't close if clicking the menu button itself
        !(event.target as Element).closest('.mobile-menu-button')
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close mobile menu on escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen]);

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
      name: 'Home', 
      path: '/', 
      icon: <Home className="w-4 h-4" />,
      description: 'Welcome Portal'
    },
    { 
      name: 'Dashboard', 
      path: '/Dashboard', 
      icon: <LayoutDashboard className="w-4 h-4" />,
      description: 'Overview Panel'
    },
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

        /* Custom scrollbar for mobile menu */
        .mobile-menu-scrollable {
          scrollbar-width: thin;
          scrollbar-color: rgba(99, 102, 241, 0.5) rgba(30, 41, 59, 0.1);
        }
        
        .mobile-menu-scrollable::-webkit-scrollbar {
          width: 4px;
        }
        
        .mobile-menu-scrollable::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.1);
          border-radius: 2px;
        }
        
        .mobile-menu-scrollable::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 2px;
        }
        
        .mobile-menu-scrollable::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
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
                  <Compass className="w-6 h-6 text-white animate-compass-3d group-hover:animate-compass-spin" />
                  <div className="absolute inset-0 rounded-xl border border-indigo-400/30 animate-pulse group-hover:border-indigo-300/50 transition-colors duration-300"></div>
                </div>
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

            {/* Desktop Navigation - Now shows only on screens 1024px and above */}
            <div className="hidden lg:flex items-center space-x-1">
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
            </div>

            {/* Mobile Menu Button - Now shows below 1024px */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="mobile-menu-button relative p-2 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 text-gray-300 transition-all hover:bg-white/10 hover:border-white/20"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 transition-transform duration-300" />
                ) : (
                  <Menu className="w-6 h-6 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Shows below 1024px */}
        {isMenuOpen && (
          <div className="lg:hidden">
            {/* Backdrop overlay */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* Mobile menu panel */}
            <div 
              ref={mobileMenuRef}
              className="fixed top-16 right-0 left-0 z-50 transform transition-transform duration-300 ease-out bg-gray-900 border-b border-indigo-500/20 shadow-2xl"
            >
              <div 
                className="mobile-menu-scrollable max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-6 space-y-2"
                style={{ scrollBehavior: 'smooth' }}
              >
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-xl backdrop-blur-sm bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-200 group/mobile active:scale-95"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover/mobile:bg-indigo-500/20 transition-colors duration-200">
                        {link.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-white group-hover/mobile:text-indigo-200 transition-colors duration-200">
                          {link.name}
                        </span>
                        <span className="text-xs text-gray-400 group-hover/mobile:text-gray-300 transition-colors duration-200">
                          {link.description}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-indigo-400 opacity-0 group-hover/mobile:opacity-100 transition-all duration-200 transform group-hover/mobile:translate-x-1" />
                  </a>
                ))}
              </div>
              
              {/* Close hint for mobile users */}
              <div className="px-4 py-3 border-t border-white/5 text-center">
                <span className="text-xs text-gray-500">
                  Tap outside to close
                </span>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default AppNavbar;