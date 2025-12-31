import { useState , useEffect} from 'react';
import {
  Compass,
  TrendingUp,
  Users,
  Award,
  Stethoscope,
  Code,
  Building2,
  Sparkles,
  Check,
  Menu,
  X,
  Star,
  ChevronRight,
  Zap,
  Target,
  Globe,
  LogIn,
  UserPlus,
} from 'lucide-react';
import Column from '../components/Column';
import { useInView } from "react-intersection-observer";
import Background from '../components/Background';
import authService from '../services/authService.ts';
import AppNavbar from '../components/AppNavbar.tsx';


// Custom styles for animations
const globalStyles = `
  @keyframes float-slow {
    0%, 100% { transform: rotateY(0deg) translateZ(0); }
    50% { transform: rotateY(180deg) translateZ(20px); }
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  
  @keyframes compass-rotate-3d {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-12deg); }
    50% { transform: rotate(8deg); }
    75% { transform: rotate(-6deg); }
  }

  @keyframes compass-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes float-slow-gentle {
    0%, 100% { transform: translateY(0) translateZ(0); }
    50% { transform: translateY(-10px) translateZ(10px); }
  }

  
  .animate-float-slow {
    animation: float-slow 8s ease-in-out infinite;
  }
  
  .animate-twinkle {
    animation: twinkle 3s ease-in-out infinite;
  }
  
  .animate-compass-3d {
    animation: compass-rotate-3d 1s ease-in-out infinite;
    transform-origin: center;
    display: inline-block;
  }

  .animate-compass-spin {
    animation: compass-spin 1s linear infinite;
    transform-origin: center;
    display: inline-block;
  }

  .animate-spin-slow {
    animation: spin-slow 20s linear infinite;
  }

  .animate-float-slow-gentle {
    animation: float-slow-gentle 3s ease-in-out infinite;
  }

  .perspective-1000 {
    perspective: 1000px;
  }

  .transform-style-3d {
    transform-style: preserve-3d;
  }

`;

// Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Login', path: '/login', icon: <LogIn className="w-4 h-4 mr-2" /> },
    { name: 'Signup', path: '/signup', icon: <UserPlus className="w-4 h-4 mr-2" /> },
  ];

  return (
    <>
      <style>{globalStyles}</style>
      <nav className="fixed top-0 w-full backdrop-blur-xl bg-gray-900/80 border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-md opacity-70"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center group hover:scale-105 transition-transform duration-300">
                  <Compass className="w-6 h-6 text-white animate-compass-3d" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
                NaviRiti
              </span>
              <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-xs text-indigo-300">
                <Star className="w-3 h-3 mr-1" /> AI Career Guide
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="relative px-6 py-2.5 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 group flex items-center"
                >
                  {link.icon}
                  <span className="relative z-10 font-medium">{link.name}</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/10 to-indigo-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </a>
              ))}
            </div>

            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 text-gray-300 hover:text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden pb-4 backdrop-blur-xl bg-gray-900/95 rounded-b-2xl border border-white/10 mt-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="flex items-center py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 border-b border-white/5 last:border-0"
                >
                  {link.icon}
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

