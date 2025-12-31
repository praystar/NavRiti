import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from '../components/Background'; // Adjust path as needed

const ZODIAC_SYMBOLS = ['♈︎', '♉︎', '♊︎', '♋︎', '♌︎', '♍︎', '♎︎', '♏︎', '♐︎', '♑︎', '♒︎', '♓︎'];
const CHINESE_RUNES = ['運', '職', '成', '富', '財', '福', '祥'];

const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [zodiacIndex, setZodiacIndex] = useState(0);

  const phases = [
  { title: "NEBULA FORMATION", code: "COSMOS.INIT", subtitle: "Seeding Celestial Intelligence" },
  { title: "STAR ALIGNMENT", code: "ORBIT.SYNC", subtitle: "Harmonizing Cosmic Frequencies" },
  { title: "CONSTELLATION WEAVE", code: "FATE.MATRIX", subtitle: "Weaving Destiny Patterns" },
  { title: "DESTINY REVEAL", code: "PATH.LOCK", subtitle: "Navigational Course Finalized" }
]

  // 1. FIXED SEQUENCE LOGIC (25 -> 75 -> 100) IN 2 SECONDS
  useEffect(() => {
    // Stage 1: Jump to 25% at 0.5s
    const t1 = setTimeout(() => {
      setProgress(25);
      setPhaseIndex(1);
    }, 500);

    // Stage 2: Jump to 75% at 1.2s
    const t2 = setTimeout(() => {
      setProgress(75);
      setPhaseIndex(2);
    }, 1200);

    // Stage 3: Jump to 100% at 1.8s
    const t3 = setTimeout(() => {
      setProgress(100);
      setPhaseIndex(3);
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // 2. FAST ZODIAC LETTER CYCLE (Inside the Orb)
  useEffect(() => {
    const cycle = setInterval(() => {
      setZodiacIndex((prev) => (prev + 1) % ZODIAC_SYMBOLS.length);
    }, 500);
    return () => clearInterval(cycle);
  }, []);

  const runePositions = useMemo(() => 
    CHINESE_RUNES.map(() => ({
      x: (Math.random() - 0.5) * 300,
      y: -150 - Math.random() * 150
    })), 
  []);

  return (
    <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-gray-900 overflow-hidden select-none">
      <Background intensity="high" showPlanets={true} />
      
      <div className="relative w-[320px] h-[320px] md:w-[500px] md:h-[500px] flex items-center justify-center">
        
        {/* Sacred Geometry Mandala */}
        <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]">
          <motion.circle
            cx="200" cy="200" r="190"
            stroke="rgba(165, 180, 252, 0.1)" strokeWidth="1" fill="none"
          />
          <motion.circle
            cx="200" cy="200" r="190"
            stroke="#10B981" strokeWidth="2" fill="none"
            animate={{ pathLength: progress / 100 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ rotate: -90, transformOrigin: 'center' }}
          />

          <motion.g animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
            {[0, 60, 120, 180, 240, 300].map((rot, i) => (
              <path
                key={i}
                d="M200 100 L260 250 L140 250 Z"
                fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"
                transform={`rotate(${rot} 200 200)`}
              />
            ))}
          </motion.g>

          {ZODIAC_SYMBOLS.map((symbol, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = 200 + 160 * Math.cos(angle);
            const y = 200 + 160 * Math.sin(angle);
            return (
              <motion.text
                key={i} x={x} y={y} fill="white" fontSize="12" textAnchor="middle" alignmentBaseline="middle"
                animate={{ opacity: progress > i * 8 ? 0.6 : 0.1 }}
              >
                {symbol}
              </motion.text>
            );
          })}
        </svg>

        {/* 3. THE EMERALD ORB (Layout Kept, Content Changed to Zodiac Letters) */}
        <div className="relative z-20">
          <motion.div
            animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 20px rgba(16,185,129,0.3)", "0 0 50px rgba(16,185,129,0.6)", "0 0 20px rgba(16,185,129,0.3)"] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-emerald-300 via-teal-500 to-indigo-600 flex items-center justify-center p-1"
          >
            <div className="w-full h-full rounded-full bg-gray-900/60 backdrop-blur-md flex items-center justify-center border border-white/20">
              {/* Zodiac Symbol cycle acting as the central "Letter" */}
              <motion.span 
                key={zodiacIndex}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-4xl md:text-5xl text-white font-light drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              >
                {ZODIAC_SYMBOLS[zodiacIndex]}
              </motion.span>
            </div>
          </motion.div>

          {/* Orbiting nodes */}
          {[100, 130, 160].map((dist, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]"
              animate={{ rotate: 360 }}
              transition={{ duration: 2 + i, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: `-${dist / 2}px 0`, marginLeft: `${dist / 2}px` }}
            />
          ))}
        </div>

        {/* Floating Chinese Prosperity Runes */}
        <div className="absolute inset-0 pointer-events-none">
          {CHINESE_RUNES.map((char, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0, 0.4, 0], y: runePositions[i].y, x: runePositions[i].x }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
              className="absolute top-1/2 left-1/2 text-emerald-300 font-bold text-lg"
            >
              {char}
            </motion.span>
          ))}
        </div>
      </div>

      {/* 4. ANIMATED THEME TEXT (Replacing Voltage Logo) */}
      <div className="mt-12 text-center z-50">
        <div className="h-16 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={phaseIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              {/* This replaces the Voltage icon with theme-specific animated code text */}
              <motion.span 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[10px] font-mono text-emerald-400 tracking-[0.4em] mb-2"
              >
                {phases[phaseIndex].code}
              </motion.span>

              <h3 className="text-white font-serif italic text-2xl tracking-widest flex items-center gap-3">
                {phases[phaseIndex].title}
              </h3>
              <p className="text-[10px] uppercase tracking-[0.3em] text-indigo-400 font-black mt-2">
                {phases[phaseIndex].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 5. SEQUENTIAL PROGRESS LINE */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-cyan-400 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "circOut" }}
            />
          </div>
          <div className="flex items-center gap-2 text-gray-500 font-mono text-[9px] uppercase tracking-widest">
             <span className="text-emerald-500 animate-pulse">●</span>
             COSMIC_SYNC: {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;