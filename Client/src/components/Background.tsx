// components/Background.tsx
import React, { useEffect, useState, useMemo } from 'react';

// CSS animations for the background
const backgroundStyles = `
@keyframes float {
  0%, 100% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  33% {
    transform: translate3d(30px, -50px, 0) rotate(120deg);
  }
  66% {
    transform: translate3d(-20px, 20px, 0) rotate(240deg);
  }
}

@keyframes drift {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(calc(var(--drift-x) * 0.5), calc(var(--drift-y) * 0.5)) rotate(90deg);
  }
  50% {
    transform: translate(var(--drift-x), var(--drift-y)) rotate(180deg);
  }
  75% {
    transform: translate(calc(var(--drift-x) * 0.5), calc(var(--drift-y) * 0.5)) rotate(270deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.2;
    filter: drop-shadow(0 0 5px currentColor);
  }
  50% {
    opacity: 0.5;
    filter: drop-shadow(0 0 15px currentColor);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes orbit {
  0% {
    transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg);
  }
}

.animate-float {
  animation: float 25s ease-in-out infinite;
}

.animate-drift {
  animation: drift linear infinite;
  animation-duration: var(--duration, 60s);
}

.animate-pulse-glow {
  animation: pulse-glow 4s ease-in-out infinite;
}

.animate-twinkle {
  animation: twinkle 3s ease-in-out infinite;
}

.animate-orbit {
  animation: orbit linear infinite;
  animation-duration: var(--orbit-duration, 120s);
}

.constellation-pattern {
  background-image: 
    radial-gradient(1px 1px at 50px 50px, rgba(165, 180, 252, 0.15) 1px, transparent 0),
    radial-gradient(1px 1px at 150px 100px, rgba(165, 180, 252, 0.15) 1px, transparent 0),
    radial-gradient(1px 1px at 250px 50px, rgba(165, 180, 252, 0.15) 1px, transparent 0),
    radial-gradient(1px 1px at 350px 150px, rgba(165, 180, 252, 0.15) 1px, transparent 0),
    radial-gradient(1px 1px at 450px 100px, rgba(165, 180, 252, 0.15) 1px, transparent 0),
    radial-gradient(1px 1px at 550px 50px, rgba(165, 180, 252, 0.15) 1px, transparent 0),
    radial-gradient(1px 1px at 650px 150px, rgba(165, 180, 252, 0.15) 1px, transparent 0);
  background-size: 700px 400px;
}

.starfield {
  background-image: 
    radial-gradient(1px 1px at 20px 30px, rgba(255, 255, 255, 0.05) 1px, transparent 0),
    radial-gradient(1px 1px at 40px 70px, rgba(255, 255, 255, 0.05) 1px, transparent 0),
    radial-gradient(1px 1px at 60px 20px, rgba(255, 255, 255, 0.05) 1px, transparent 0),
    radial-gradient(1px 1px at 80px 90px, rgba(255, 255, 255, 0.05) 1px, transparent 0);
  background-size: 100px 100px;
}
`;

// Predefined data to avoid Math.random() during render
const PREDEFINED_CHARACTERS = [
  { char: '運', color: 'text-indigo-300/25', size: 42, driftX: -120, driftY: 80, duration: 75, delay: 0 },
  { char: '職', color: 'text-purple-300/25', size: 36, driftX: 150, driftY: -60, duration: 85, delay: 5 },
  { char: '成', color: 'text-emerald-300/25', size: 48, driftX: -80, driftY: 120, duration: 65, delay: 10 },
  { char: '富', color: 'text-cyan-300/25', size: 38, driftX: 100, driftY: -90, duration: 90, delay: 15 },
  // { char: '星', color: 'text-indigo-300/25', size: 44, driftX: -150, driftY: -40, duration: 80, delay: 20 },
  // { char: '宿', color: 'text-purple-300/25', size: 40, driftX: 60, driftY: 100, duration: 70, delay: 25 },
  // { char: '命', color: 'text-emerald-300/25', size: 34, driftX: -90, driftY: -70, duration: 95, delay: 30 },
  // { char: '道', color: 'text-cyan-300/25', size: 46, driftX: 130, driftY: 50, duration: 60, delay: 35 },
  // { char: '天', color: 'text-indigo-300/25', size: 32, driftX: -110, driftY: -110, duration: 100, delay: 40 },
  // { char: '地', color: 'text-purple-300/25', size: 50, driftX: 70, driftY: -30, duration: 55, delay: 45 },
  // { char: '業', color: 'text-emerald-300/25', size: 36, driftX: -140, driftY: 60, duration: 85, delay: 50 },
  // { char: '功', color: 'text-cyan-300/25', size: 42, driftX: 90, driftY: -100, duration: 75, delay: 55 },
  { char: '財', color: 'text-indigo-300/25', size: 38, driftX: -60, driftY: 140, duration: 90, delay: 60 },
  { char: '福', color: 'text-purple-300/25', size: 44, driftX: 120, driftY: -80, duration: 65, delay: 65 },
  { char: '祥', color: 'text-emerald-300/25', size: 40, driftX: -100, driftY: 90, duration: 80, delay: 70 }
];