// Hero Section - UPDATED with the enhanced interactive galaxy design
const HeroSection = () => {
  const { ref, inView } = useInView({ threshold: 0.5 });
  
  return (
    <section className="relative pt-24 pb-20">
      <Background intensity="medium" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full backdrop-blur-sm bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              AI-Powered Career Navigation
            </span>
          </div>
          
          <h1 
            className="text-center font-serif text-[clamp(48px,8vw,120px)] leading-[0.9] tracking-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              Navigate Your
            </span>
            <br />
            <span className="relative inline-block">
              <span className="relative bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Cosmic Destiny
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full blur-sm"></div>
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-xl text-gray-300 mb-10">
            Where ancient wisdom meets artificial intelligence to chart your professional journey through the stars
          </p>
          
        
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/login"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 flex items-center justify-center group"
            >
              <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Begin Your Journey
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="/signup"
              className="px-8 py-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
            >
              <Globe className="w-5 h-5 mr-2 inline group-hover:rotate-180 transition-transform duration-500" />
              Explore Career Paths
            </a>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {['AI Analysis', 'Market Trends', 'Skill Mapping', 'Family Context'].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-3">
                  <Target className="w-6 h-6 text-indigo-300" />
                </div>
                <p className="text-sm text-gray-400">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Benefits Section
const BenefitsSection = () => {
  const [ref, inView] = useInView({ threshold: 0.5 });

  const items = [
    { icon: Sparkles, title: "AI-Powered Analysis", body: "Unlock your potential with comprehensive career analysis made by AI, with personalized recommendations and insights.", color: "from-indigo-500/20 to-purple-500/20" },
    { icon: TrendingUp, title: "Market-Aligned Guidance", body: "Get career suggestions based on real-time job market data and future growth prospects.", color: "from-emerald-500/20 to-teal-500/20" },
    { icon: Users, title: "Holistic Approach", body: "Consider your interests, family context, and societal factors for balanced career guidance.", color: "from-purple-500/20 to-pink-500/20" },
    { icon: Award, title: "Your Success, Our Priority", body: "We prioritize your career development with utmost respect for your aspirations and privacy.", color: "from-amber-500/20 to-orange-500/20" },
  ];

  return (
    <section id="benefits" className="relative py-20" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-900/40"></div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full backdrop-blur-sm bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 mb-4">
            <Star className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Cosmic Advantages
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {inView ? (
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Discover Your Stellar Path
              </span>
            ) : (
              "Discover Your Stellar Path"
            )}
          </h2>
          <p className="text-xl text-gray-400">NaviRiti provides real career insights, aligned with cosmic wisdom and AI intelligence.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <div 
              key={item.title} 
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative h-full backdrop-blur-xl bg-gray-900/40 border border-white/10 rounded-2xl shadow-xl shadow-purple-500/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="p-8 relative z-10">
                  <div className={`inline-flex w-14 h-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} border border-white/10 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.body}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Big Picture Section - UPDATED with simpler design
const BigPictureSection = () => {
  const [ref, inView] = useInView({ threshold: 0.5 });
  
  const bullets = [
    "See your whole career path at a glance. No more juggling spreadsheets; get a clear, visual overview of your journey.",
    "Keep everyone on the same page. Easily share your career plans with your family so everyone knows what's next.",
    "Bring your future to life. Visualize your journey with interactive roadmaps and timelines that make planning engaging.",
    "Effortlessly track your progress. See your skill development and achievements with a quick, clear snapshot.",
  ];

  return (
    <section className="relative py-20" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-gray-900/40 to-gray-900/50"></div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative order-last lg:order-first">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-emerald-900/30 rounded-3xl blur-2xl"></div>
            <div className="relative backdrop-blur-xl bg-gray-900/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/10">
              <div className="aspect-video w-full relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900/20 to-purple-900/20"></div>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-30"></div>
                      <Compass className="relative w-24 h-24 text-white animate-compass-3d" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-2xl font-bold text-white">Your Celestial Career Map Awaits</p>
                      <p className="text-gray-400">AI-powered guidance aligned with cosmic patterns</p>
                    </div>
                  </div>
                </div>
                
                {/* Animated stars overlay */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.5)'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full backdrop-blur-sm bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 w-fit">
              <Globe className="w-4 h-4 text-emerald-300 mr-2" />
              <span className="text-sm font-medium bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Cosmic Overview
              </span>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {inView ? (
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  NaviRiti
                </span>
              ) : (
                "NaviRiti"
              )}{" "}
              transforms your career ideas into celestial visuals
            </h3>
            
            <p className="text-xl text-gray-400">
              Giving you a beautiful overview of your next cosmic adventure
            </p>
            
            <ul className="mt-6 space-y-4">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-4 p-4 rounded-xl backdrop-blur-sm bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-sm font-bold text-indigo-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// Specs Section
const SpecsSection = () => {
  const naviRiti = [
    "AI-powered career analysis",
    "Smart path recommendations",
    "Market trend insights",
    "Family context consideration",
    "Skill gap analysis and roadmap",
  ];
  
  const traditional = [
    "Generic career counseling",
    "Limited recommendations",
    "Manual research required",
    "Basic aptitude tests",
    "Outdated information",
    "One-size-fits-all approach",
  ];
  
  const others = [
    "Moderate insights",
    "No personalization",
    "Steep learning curve",
    "No market analysis",
    "Limited support",
    "Partial guidance only",
  ];

  return (
    <section id="specs" className="relative py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-indigo-900/10 to-gray-900/40"></div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full backdrop-blur-sm bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-4">
            <Award className="w-4 h-4 text-amber-300 mr-2" />
            <span className="text-sm font-medium bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              Celestial Comparison
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">NaviRiti</span>?
          </h2>
          <p className="text-xl text-gray-400">
            You need a solution that keeps up. That's why we developed NaviRiti. 
            A comprehensive career guidance platform designed for students navigating their future.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Column title="NaviRiti" lines={naviRiti} isHighlighted={true} />
          <Column title="Traditional Counseling" lines={traditional} />
          <Column title="Other Platforms" lines={others} />
        </div>
      </div>
    </section>
  );
};

// Career Paths Section
const CareerPathsSection = () => {
  const careerPaths = [
    {
      icon: <Code className="w-10 h-10" />,
      title: "Technology",
      lines: [
        "Software Engineering",
        "Data Science & AI/ML",
        "Cybersecurity",
        "Cloud Computing",
        "Web Development"
      ],
      gradient: "from-indigo-600 to-purple-600"
    },
    {
      icon: <Stethoscope className="w-10 h-10" />,
      title: "Medicine",
      lines: [
        "Medical Doctor",
        "Healthcare Research",
        "Surgery Specialization",
        "Pharmacy",
        "Allied Health"
      ],
      gradient: "from-emerald-600 to-teal-600"
    },
    {
      icon: <Building2 className="w-10 h-10" />,
      title: "Government Service",
      lines: [
        "Civil Services (IAS/IPS)",
        "Public Administration",
        "Defense Services",
        "Banking Sector",
        "Public Sector Units"
      ],
      gradient: "from-amber-600 to-orange-600"
    }
  ];

  return (
    <section className="relative py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-900/40"></div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full backdrop-blur-sm bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-4">
            <Compass className="w-4 h-4 text-purple-300 mr-2" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Cosmic Career Paths
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Explore Your <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">Celestial</span> Options
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {careerPaths.map((path, index) => (
            <div key={path.title} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative backdrop-blur-xl bg-gray-900/40 border border-white/10 rounded-3xl p-8 shadow-xl shadow-purple-500/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${path.gradient}/10 rounded-full -translate-y-16 translate-x-16`}></div>
                
                <div className="mb-8 flex items-center gap-4 relative z-10">
                  <div className={`inline-flex w-16 h-16 items-center justify-center rounded-xl bg-gradient-to-br ${path.gradient} border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                    {path.icon}
                  </div>
                  <h4 className="text-2xl font-bold text-white">{path.title}</h4>
                </div>
                
                <ul className="space-y-3 relative z-10">
                  {path.lines.map((l) => (
                    <li key={l} className="flex items-start gap-3 p-3 rounded-lg backdrop-blur-sm bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 group/item">
                      <Check className="mt-0.5 w-5 h-5 text-emerald-400 group-hover/item:scale-110 transition-transform" />
                      <span className="text-gray-300 group-hover/item:text-white transition-colors">{l}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                  <a 
                    href="/login"
                    className="block w-full py-3 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all duration-300 group/btn text-center"
                  >
                    <span className="flex items-center justify-center">
                      Explore Path
                      <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonial Section
const TestimonialSection = () => {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-gray-900/40 to-gray-900/50"></div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative backdrop-blur-xl bg-gray-900/40 border border-white/10 rounded-3xl overflow-hidden">
            <div className="grid gap-8 p-8 lg:p-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full backdrop-blur-sm bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
                  <Star className="w-4 h-4 text-yellow-300 mr-2" />
                  <span className="text-sm font-medium bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">
                    Celestial Testimony
                  </span>
                </div>
                
                <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed">
                  "I was skeptical, but NaviRiti has completely transformed the way I plan my career. The cosmic roadmaps are so clear and intuitive, and the platform is so easy to use. I can't imagine navigating my future without it."
                </p>
                
                <div className="space-y-2">
                  <p className="text-xl font-bold text-white">Vivek Garg</p>
                  <p className="text-gray-400">Computer Science Student, Manipal University Jaipur</p>
                </div>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              
              <div className="grid place-items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-30"></div>
                  <div className="relative w-64 h-64 rounded-full border-4 border-white/10 bg-gradient-to-br from-gray-900 to-indigo-900/30 flex items-center justify-center">
                    <Users className="w-32 h-32 text-indigo-300" />
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/30 animate-spin-slow"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const SiteFooter = () => {
  return (
    <footer className="relative border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/40"></div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur-md opacity-50"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Compass className="w-6 h-6 text-white animate-compass-3d" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
                NaviRiti
              </span>
            </div>
            <p className="text-gray-400 max-w-md">
              Where ancient wisdom meets artificial intelligence to chart your professional journey through the stars.
            </p>
            <div className="flex items-center space-x-4">
              {['♈', '♉', '♊', '♋'].map((symbol, i) => (
                <div key={i} className="w-8 h-8 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10 flex items-center justify-center text-sm text-gray-400">
                  {symbol}
                </div>
              ))}
            </div>
          </div>
          
          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div>
              <h4 className="text-white font-semibold mb-4">Navigation</h4>
              <div className="space-y-2">
                {['Benefits', 'Specifications', 'How-to', 'Contact'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="block text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                {['About', 'Careers', 'Blog', 'Press'].map((item) => (
                  <a key={item} href="#" className="block text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                {['Privacy', 'Terms', 'Security', 'Cookies'].map((item) => (
                  <a key={item} href="#" className="block text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="space-y-2">
                {['Twitter', 'LinkedIn', 'GitHub', 'Discord'].map((item) => (
                  <a key={item} href="#" className="block text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </nav>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 NaviRiti. All rights reserved. Made with ❤️ for cosmic career guidance.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="inline-flex items-center">
                <Star className="w-3 h-3 mr-1" />
                Powered by AI & Astrology
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
const App = () => {  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = authService.isAuthenticated();
      setIsAuthenticated(authStatus);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-900 text-white overflow-hidden">
      <Background intensity="medium" />
      
      {/* KEY FIX: Pass showAuthLinks={false} when user is authenticated */}
      {isAuthenticated ? <AppNavbar showAuthLinks={false} /> : <Navbar />}
      
      <main className="relative z-10">
        <HeroSection />
        <BenefitsSection />
        <BigPictureSection />
        <SpecsSection />
        <CareerPathsSection />
        <TestimonialSection />
      </main>
      <SiteFooter />
    </div>
  );
};

export default App;