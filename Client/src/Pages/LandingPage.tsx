import  { useState } from 'react';
import { Menu, X, Compass, TrendingUp, Users, Award, Stethoscope, Code, Building2, Sparkles, Check } from 'lucide-react';
import Column from '../components/Column';
import { useInView } from "react-intersection-observer";


// Custom hook for intersection observer


// Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Parent Form', path: '/ParentForm' },
    { name: 'Societal', path: '/Societal' },
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
          </div>
        )}
      </div>
    </nav>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-24 sm:px-6 sm:pb-16 sm:pt-28">
        <h1 
          className="text-center font-serif text-[clamp(40px,7vw,96px)] leading-[0.9] tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Navigate Your Future
        </h1>
        <div className="relative mt-10 sm:mt-14">
          <div className="absolute left-1/2 top-1/2 -z-10 h-[180px] w-[min(100%,900px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-[#0D9488] sm:h-[220px]" />
          <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-[18px] border-[6px] border-black/70 shadow-2xl">
            <div className="relative aspect-[16/9] w-full">
              <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#CCFBF1] to-white">
                <div className="text-center">
                  <Compass className="w-32 h-32 text-[#0D9488] mx-auto mb-4" />
                  <p className="text-[#929292] font-medium text-lg">AI-Powered Career Guidance</p>
                </div>
              </div>
            </div>
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
    { icon: Sparkles, title: "AI-Powered Analysis", body: "Unlock your potential with comprehensive career analysis made by AI, with personalized recommendations and insights." },
    { icon: TrendingUp, title: "Market-Aligned Guidance", body: "Get career suggestions based on real-time job market data and future growth prospects." },
    { icon: Users, title: "Holistic Approach", body: "Consider your interests, family context, and societal factors for balanced career guidance." },
    { icon: Award, title: "Your Success, Our Priority", body: "We prioritize your career development with utmost respect for your aspirations and privacy." },
  ];

  return (
    <section id="benefits" className="border-b border-black/10" ref={ref}>
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-block bg-[#CCFBF1] px-4 py-2 rounded-full text-sm font-medium text-[#000000] mb-3">
            Benefits
          </span>
          <h2 className="text-pretty text-3xl font-semibold sm:text-4xl text-[#000000]">
            {inView ? (
              <span className="inline-block bg-[#CCFBF1] px-2">Discover Your Path</span>
            ) : (
              "Discover Your Path"
            )} with NaviRiti
          </h2>
          <p className="text-[#929292] mt-3">NaviRiti provides real career insights, without the data overload.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.title} className="h-full bg-white border border-black/10 rounded-xl shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-full flex-col gap-3 p-6">
                <div className="inline-flex w-10 h-10 items-center justify-center rounded-lg border bg-[#CCFBF1]/60">
                  <item.icon className="w-5 h-5 text-[#0D9488]" />
                </div>
                <h3 className="text-lg font-semibold text-[#000000]">{item.title}</h3>
                <p className="text-[#929292] text-sm leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Big Picture Section
const BigPictureSection = () => {
  const [ref, inView] = useInView({ threshold: 0.5 });
  
  const bullets = [
    "See your whole career path at a glance. No more juggling spreadsheets; get a clear, visual overview of your journey.",
    "Keep everyone on the same page. Easily share your career plans with your family so everyone knows what's next.",
    "Bring your future to life. Visualize your journey with interactive roadmaps and timelines that make planning engaging.",
    "Effortlessly track your progress. See your skill development and achievements with a quick, clear snapshot.",
  ];

  return (
    <section className="border-b border-black/10" ref={ref}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2">
        <div className="relative order-last md:order-first">
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-black/10 shadow-sm">
            <div className="grid h-full w-full place-items-center bg-gradient-to-tr from-[#CCFBF1] to-white">
              <Compass className="w-24 h-24 text-[#0D9488]" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <span className="inline-block bg-[#CCFBF1] px-4 py-2 rounded-full text-sm font-medium text-[#000000] w-fit">
            See the Big Picture
          </span>
          <h3 className="text-pretty text-2xl font-semibold sm:text-3xl text-[#000000]">
            {inView ? (
              <span className="bg-[#CCFBF1]">NaviRiti</span>
            ) : (
              "NaviRiti"
            )} transforms your career ideas into clear, vibrant visuals, giving you a beautiful overview of your next adventure.
          </h3>
          <ul className="mt-2 space-y-3">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex w-6 h-6 items-center justify-center rounded-full border border-black/20 text-xs font-semibold text-[#000000]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-[#929292]">{b}</span>
              </li>
            ))}
          </ul>
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
    <section id="specs" className="border-b border-black/10">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-block bg-[#CCFBF1] px-4 py-2 rounded-full text-sm font-medium text-[#000000] mb-3">
            Specs
          </span>
          <h2 className="text-pretty text-3xl font-semibold sm:text-4xl text-[#000000]">Why Choose NaviRiti?</h2>
          <p className="text-[#929292] mt-3">You need a solution that keeps up. That's why we developed NaviRiti. A comprehensive career guidance platform designed for students navigating their future.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Column title="NaviRiti" lines={naviRiti} />
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
      ]
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
      ]
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
      ]
    }
  ];

  return (
    <section className="border-b border-black/10">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-block bg-[#CCFBF1] px-4 py-2 rounded-full text-sm font-medium text-[#000000] mb-3">
            Career Paths
          </span>
          <h2 className="text-pretty text-3xl font-semibold sm:text-4xl text-[#000000]">Explore Your Options</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {careerPaths.map((path) => (
            <div key={path.title} className="bg-white border border-black/10 rounded-xl shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="inline-flex w-14 h-14 items-center justify-center rounded-lg bg-[#0D9488] text-white">
                    {path.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-[#000000]">{path.title}</h4>
                </div>
                <ul className="space-y-2 text-sm">
                  {path.lines.map((l) => (
                    <li key={l} className="flex items-start gap-2">
                      <Check className="mt-0.5 w-4 h-4 text-[#0D9488]" />
                      <span className="text-[#929292]">{l}</span>
                    </li>
                  ))}
                </ul>
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
    <section className="border-b border-black/10">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-black/10">
          <div className="absolute inset-0 -z-10 grid place-items-center">
            <div className="w-48 h-48 rounded-full bg-[#CCFBF1] blur-3xl" />
          </div>
          <div className="grid gap-8 p-8 sm:p-12 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div className="space-y-5">
              <p className="text-pretty text-xl font-medium sm:text-2xl text-[#000000]">
                "I was skeptical, but NaviRiti has completely transformed the way I plan my career. The visual roadmaps are so clear and intuitive, and the platform is so easy to use. I can't imagine planning my future without it."
              </p>
              <div>
                <p className="font-semibold text-[#000000]">Someone</p>
                <p className="text-[#929292] text-sm">Someone</p>
              </div>
            </div>
            <div className="grid place-items-center">
              <div className="aspect-square w-60 rounded-full border border-black/10 bg-gradient-to-br from-[#CCFBF1] to-white flex items-center justify-center">
                <Users className="w-24 h-24 text-[#0D9488]" />
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
    <footer className="border-t border-black/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex w-7 h-7 items-center justify-center rounded-md border border-black/20">
            <Compass className="w-4 h-4 text-[#0D9488]" />
          </span>
          <span className="font-semibold text-[#000000]">NaviRiti</span>
        </div>
        <nav className="flex flex-wrap items-center gap-5 text-sm text-[#929292]">
          <a href="#benefits" className="hover:underline hover:text-[#0D9488]">Benefits</a>
          <a href="#specs" className="hover:underline hover:text-[#0D9488]">Specifications</a>
          <a href="#howto" className="hover:underline hover:text-[#0D9488]">How-to</a>
          <a href="#contact" className="hover:underline hover:text-[#0D9488]">Contact Us</a>
        </nav>
      </div>
    </footer>
  );
};

// Main App Component
const App = () => {
  return (
    <div className="font-sans bg-[#fafafa]">
      <Navbar />
      <main>
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