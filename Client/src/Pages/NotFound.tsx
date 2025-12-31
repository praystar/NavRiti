/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/purity */
import { useState, useEffect, useMemo } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, Home, RotateCcw, Terminal, Zap } from 'lucide-react';
import AppNavbar from '../components/AppNavbar';
import Background from '../components/Background';

const NotFound = () => {
  const navigate = useNavigate();

  // --- 1. CINEMATIC MOUSE RESPONSIVENESS (Parallax) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the movement
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const moveX = useTransform(springX, [-500, 500], [-30, 30]);
  const moveY = useTransform(springY, [-500, 500], [-30, 30]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // --- 2. STATIC COSMIC DATA (No Jumping) ---
  const starField = useMemo(() => 
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: 3 + Math.random() * 4
    })), []);

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden select-none">
      <AppNavbar showAuthLinks={false} />
      <Background intensity="high" showPlanets={true} />

      <motion.main 
        style={{ x: moveX, y: moveY }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6"
      >
        
        {/* --- 3. MASSIVE DYSON SPHERE STRUCTURE --- */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] pointer-events-none opacity-40">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Outer Dyson Rings */}
            {[0, 45, 90, 135].map((rot, i) => (
              <motion.circle
                key={i} cx="200" cy="200" r={150 + i * 15}
                fill="none" stroke="#4F46E5" strokeWidth="0.5" strokeDasharray="10 20"
                animate={{ rotate: 360 }}
                transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: 'center', rotate: rot }}
              />
            ))}
            {/* Core Energy Field */}
            <motion.circle
              cx="200" cy="200" r="80"
              fill="url(#energyGradient)"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <defs>
              <radialGradient id="energyGradient">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* --- 4. 404 LIGHT BRIDGES (Collapsing/Rebuilding) --- */}
        <div className="relative mb-12">
          <motion.div
            animate={{ opacity: [0.8, 1, 0.7, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              {/* Main 404 with cinematic glow */}
              <h1 className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-200 to-indigo-950 drop-shadow-[0_0_30px_rgba(79,70,229,0.4)]">
                404
              </h1>

              {/* Fragmenting Light Bridges (Horizontal/Vertical beams) */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ 
                      scaleX: [0, 1, 0], 
                      opacity: [0, 0.8, 0],
                      x: ['-100%', '200%']
                    }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity, 
                      delay: i * 0.8,
                      ease: "easeInOut" 
                    }}
                    className="absolute h-[1px] w-full bg-emerald-400 shadow-[0_0_10px_#10b981]"
                    style={{ top: `${15 + i * 15}%` }}
                  />
                ))}
              </div>
            </div>

            <motion.h2 
              initial={{ letterSpacing: "1em", opacity: 0 }}
              animate={{ letterSpacing: "0.4em", opacity: 1 }}
              transition={{ duration: 2 }}
              className="text-xl md:text-2xl font-serif italic text-indigo-300 mt-4"
            >
              COSMIC_FRAGMENTATION
            </motion.h2>
          </motion.div>
        </div>

        {/* --- 5. CINEMATIC PARTICLES --- */}
        <div className="absolute inset-0 pointer-events-none">
          {starField.map((star) => (
            <motion.div
              key={star.id}
              className="absolute bg-white rounded-full"
              style={{ 
                left: star.left, 
                top: star.top, 
                width: star.size, 
                height: star.size,
                boxShadow: '0 0 10px white'
              }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: star.duration, repeat: Infinity }}
            />
          ))}
        </div>

        {/* --- 6. ACTION UI --- */}
        <div className="flex flex-col sm:flex-row gap-6 relative z-50">
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center gap-4 px-10 py-4 rounded-2xl bg-purple-800 text-white font-black uppercase tracking-widest hover:bg-purple-600 transition-all  shadow-2xl"
          >
            <Home size={20} /> Re-Enter Galaxy
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-4 px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" /> Backtrack
          </button>
        </div>

        {/* 7. SYSTEM LOG TERMINAL */}
        <div className="mt-16 w-full max-w-md opacity-40 hover:opacity-100 transition-opacity duration-700">
           <div className="bg-black/60 border border-white/5 rounded-2xl p-5 font-mono text-[10px] text-indigo-300">
              <div className="flex items-center gap-2 mb-3 text-emerald-400">
                <Terminal size={12} /> <span>NULL_SECTOR_DIAGNOSTIC</span>
              </div>
              <p>› DESTINATION: UNRESOLVED</p>
              <p>› STRUCTURE: DYSON_RING_FAILURE</p>
              <p>› PATH_INTEGRITY: 0.00%</p>
              <p className="animate-pulse text-rose-500 mt-2">› WARN: DESTINY_MAP_FRAGMENTED</p>
           </div>
        </div>

      </motion.main>

      <footer className="fixed bottom-6 w-full text-center pointer-events-none z-10">
        <p className="text-[9px] uppercase tracking-[0.8em] text-gray-600">
          LOST IN THE CONSTRUCT OF TIME
        </p>
      </footer>
    </div>
  );
};

export default NotFound;