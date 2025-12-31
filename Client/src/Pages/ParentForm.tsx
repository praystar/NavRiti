/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  RotateCcw,
  Wand2,
  Wallet,
  Shield,
  Award,
  MapPin,
  Plane,
  Ban,
  CheckCircle,
  AlertTriangle,
  Users,
  Globe,
  Star,
  Sparkles,
  Zap,
  Brain,
  Target,
  ChevronRight
} from "lucide-react";
import AppNavbar from "../components/AppNavbar.tsx";
import Background from "../components/Background.tsx";

const SERVER_BASE = import.meta.env.VITE_SERVER_BASE_API;

type PayloadShape = {
  parent_id?: string;
  financial_stability_weight: number;
  job_security_weight: number;
  prestige_weight: number;
  location_preference: "local" | "national" | "international" | "conditional";
  migration_willingness: "yes" | "no" | "conditional";
  budget_constraints: { max_tuition_per_year: number };
  unacceptable_professions: string[];
  acceptable_professions: string[];
  parent_risk_tolerance: number;
  weight_on_parent_layer: number;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// Enhanced RangeInput with cosmic theme
const RangeInput = ({ 
  label, 
  value, 
  onChange, 
  icon: Icon, 
  error 
}: { 
  label: string; 
  value: number; 
  onChange: (val: number) => void; 
  icon: any; 
  error?: string 
}) => (
  <div className="relative group">
    <div className="relative backdrop-blur-sm bg-gray-900/40 border border-indigo-500/20 rounded-2xl p-5 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
            <Icon size={18} className="text-indigo-300" />
          </div>
          <div>
            <div className="font-semibold text-white">{label}</div>
            <div className="text-xs text-gray-400">Adjust cosmic alignment</div>
          </div>
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
          {Math.round(value * 100)}%
        </span>
      </div>
      
      <div className="relative">
        {/* Custom track */}
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          {/* Filled portion with gradient */}
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${value * 100}%` }}
          ></div>
        </div>
        
        {/* Hidden input with custom scrollbar */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-transparent"
        />
        
        {/* Custom thumb */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-white to-indigo-200 border-2 border-indigo-400 shadow-lg shadow-indigo-500/50 transition-transform hover:scale-125 pointer-events-none"
          style={{ left: `${value * 100}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Minimal</span>
        <span>Essential</span>
        <span>Critical</span>
      </div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-red-400 text-xs mt-2"
        >
          <AlertTriangle size={12} />
          {error}
        </motion.div>
      )}
    </div>
  </div>
);

// Custom Select Input
const SelectInput = ({ 
  label, 
  value, 
  onChange, 
  options, 
  icon: Icon,
  error 
}: { 
  label: string; 
  value: string; 
  onChange: (val: any) => void; 
  options: Array<{ value: string; label: string }>; 
  icon: any;
  error?: string 
}) => (
  <div className="relative group">
    <div className="relative backdrop-blur-sm bg-gray-900/40 border border-indigo-500/20 rounded-2xl p-5 transition-all duration-300 hover:border-indigo-500/40">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
          <Icon size={18} className="text-indigo-300" />
        </div>
        <div>
          <div className="font-semibold text-white">{label}</div>
          <div className="text-xs text-gray-400">Choose your path</div>
        </div>
      </div>
      
      <select 
        value={value} 
        onChange={e => onChange(e.target.value)}
        className="w-full backdrop-blur-sm bg-gray-900/30 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 hover:bg-gray-800/30 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-indigo-500 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
      
      {error && (
        <div className="flex items-center gap-1 text-red-400 text-xs mt-2">
          <AlertTriangle size={12} />
          {error}
        </div>
      )}
    </div>
  </div>
);