const PREDEFINED_STARS = [
  { left: 10, top: 20, delay: 0, size: 8, symbol: '★' },
  { left: 25, top: 65, delay: 0.5, size: 12, symbol: '✦' },
  { left: 40, top: 35, delay: 1, size: 6, symbol: '★' },
  { left: 60, top: 80, delay: 1.5, size: 10, symbol: '✦' },
  { left: 75, top: 25, delay: 2, size: 9, symbol: '★' },
  { left: 85, top: 60, delay: 2.5, size: 11, symbol: '✦' },
  { left: 15, top: 85, delay: 3, size: 7, symbol: '★' },
  { left: 35, top: 45, delay: 3.5, size: 13, symbol: '✦' },
  { left: 55, top: 15, delay: 4, size: 8, symbol: '★' },
  { left: 65, top: 75, delay: 4.5, size: 10, symbol: '✦' },
  { left: 80, top: 40, delay: 5, size: 9, symbol: '★' },
  { left: 90, top: 90, delay: 5.5, size: 7, symbol: '✦' },
  { left: 20, top: 30, delay: 6, size: 12, symbol: '★' },
  { left: 45, top: 70, delay: 6.5, size: 8, symbol: '✦' },
  { left: 70, top: 50, delay: 7, size: 11, symbol: '★' }
];

const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

interface ChineseCharacterProps {
  data: typeof PREDEFINED_CHARACTERS[0];
}

const ChineseCharacter: React.FC<ChineseCharacterProps> = ({ data }) => {
  const { char, color, size, driftX, driftY, duration, delay } = data;
  const left = useMemo(() => Math.floor(Math.random() * 85) + 5, []);
  const top = useMemo(() => Math.floor(Math.random() * 85) + 5, []);
  
  return (
    <div
      className={`absolute ${color} animate-drift animate-pulse-glow font-bold pointer-events-none`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        fontSize: `${size}px`,
        '--duration': `${duration}s`,
        '--drift-x': `${driftX}px`,
        '--drift-y': `${driftY}px`,
        animationDelay: `${delay}s`,
        zIndex: 0,
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform'
      } as React.CSSProperties}
    >
      {char}
    </div>
  );
};

interface StarProps {
  data: typeof PREDEFINED_STARS[0];
}

const Star: React.FC<StarProps> = ({ data }) => {
  const { left, top, delay, size, symbol } = data;
  
  return (
    <div
      className={`absolute text-white/30 animate-twinkle pointer-events-none`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        animationDelay: `${delay}s`,
        fontSize: `${size}px`,
        filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))',
        zIndex: 0
      }}
    >
      {symbol}
    </div>
  );
};

interface ZodiacSymbolProps {
  symbol: string;
  position: { left?: string; right?: string; top?: string; bottom?: string };
  size?: 'sm' | 'md' | 'lg';
}

const ZodiacSymbol: React.FC<ZodiacSymbolProps> = ({ symbol, position, size = 'lg' }) => {
  const sizeClasses = {
    sm: 'text-4xl md:text-5xl',
    md: 'text-5xl md:text-7xl',
    lg: 'text-6xl md:text-8xl'
  };
  
  return (
    <div
      className={`absolute ${sizeClasses[size]} text-white/5 pointer-events-none`}
      style={{
        left: position.left,
        right: position.right,
        top: position.top,
        bottom: position.bottom,
        zIndex: 0,
        transform: 'translate3d(0, 0, 0)'
      }}
    >
      {symbol}
    </div>
  );
};

interface OrbitingPlanetProps {
  size: number;
  color: string;
  orbitRadius: number;
  duration: number;
  delay: number;
}

