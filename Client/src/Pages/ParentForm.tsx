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
  AlertTriangle
} from "lucide-react";
import AppNavbar from "../components/AppNavbar.tsx";
//new parental form: removed home

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

// Helper component for Range Inputs to keep code clean and consistent with theme
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
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
        <Icon size={16} className="text-teal-600" />
        {label}
      </div>
      <span className="text-teal-700 font-bold text-sm bg-teal-50 px-2 py-1 rounded">
        {value.toFixed(2)}
      </span>
    </div>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
    />
    <div className="flex justify-between text-xs text-gray-400 mt-1">
      <span>Low Importance</span>
      <span>High Importance</span>
    </div>
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
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
    // Helper: Generate random weight between 0.10 and 0.90
    const r = () => Number((Math.random() * 0.8 + 0.1).toFixed(2));
    
    // Helper: Pick random item from array
    const pick = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

    // 1. Set Weights
    setFinancial(r());
    setJobSecurity(r());
    setPrestige(r());

    // 2. Set Dropdowns
    setLocation(pick(["local", "national", "international", "conditional"]));
    setMigration(pick(["yes", "no", "conditional"]));

    // 3. Set Tuition (Random between 10,000 and 100,000)
    setMaxTuition(Math.floor(Math.random() * 90000) + 10000);

    // 4. Set Text Areas (Random shuffle of professions)
    const pool = [
      "Engineer", "Doctor", "Pilot", "Artist", "Lawyer", 
      "Chef", "Teacher", "Scientist", "Musician", "Writer", 
      "Architect", "Soldier", "Banker"
    ];
    // Shuffle the pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    
    // Take first 3 for acceptable, next 2 for unacceptable
    setAcceptable(shuffled.slice(0, 3).join(", "));
    setUnacceptable(shuffled.slice(3, 5).join(", "));

    // 5. Set Risk & Parent Weights
    setRiskTolerance(r());
    setWeightOnParent(r());
    
    // Clear any previous errors
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

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar showAuthLinks={false} />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-10">
        {/* Header */}
        
        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* Section 1: Core Weights */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 p-6 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">Priorities & Weights</h2>
              <p className="text-gray-600 text-sm mt-1">Adjust the sliders to reflect what matters most to the family.</p>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
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

          {/* Section 2: Logistics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <div className="border-b border-gray-200 p-6 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">Logistics & Constraints</h2>
              <p className="text-gray-600 text-sm mt-1">Location preferences and financial boundaries.</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin size={16} className="text-teal-600"/> Location Preference
                  </div>
                  <select 
                    value={location} 
                    onChange={e => setLocation(e.target.value as any)} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                  >
                    <option value="local">Local</option>
                    <option value="national">National</option>
                    <option value="international">International</option>
                    <option value="conditional">Conditional</option>
                  </select>
                  {errors.location && <div className="text-red-500 text-xs">{errors.location}</div>}
                </label>

                <label className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Plane size={16} className="text-teal-600"/> Migration Willingness
                  </div>
                  <select 
                    value={migration} 
                    onChange={e => setMigration(e.target.value as any)} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="conditional">Depends / Conditional</option>
                  </select>
                  {errors.migration && <div className="text-red-500 text-xs">{errors.migration}</div>}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Tuition per Year (Currency)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input 
                    type="number" 
                    min={0} 
                    step="0.01" 
                    value={maxTuition} 
                    onChange={e => setMaxTuition(Number(e.target.value))} 
                    className="w-full border border-gray-300 rounded-md pl-7 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                  />
                </div>
                {errors.maxTuition && <div className="text-red-500 text-xs mt-1">{errors.maxTuition}</div>}
              </div>
            </div>
          </div>

          {/* Section 3: Professions & Risk */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <div className="border-b border-gray-200 p-6 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">Professions & Influence</h2>
              <p className="text-gray-600 text-sm mt-1">Specific career restrictions and parental influence levels.</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <CheckCircle size={16} className="text-teal-600"/> Acceptable Professions
                  </div>
                  <textarea 
                    value={acceptable} 
                    onChange={e => setAcceptable(e.target.value)} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" 
                    rows={3}
                    placeholder="e.g. Doctor, Engineer, Pilot (comma separated)"
                  />
                </label>

                <label className="block">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Ban size={16} className="text-red-500"/> Unacceptable Professions
                  </div>
                  <textarea 
                    value={unacceptable} 
                    onChange={e => setUnacceptable(e.target.value)} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" 
                    rows={3}
                    placeholder="e.g. Artist, Musician (comma separated)"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <RangeInput 
                  label="Parent Risk Tolerance" 
                  value={riskTolerance} 
                  onChange={setRiskTolerance} 
                  icon={AlertTriangle}
                  error={errors.riskTolerance}
                />
                <RangeInput 
                  label="Parental Influence Weight" 
                  value={weightOnParent} 
                  onChange={setWeightOnParent} 
                  icon={Save} // Using save icon abstractly for "weight/impact" or similar
                  error={errors.weightOnParent}
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                type="button" 
                onClick={handleReset} 
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                <RotateCcw size={16} /> Reset
              </button>
              
              <button 
                type="button" 
                onClick={handleQuickFill} 
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-md hover:bg-teal-100 transition-colors w-full sm:w-auto"
              >
                <Wand2 size={16} /> Quick Fill
              </button>
            </div>

            <button 
              onClick={onSubmit} 
              disabled={loading} 
              className={`
                flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white rounded-md transition-all shadow-sm w-full sm:w-auto
                ${loading ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 hover:shadow-md'}
              `}
            >
              {loading ? (
                <>Processing...</>
              ) : (
                <>
                  <Save size={18} /> Submit Preferences
                </>
              )}
            </button>
          </div>

          {/* Server Response Notification */}
        {/* Server Response Notification */}
        <AnimatePresence>
          {serverResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6"
            >
              {serverResult.ok && serverResult.data?.prediction ? (
                // SUCCESS CARD
                <div className="bg-white rounded-lg shadow-lg border border-teal-100 overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2 font-semibold">
                      <CheckCircle className="text-teal-200" size={20} />
                      {serverResult.data.message || "Analysis Complete"}
                    </div>
                    <span className="text-teal-100 text-xs font-mono opacity-80">
                      ID: {serverResult.data.saved_id?.slice(-6) || "..."}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Recommended Path
                        </h4>
                        <div className="text-3xl font-bold text-gray-800">
                          {serverResult.data.prediction.recommended_path}
                        </div>
                        <p className="text-gray-500 mt-1 text-sm italic">
                          "{serverResult.data.prediction.match_reason}"
                        </p>
                      </div>

                      {/* Score Circle */}
                      <div className="flex flex-col items-center justify-center bg-teal-50 rounded-xl p-4 min-w-[100px] border border-teal-100">
                        <span className="text-3xl font-extrabold text-teal-600">
                          {serverResult.data.prediction.score}%
                        </span>
                        <span className="text-xs font-medium text-teal-700 uppercase">
                          Match Score
                        </span>
                      </div>
                    </div>

                    {/* Flags / Tags */}
                    {serverResult.data.prediction.flags && (
                      <div className="border-t border-gray-100 pt-4">
                        <h5 className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1">
                          <Award size={14} /> KEY INSIGHTS
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {serverResult.data.prediction.flags.map(
                            (flag: string, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200"
                              >
                                <CheckCircle size={12} />
                                {flag}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // ERROR CARD
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="text-red-600 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-semibold text-red-800">Submission Failed</h3>
                    <p className="text-sm text-red-600 mt-1">
                      {serverResult.error || "An unknown error occurred."}
                    </p>
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