export default function ParentForm() {
  // --- STATE MANAGEMENT ---
  const [financial, setFinancial] = useState<number>(0.5);
  const [jobSecurity, setJobSecurity] = useState<number>(0.5);
  const [prestige, setPrestige] = useState<number>(0.5);

  const [location, setLocation] = useState<PayloadShape["location_preference"]>("national");
  const [migration, setMigration] = useState<PayloadShape["migration_willingness"]>("conditional");

  const [maxTuition, setMaxTuition] = useState<number>(30000);
  const [unacceptable, setUnacceptable] = useState<string>(""); 
  const [acceptable, setAcceptable] = useState<string>(""); 

  const [riskTolerance, setRiskTolerance] = useState<number>(0.5);
  const [weightOnParent, setWeightOnParent] = useState<number>(0.5);

  const [loading, setLoading] = useState(false);
  const [serverResult, setServerResult] = useState<any | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- LOGIC ---
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (isNaN(financial) || financial < 0 || financial > 1) e.financial = "Must be 0.00 — 1.00";
    if (isNaN(jobSecurity) || jobSecurity < 0 || jobSecurity > 1) e.jobSecurity = "Must be 0.00 — 1.00";
    if (isNaN(prestige) || prestige < 0 || prestige > 1) e.prestige = "Must be 0.00 — 1.00";
    if (!["local", "national", "international", "conditional"].includes(location)) e.location = "Invalid location";
    if (!["yes", "no", "conditional"].includes(migration)) e.migration = "Invalid migration choice";
    if (isNaN(maxTuition) || maxTuition < 0) e.maxTuition = "Must be a positive number";
    if (isNaN(riskTolerance) || riskTolerance < 0 || riskTolerance > 1) e.riskTolerance = "Must be 0.00 — 1.00";
    if (isNaN(weightOnParent) || weightOnParent < 0 || weightOnParent > 1) e.weightOnParent = "Must be 0.00 — 1.00";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    setServerResult(null);
    if (!validate()) return;

    const payload: PayloadShape = {
      parent_id: (crypto && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : `${Date.now()}-${Math.random()}`,
      financial_stability_weight: clamp01(Number(financial)),
      job_security_weight: clamp01(Number(jobSecurity)),
      prestige_weight: clamp01(Number(prestige)),
      location_preference: location,
      migration_willingness: migration,
      budget_constraints: { max_tuition_per_year: Number(maxTuition) },
      unacceptable_professions: unacceptable.split(",").map(s => s.trim()).filter(Boolean),
      acceptable_professions: acceptable.split(",").map(s => s.trim()).filter(Boolean),
      parent_risk_tolerance: clamp01(Number(riskTolerance)),
      weight_on_parent_layer: clamp01(Number(weightOnParent))
    };

    try {
      setLoading(true);
      if (!SERVER_BASE) throw new Error("VITE_SERVER_BASE_API not configured");

      const res = await fetch(`${SERVER_BASE}/parent/preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      if (!res.ok) throw new Error(`Server ${res.status}: ${text || res.statusText}`);

      let data: any = null;
      try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }

      setServerResult({ ok: true, data });
    } catch (err) {
      setServerResult({ ok: false, error: (err as Error).message || String(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    const r = () => Number((Math.random() * 0.8 + 0.1).toFixed(2));
    const pick = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

    setFinancial(r());
    setJobSecurity(r());
    setPrestige(r());

    setLocation(pick(["local", "national", "international", "conditional"]));
    setMigration(pick(["yes", "no", "conditional"]));

    setMaxTuition(Math.floor(Math.random() * 90000) + 10000);

    const pool = [
      "Engineer", "Doctor", "Pilot", "Artist", "Lawyer", 
      "Chef", "Teacher", "Scientist", "Musician", "Writer", 
      "Architect", "Soldier", "Banker"
    ];
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    
    setAcceptable(shuffled.slice(0, 3).join(", "));
    setUnacceptable(shuffled.slice(3, 5).join(", "));

    setRiskTolerance(r());
    setWeightOnParent(r());
    
    setErrors({});
  };

  const handleReset = () => {
    setFinancial(0.5); setJobSecurity(0.5); setPrestige(0.5);
    setLocation("national"); setMigration("conditional");
    setMaxTuition(30000); setAcceptable(""); setUnacceptable("");
    setRiskTolerance(0.5); setWeightOnParent(0.5);
    setErrors({});
    setServerResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      <AppNavbar showAuthLinks={false} />
      <Background intensity="medium" showConstellations={true} showZodiac={true} showPlanets={true} />
      
      <div className="relative max-w-6xl mx-auto px-4 pt-28 pb-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full backdrop-blur-sm bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 mb-6">
            <Users className="w-4 h-4 text-indigo-300 mr-2" />
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Family Constellation Input
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Parental Influence
            </span>
            <br />
            <span className="text-3xl md:text-4xl text-gray-300">Chart Your Family's Cosmic Preferences</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Share your family's values and constraints. We'll align them with celestial wisdom to guide your child's career path.
          </p>
        </motion.div>

        <form onSubmit={onSubmit} className="space-y-8">
          
          {/* Section 1: Core Weights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="relative backdrop-blur-xl bg-gray-900/40 border border-indigo-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10">
              <div className="border-b border-indigo-500/20 p-8 bg-gradient-to-r from-gray-900/50 to-gray-900/30">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                    <Target className="w-6 h-6 text-indigo-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Family Priorities & Cosmic Weights</h2>
                    <p className="text-gray-400 text-sm mt-1">Adjust the celestial sliders to reflect what matters most to your family constellation</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <RangeInput 
                  label="Financial Stability" 
                  value={financial} 
                  onChange={setFinancial} 
                  icon={Wallet}
                  error={errors.financial}
                />
                <RangeInput 
                  label="Job Security" 
                  value={jobSecurity} 
                  onChange={setJobSecurity} 
                  icon={Shield}
                  error={errors.jobSecurity}
                />
                <RangeInput 
                  label="Social Prestige" 
                  value={prestige} 
                  onChange={setPrestige} 
                  icon={Award}
                  error={errors.prestige}
                />
              </div>
            </div>
          </motion.div>

          {/* Section 2: Logistics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="relative backdrop-blur-xl bg-gray-900/40 border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10">
              <div className="border-b border-emerald-500/20 p-8 bg-gradient-to-r from-gray-900/50 to-gray-900/30">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                    <Globe className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Logistics & Cosmic Constraints</h2>
                    <p className="text-gray-400 text-sm mt-1">Define geographical and financial boundaries for the journey</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SelectInput 
                    label="Location Preference" 
                    value={location} 
                    onChange={setLocation}
                    icon={MapPin}
                    error={errors.location}
                    options={[
                      { value: "local", label: "🌍 Local (Same Region)" },
                      { value: "national", label: "🇮🇳 National (Within Country)" },
                      { value: "international", label: "✈️ International (Global)" },
                      { value: "conditional", label: "⚖️ Conditional / Flexible" }
                    ]}
                  />

                  <SelectInput 
                    label="Migration Willingness" 
                    value={migration} 
                    onChange={setMigration}
                    icon={Plane}
                    error={errors.migration}
                    options={[
                      { value: "yes", label: "✅ Yes - Ready to Relocate" },
                      { value: "no", label: "❌ No - Prefer Staying" },
                      { value: "conditional", label: "⚖️ Conditional / Depends" }
                    ]}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                      <Wallet className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Max Tuition per Year</h3>
                      <p className="text-gray-400 text-sm">Set your cosmic budget for education</p>
                    </div>
                  </div>
                  
                  <div className="relative backdrop-blur-sm bg-gray-900/40 border border-amber-500/20 rounded-xl overflow-hidden">
                    <div className="flex items-center">
                      <div className="px-4 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-r border-amber-500/30">
                        <span className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                          ₹
                        </span>
                      </div>
                      <input 
                        type="number" 
                        min={0} 
                        step="0.01" 
                        value={maxTuition} 
                        onChange={e => setMaxTuition(Number(e.target.value))} 
                        className="flex-1 backdrop-blur-sm bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" 
                        placeholder="Enter amount..."
                      />
                      <div className="px-4 py-3 border-l border-amber-500/30">
                        <span className="text-gray-400 text-sm">/year</span>
                      </div>
                    </div>
                  </div>
                  
                  {errors.maxTuition && (
                    <div className="flex items-center gap-1 text-red-400 text-xs mt-2">
                      <AlertTriangle size={12} />
                      {errors.maxTuition}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 3: Professions & Risk */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="relative backdrop-blur-xl bg-gray-900/40 border border-purple-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/10">
              <div className="border-b border-purple-500/20 p-8 bg-gradient-to-r from-gray-900/50 to-gray-900/30">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <Brain className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Career Constellation & Influence</h2>
                    <p className="text-gray-400 text-sm mt-1">Define acceptable paths and your guiding influence</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative backdrop-blur-sm bg-gray-900/40 border border-emerald-500/20 rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/40">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                        <CheckCircle className="w-5 h-5 text-emerald-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Aligned Constellations</h3>
                        <p className="text-gray-400 text-sm">Professions that resonate with your family's stars</p>
                      </div>
                    </div>
                    
                    <textarea 
                      value={acceptable} 
                      onChange={e => setAcceptable(e.target.value)} 
                      className="w-full backdrop-blur-sm bg-gray-900/30 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all duration-300 min-h-[120px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-emerald-500 [&::-webkit-scrollbar-thumb]:rounded-full" 
                      placeholder="e.g., Doctor, Engineer, Pilot (comma separated)"
                    />
                    
                    <div className="text-xs text-gray-500 mt-2">
                      Separate with commas. These will be prioritized in the cosmic map.
                    </div>
                  </div>

                  <div className="relative backdrop-blur-sm bg-gray-900/40 border border-rose-500/20 rounded-2xl p-6 transition-all duration-300 hover:border-rose-500/40">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/30">
                        <Ban className="w-5 h-5 text-rose-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Avoided Constellations</h3>
                        <p className="text-gray-400 text-sm">Professions outside your family's alignment</p>
                      </div>
                    </div>
                    
                    <textarea 
                      value={unacceptable} 
                      onChange={e => setUnacceptable(e.target.value)} 
                      className="w-full backdrop-blur-sm bg-gray-900/30 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-transparent transition-all duration-300 min-h-[120px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-rose-500 [&::-webkit-scrollbar-thumb]:rounded-full" 
                      placeholder="e.g., Artist, Musician (comma separated)"
                    />
                    
                    <div className="text-xs text-gray-500 mt-2">
                      These paths will be filtered out from recommendations.
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-800">
                  <RangeInput 
                    label="Family Risk Tolerance" 
                    value={riskTolerance} 
                    onChange={setRiskTolerance} 
                    icon={Zap}
                    error={errors.riskTolerance}
                  />
                  <RangeInput 
                    label="Parental Guidance Weight" 
                    value={weightOnParent} 
                    onChange={setWeightOnParent} 
                    icon={Sparkles}
                    error={errors.weightOnParent}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6 pt-8"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button 
                type="button" 
                onClick={handleReset} 
                className="relative group flex items-center justify-center gap-3 px-6 py-3 rounded-xl backdrop-blur-sm bg-gradient-to-r from-gray-800/40 to-gray-900/40 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white transition-all duration-300 w-full sm:w-auto"
              >
                <RotateCcw size={18} className="relative z-10" />
                <span className="relative z-10 font-medium">Reset All</span>
              </button>
              
              <button 
                type="button" 
                onClick={handleQuickFill} 
                className="relative group flex items-center justify-center gap-3 px-6 py-3 rounded-xl backdrop-blur-sm bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-400/50 text-purple-300 hover:text-white transition-all duration-300 w-full sm:w-auto"
              >
                <Wand2 size={18} className="relative z-10" />
                <span className="relative z-10 font-medium">Random Alignment</span>
              </button>
            </div>

            <button 
              onClick={onSubmit} 
              disabled={loading} 
              className="relative group flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-white font-semibold transition-all duration-300 w-full sm:w-auto shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300"></div>
              
              <div className="relative z-10 flex items-center gap-3">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Aligning with Cosmos...</span>
                  </>
                ) : (
                  <>
                    <Star size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span>Submit to Cosmos</span>
                    <Save size={20} className="group-hover:scale-110 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </motion.div>

          {/* Server Response Notification */}
          <AnimatePresence>
            {serverResult && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="mt-8"
              >
                {serverResult.ok && serverResult.data?.prediction ? (
                  // SUCCESS CARD
                  <div className="relative overflow-hidden rounded-3xl">
                    <div className="relative backdrop-blur-xl bg-gray-900/60 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/20">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-white/20">
                              <CheckCircle size={24} className="text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-white">
                                {serverResult.data.message || "Cosmic Analysis Complete"}
                              </h3>
                              <p className="text-emerald-100 text-sm">
                                Your family's preferences have been mapped to the stars
                              </p>
                            </div>
                          </div>
                          <div className="text-emerald-100/80 text-sm font-mono bg-white/10 px-3 py-1 rounded-lg">
                            ID: {serverResult.data.saved_id?.slice(-8) || "NEW-STAR"}
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-8">
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                          <div>
                            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <Sparkles size={14} />
                              Recommended Cosmic Path
                            </div>
                            <div className="text-4xl font-bold text-white mb-2">
                              {serverResult.data.prediction.recommended_path}
                            </div>
                            <p className="text-gray-300 text-lg italic border-l-4 border-emerald-500 pl-4 py-2">
                              "{serverResult.data.prediction.match_reason}"
                            </p>
                          </div>

                          {/* Score Orb */}
                          <div className="flex flex-col items-center justify-center">
                            <div className="relative">
                              <div className="relative w-48 h-48 rounded-full border-4 border-emerald-500/30 bg-gradient-to-br from-gray-900 to-emerald-900/30 flex flex-col items-center justify-center">
                                <span className="text-6xl font-black bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                                  {serverResult.data.prediction.score}%
                                </span>
                                <span className="text-sm font-medium text-emerald-300 uppercase tracking-wider mt-2">
                                  Celestial Match
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Insights */}
                        {serverResult.data.prediction.flags && (
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <Award className="text-amber-400" size={20} />
                              <h4 className="text-lg font-semibold text-white">Celestial Insights</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {serverResult.data.prediction.flags.map(
                                (flag: string, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3 p-4 rounded-xl backdrop-blur-sm bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 group/flag"
                                  >
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 group-hover/flag:scale-110 transition-transform">
                                      <Star size={16} className="text-emerald-300" />
                                    </div>
                                    <span className="text-sm text-gray-300 group-hover/flag:text-white transition-colors">
                                      {flag}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // ERROR CARD
                  <div className="relative overflow-hidden rounded-2xl">
                    <div className="relative backdrop-blur-xl bg-gray-900/60 border border-rose-500/30 rounded-2xl overflow-hidden">
                      <div className="flex items-start gap-4 p-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/30">
                          <AlertTriangle className="text-rose-400" size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">Cosmic Connection Failed</h3>
                          <p className="text-rose-200/80">
                            {serverResult.error || "The stars could not align. Please try again."}
                          </p>
                          <button
                            onClick={() => setServerResult(null)}
                            className="mt-4 px-4 py-2 rounded-lg backdrop-blur-sm bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-white hover:bg-rose-500/30 transition-colors text-sm"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}