const OrbitingPlanet: React.FC<OrbitingPlanetProps> = ({ size, color, orbitRadius, duration, delay }) => {
  return (
    <div
      className="absolute top-1/2 left-1/2 animate-orbit pointer-events-none"
      style={{
        '--orbit-radius': `${orbitRadius}px`,
        '--orbit-duration': `${duration}s`,
        animationDelay: `${delay}s`,
        width: `${size}px`,
        height: `${size}px`,
        marginTop: `-${size/2}px`,
        marginLeft: `-${size/2}px`,
        zIndex: 0
      } as React.CSSProperties}
    >
      <div
        className={`w-full h-full rounded-full ${color} blur-sm`}
        style={{
          boxShadow: `0 0 20px ${color.includes('indigo') ? '#6366f1' : color.includes('purple') ? '#a855f7' : '#10b981'}/30`
        }}
      ></div>
    </div>
  );
};

interface BackgroundProps {
  children?: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  showConstellations?: boolean;
  showZodiac?: boolean;
  showPlanets?: boolean;
}

const Background: React.FC<BackgroundProps> = ({
  children,
  intensity = 'medium',
  showConstellations = true,
  showZodiac = true,
  showPlanets = true
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const characterCount = {
    low: 6,
    medium: 10,
    high: 15
  }[intensity];
  
  const starCount = {
    low: 8,
    medium: 15,
    high: 25
  }[intensity];
  
  const zodiacPositions = useMemo(() => [
    { symbol: '♈', position: { left: '5%', top: '10%' }, size: 'md' as const },
    { symbol: '♉', position: { right: '8%', top: '15%' }, size: 'lg' as const },
    { symbol: '♊', position: { left: '12%', bottom: '20%' }, size: 'sm' as const },
    { symbol: '♋', position: { right: '6%', bottom: '12%' }, size: 'md' as const },
    // { symbol: '♌', position: { left: '20%', top: '5%' }, size: 'sm' as const },
    // { symbol: '♍', position: { right: '18%', top: '8%' }, size: 'md' as const },
    // { symbol: '♎', position: { left: '15%', bottom: '8%' }, size: 'lg' as const },
    // { symbol: '♏', position: { right: '22%', bottom: '5%' }, size: 'sm' as const },
    // { symbol: '♐', position: { left: '8%', top: '50%' }, size: 'md' as const },
    // { symbol: '♑', position: { right: '12%', top: '60%' }, size: 'lg' as const },
    // { symbol: '♒', position: { left: '25%', top: '70%' }, size: 'sm' as const },
    { symbol: '♓', position: { right: '25%', bottom: '25%' }, size: 'md' as const }
  ], []);
  
  const planets = useMemo(() => [
    { size: 20, color: 'bg-indigo-500/20', orbitRadius: 300, duration: 120, delay: 0 },
    { size: 15, color: 'bg-purple-500/20', orbitRadius: 200, duration: 80, delay: 20 },
    { size: 25, color: 'bg-emerald-500/20', orbitRadius: 400, duration: 150, delay: 40 },
    { size: 12, color: 'bg-cyan-500/20', orbitRadius: 150, duration: 60, delay: 60 }
  ], []);
  
  if (!mounted) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/10">
      <style>{backgroundStyles}</style>
      
      {/* Main gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/5 via-purple-900/5 to-gray-900/5"></div>
      
      {/* Constellation lines */}
      {showConstellations && (
        <div className="absolute inset-0 constellation-pattern opacity-20"></div>
      )}
      
      {/* Starfield */}
      <div className="absolute inset-0 starfield opacity-30"></div>
      
      {/* Animated glow orbs */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-purple-500/3 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-indigo-500/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-emerald-500/2 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      
      {/* Center galaxy effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl"></div>
        {showPlanets && planets.map((planet, index) => (
          <OrbitingPlanet key={`planet-${index}`} {...planet} />
        ))}
      </div>
      
      {/* Floating Chinese characters */}
      {PREDEFINED_CHARACTERS.slice(0, characterCount).map((charData, index) => (
        <ChineseCharacter key={`char-${index}`} data={charData} />
      ))}
      
      {/* Twinkling stars */}
      {PREDEFINED_STARS.slice(0, starCount).map((starData, index) => (
        <Star key={`star-${index}`} data={starData} />
      ))}
      
      {/* Zodiac symbols */}
      {showZodiac && zodiacPositions.map((zodiac, index) => (
        <ZodiacSymbol
          key={`zodiac-${index}`}
          symbol={zodiac.symbol}
          position={zodiac.position}
          size={zodiac.size}
        />
      ))}
      
      {/* Content layer */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default Background;