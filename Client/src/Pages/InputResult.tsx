/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Sparkles, TrendingUp, Rocket, Brain, BookOpen,
  Calendar, Target, CheckCircle, AlertCircle, Zap,
  Star, GraduationCap, Cpu, DollarSign, Building,
  Briefcase, FileText, Award, ExternalLink, ChevronDown,
  ChevronUp, Users, Globe, Mail, Phone, MapPin,
  Code, Database, Cloud, Server, Laptop, GitBranch,
  User, BarChart, TrendingDown, Shield, Clock, Map,
  MessageSquare, ListChecks, Eye, Search
} from 'lucide-react';

/* =====================
   TRUNCATE TEXT WITH READ MORE - FIXED
===================== */
const TruncateText = ({ text, maxLength = 200 }: { text: string; maxLength?: number }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!text) return null;
  
  if (text.length <= maxLength) {
    return <>{text}</>;
  }
  
  return (
    <span>
      {expanded ? text : `${text.substring(0, maxLength)}...`}
      <button
        onClick={() => setExpanded(!expanded)}
        className="ml-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium inline"
      >
        {expanded ? 'Show less' : 'Read more'}
      </button>
    </span>
  );
};

/* =====================
   ENHANCED CAREER CARD COMPONENT FOR STAGE2
===================== */
const CareerCardStage2 = ({ career, idx }: { career: any; idx: number }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
              <span className="text-sm font-bold text-indigo-300">{idx + 1}</span>
            </div>
            <h4 className="font-bold text-xl text-white">{career.role}</h4>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {career.match_score}%
              </span>
            </div>
            <div className="h-6 w-px bg-white/20"></div>
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-400" />
              <span className="text-sm text-gray-200">{career.salary_range_india}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          {expanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>
      </div>

      {/* Readiness and Companies */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase size={14} className="text-indigo-400" />
            <span className="text-sm font-bold text-indigo-300">Readiness</span>
          </div>
          <div className="text-sm text-gray-200">{career.job_readiness}</div>
        </div>
        
        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Building size={14} className="text-emerald-400" />
            <span className="text-sm font-bold text-emerald-300">Top Companies</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {career.top_companies?.slice(0, 3).map((company: string, i: number) => (
              <span key={i} className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-200 text-xs">
                {company}
              </span>
            ))}
            {career.top_companies && career.top_companies.length > 3 && (
              <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-200 text-xs">
                +{career.top_companies.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Why This Fits - Always visible */}
      <div className="mb-4">
        <div className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-2">Why This Fits</div>
        <p className="text-gray-300 leading-relaxed">
          <TruncateText text={career.why_perfect_fit} maxLength={250} />
        </p>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-white/10">
              <div className="grid md:grid-cols-2 gap-4">
                {/* All Companies */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe size={16} className="text-blue-400" />
                    <span className="text-sm font-bold text-blue-300">Recommended Companies</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {career.top_companies?.map((company: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-200 text-sm">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Job Readiness Details */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={16} className="text-amber-400" />
                    <span className="text-sm font-bold text-amber-300">Career Path Tips</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {career.job_readiness}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* =====================
   CAREER CARD COMPONENT FOR STAGE1
===================== */
const CareerCardStage1 = ({ career, idx }: { career: any; idx: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
              <span className="text-sm font-bold text-indigo-300">{idx + 1}</span>
            </div>
            <h4 className="font-bold text-xl text-white">{career.career_title}</h4>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-yellow-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {career.match_percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Why This Fits */}
      <div className="mb-4">
        <div className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-2">Why This Fits</div>
        <p className="text-gray-300 leading-relaxed">
          <TruncateText text={career.why_this_fits} maxLength={250} />
        </p>
      </div>

      {/* Role Models and Fun Facts */}
      <div className="grid md:grid-cols-2 gap-4">
        {career.role_models && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Users size={14} className="text-purple-400" />
              <span className="text-sm font-bold text-purple-300">Role Models</span>
            </div>
            <div className="text-sm text-gray-200">{career.role_models}</div>
          </div>
        )}
        
        {career.fun_fact && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-sm font-bold text-amber-300">Fun Fact</span>
            </div>
            <div className="text-sm text-gray-200">{career.fun_fact}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* =====================
   ENHANCED SKILLS & ANALYSIS SECTION FOR STAGE2
===================== */
const SkillsAnalysisSection = ({ predictions }: { predictions: any }) => {
  if (!predictions?.skill_gap_analysis) return null;
  
  const { strengths, gaps, learning_priority } = predictions.skill_gap_analysis;
  
  return (
    <div className="space-y-10 mb-10">
      {/* Strengths & Gaps Side by Side */}
      <div>
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
          <Brain size={24} className="text-indigo-400" />
          Skill Gap Analysis
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Strengths Column */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border border-emerald-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle size={24} className="text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-emerald-300">Strengths</h4>
                <div className="text-sm text-emerald-200/60">Your key advantages</div>
              </div>
            </div>
            
            <div className="space-y-4">
              {strengths?.map((strength: string, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 group hover:border-emerald-500/40 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-emerald-300">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-200 group-hover:text-white transition-colors leading-relaxed">{strength}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Gaps Column */}
          <div className="bg-gradient-to-br from-rose-500/10 to-rose-900/10 border border-rose-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30 flex items-center justify-center">
                <AlertCircle size={24} className="text-rose-400" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-rose-300">Gaps to Fill</h4>
                <div className="text-sm text-rose-200/60">Areas for improvement</div>
              </div>
            </div>
            
            <div className="space-y-4">
              {gaps?.map((gap: string, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 group hover:border-rose-500/40 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-rose-300">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-200 group-hover:text-white transition-colors leading-relaxed">{gap}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Priority - NEW SECTION */}
      {learning_priority && learning_priority.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
            <ListChecks size={24} className="text-indigo-400" />
            Learning Priority
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {learning_priority.map((priority: string, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 group hover:border-indigo-500/40 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <Target size={18} className="text-indigo-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-200 group-hover:text-white transition-colors leading-relaxed">{priority}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* =====================
   SCORE BREAKDOWN COMPONENT FOR STAGE2
===================== */
const ScoreBreakdown = ({ breakdown }: { breakdown: any }) => {
  if (!breakdown) return null;
  
  const { overall_readiness, ...scoreItems } = breakdown;
  
  return (
    <div className="mb-10">
      <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
        <BarChart size={24} className="text-indigo-400" />
        Score Breakdown
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(scoreItems).map(([key, value]: [string, any], idx: number) => (
          <motion.div 
            key={key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6 text-center group hover:border-indigo-500/30 transition-all"
          >
            <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {typeof value === 'number' ? `${value}` : value}
            </div>
            <div className="text-sm font-medium text-gray-300 capitalize">
              {key.replace('_', ' ')}
            </div>
          </motion.div>
        ))}
        
        {/* Overall Readiness */}
        {overall_readiness && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center group hover:border-emerald-500/40 transition-all"
          >
            <div className="text-3xl font-bold text-emerald-300 mb-2">
              {overall_readiness}
            </div>
            <div className="text-sm font-medium text-emerald-200/60">
              Overall Readiness
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* =====================
   ACTION PLAN COMPONENT
===================== */
/* =====================
   ACTION PLAN COMPONENT - FIXED
===================== */
const ActionPlanSection = ({ predictions }: { predictions: any }) => {
  const plans = predictions?.immediate_action_plan || predictions?.monthly_action_plan;
  
  if (!plans || plans.length === 0) return null;
  
  // Function to format text with bold markers
  const formatActionText = (text: string) => {
    // Replace **bold** markers with styled spans
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return (
          <span key={index} className="font-bold text-indigo-300">
            {boldText}
          </span>
        );
      }
      return part;
    });
  };
  
  return (
    <div className="mb-10">
      <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
        <Calendar size={24} className="text-indigo-400" />
        {predictions?.immediate_action_plan ? 'Immediate Action Plan' : 'Monthly Action Plan'}
      </h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan: string, idx: number) => {
          // Extract month if present
          const monthMatch = plan.match(/Month\s+(\d+-\d+)/i);
          const hasMonthInText = plan.includes('Month');
          
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 hover:border-indigo-500/40 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
                    <span className="text-lg font-bold text-indigo-300">{idx + 1}</span>
                  </div>
                  {monthMatch && !hasMonthInText && (
                    <div className="text-xs text-indigo-400 text-center mt-2 font-medium">
                      {monthMatch[1]}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-gray-200 group-hover:text-white transition-colors leading-relaxed">
                    {formatActionText(plan)}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* =====================
   INTERVIEW PREPARATION COMPONENT - NEW
===================== */
const InterviewPreparation = ({ preparation }: { preparation: any }) => {
  if (!preparation || !Array.isArray(preparation) || preparation.length === 0) return null;
  
  return (
    <div className="mb-10">
      <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
        <MessageSquare size={24} className="text-indigo-400" />
        Interview Preparation
      </h3>
      
      <div className="space-y-6">
        {preparation.map((item: string, idx: number) => {
          // Extract bold text if present
          const boldMatch = item.match(/\*\*(.*?)\*\*/);
          const content = boldMatch ? item.replace(/\*\*(.*?)\*\*/, '') : item;
          
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-300">{idx + 1}</span>
                  </div>
                </div>
                <div className="flex-1">
                  {boldMatch && (
                    <h4 className="text-lg font-bold text-blue-300 mb-2">
                      {boldMatch[1]}
                    </h4>
                  )}
                  <p className="text-gray-200 group-hover:text-white transition-colors leading-relaxed">
                    {content.trim()}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* =====================
   JOB SEARCH STRATEGY COMPONENT
===================== */
const JobSearchStrategy = ({ strategy }: { strategy: any }) => {
  if (!strategy) return null;
  
  return (
    <div className="mb-10">
      <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
        <Target size={24} className="text-indigo-400" />
        Job Search Strategy
      </h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Platforms */}
        {strategy.platforms && strategy.platforms.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Globe size={20} className="text-blue-400" />
              <h4 className="text-lg font-bold text-blue-300">Platforms</h4>
            </div>
            <div className="space-y-3">
              {strategy.platforms.map((platform: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-300">{idx + 1}</span>
                  </div>
                  <span className="text-sm text-gray-200">{platform}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Networking Tips */}
        {strategy.networking_tips && strategy.networking_tips.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users size={20} className="text-emerald-400" />
              <h4 className="text-lg font-bold text-emerald-300">Networking Tips</h4>
            </div>
            <div className="space-y-3">
              {strategy.networking_tips.map((tip: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-emerald-300">{idx + 1}</span>
                  </div>
                  <span className="text-sm text-gray-200">{tip}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Resume Improvements */}
        {strategy.resume_improvements && strategy.resume_improvements.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText size={20} className="text-amber-400" />
              <h4 className="text-lg font-bold text-amber-300">Resume Tips</h4>
            </div>
            <div className="space-y-3">
              {strategy.resume_improvements.map((tip: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-amber-300">{idx + 1}</span>
                  </div>
                  <span className="text-sm text-gray-200">{tip}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

/* =====================
   LEARNING RESOURCES COMPONENT
===================== */
const LearningResources = ({ resources }: { resources: string[] }) => {
  if (!resources || resources.length === 0) return null;
  
  return (
    <div className="mb-10">
      <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
        <BookOpen size={24} className="text-cyan-400" />
        Learning Resources
      </h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource: string, idx: number) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-5 hover:border-cyan-500/40 transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                <BookOpen size={16} className="text-cyan-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                  {resource}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* =====================
   SKILLS SECTION FOR STAGE1
===================== */
const SkillsSectionStage1 = ({ skills, title, icon: Icon, color = 'indigo' }: any) => {
  if (!skills || skills.length === 0) return null;
  
  const colorClasses = {
    indigo: 'from-indigo-500/20 to-indigo-500/10 border-indigo-500/20 text-indigo-400',
    emerald: 'from-emerald-500/20 to-emerald-500/10 border-emerald-500/20 text-emerald-400',
    purple: 'from-purple-500/20 to-purple-500/10 border-purple-500/20 text-purple-400',
    rose: 'from-rose-500/20 to-rose-500/10 border-rose-500/20 text-rose-400',
    cyan: 'from-cyan-500/20 to-cyan-500/10 border-cyan-500/20 text-cyan-400',
  };
  
  const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.indigo;
  
  return (
    <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
        <Icon size={20} className={`text-${color}-400`} />
        {title}
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {skills.map((skill: string, idx: number) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className={`px-2 py-1 rounded-md bg-gradient-to-r ${colorClass} text-xs font-bold flex-shrink-0 mt-1`}>
              {idx + 1}
            </div>
            <span className="text-gray-200 group-hover:text-white transition-colors">{skill}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
/* =====================
   CV DATA DISPLAY COMPONENT
===================== */
/* =====================
   DYNAMIC CV DATA DISPLAY COMPONENT
===================== */
const CVDataDisplay = ({ cvData }: { cvData: any }) => {
  if (!cvData) return null;

  return (
    <div className="space-y-10 mb-10">
      {/* Personal Information - Dynamic */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
          <User size={24} className="text-indigo-400" />
          Personal Information
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Name */}
          {cvData.name && (
            <div className="p-4 rounded-xl bg-white/5">
              <div className="text-sm text-indigo-300 mb-1">Full Name</div>
              <div className="text-lg font-bold text-white">{cvData.name}</div>
            </div>
          )}
          
          {/* Email */}
          {cvData.email && (
            <div className="p-4 rounded-xl bg-white/5">
              <div className="text-sm text-indigo-300 mb-1">Email</div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <Mail size={16} />
                {cvData.email}
              </div>
            </div>
          )}
          
          {/* Phone */}
          {cvData.phone && (
            <div className="p-4 rounded-xl bg-white/5">
              <div className="text-sm text-indigo-300 mb-1">Phone</div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <Phone size={16} />
                {cvData.phone}
              </div>
            </div>
          )}
          
          {/* Display any other personal info fields */}
          {Object.entries(cvData).map(([key, value]) => {
            // Skip already displayed fields and non-simple fields
            if (['name', 'email', 'phone', 'skills', 'education', 'experience', 'projects', 'certifications', 'parsed_successfully', 'input_method'].includes(key)) {
              return null;
            }
            
            if (value && typeof value === 'string') {
              return (
                <div key={key} className="p-4 rounded-xl bg-white/5">
                  <div className="text-sm text-indigo-300 mb-1 capitalize">
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="text-lg font-bold text-white">{value}</div>
                </div>
              );
            }
            
            return null;
          })}
        </div>
      </div>

      {/* Education - Dynamic */}
      {cvData.education && cvData.education.length > 0 && (
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
            <GraduationCap size={24} className="text-emerald-400" />
            Education
          </h3>
          <div className="space-y-6">
            {cvData.education.map((edu: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">{edu.institution || 'Unknown Institution'}</h4>
                    <div className="text-lg text-emerald-300 mb-1">{edu.degree || 'No Degree Specified'}</div>
                    <div className="flex items-center gap-2 text-gray-300">
                      {edu.period && (
                        <>
                          <Calendar size={14} />
                          {edu.period}
                        </>
                      )}
                      {edu.graduation_date && (
                        <>
                          <Calendar size={14} />
                          {edu.graduation_date}
                        </>
                      )}
                    </div>
                  </div>
                  {/* GPA or other metrics */}
                  {edu.gpa && (
                    <div className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                      <div className="text-2xl font-bold text-emerald-300">{edu.gpa}</div>
                      <div className="text-xs text-emerald-200">GPA</div>
                    </div>
                  )}
                </div>
                
                {/* Additional details - dynamic */}
                <div className="space-y-2 mt-4">
                  {edu.details && (
                    <div className="text-sm text-gray-300">
                      <span className="font-medium text-emerald-300">Details: </span>
                      {edu.details}
                    </div>
                  )}
                  
                  {edu.location && (
                    <div className="text-sm text-gray-300 flex items-center gap-2">
                      <MapPin size={14} />
                      {edu.location}
                    </div>
                  )}
                  
                  {edu.awards && edu.awards.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-bold text-emerald-300 mb-2">Awards & Honors</div>
                      <div className="flex flex-wrap gap-2">
                        {edu.awards.map((award: string, awardIdx: number) => (
                          <span key={awardIdx} className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-sm">
                            {award}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Experience - Dynamic (handles empty array) */}
      {cvData.experience && cvData.experience.length > 0 ? (
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
            <Briefcase size={24} className="text-blue-400" />
            Experience
          </h3>
          <div className="space-y-6">
            {cvData.experience.map((exp: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                        <Briefcase size={18} className="text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">{exp.title || 'No Title'}</h4>
                        <div className="text-lg text-blue-300">{exp.company || exp.organization || 'Unknown Company'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-300 mt-2">
                      {exp.start_date && (
                        <>
                          <Calendar size={14} />
                          {exp.start_date} - {exp.end_date || 'Present'}
                        </>
                      )}
                      {exp.period && (
                        <>
                          <Calendar size={14} />
                          {exp.period}
                        </>
                      )}
                      {exp.location && (
                        <>
                          <span className="h-4 w-px bg-white/20"></span>
                          <MapPin size={14} />
                          {exp.location}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Description - dynamic */}
                {exp.description && (
                  <div className="mt-4">
                    {Array.isArray(exp.description) ? (
                      <ul className="space-y-2">
                        {exp.description.map((desc: string, descIdx: number) => (
                          <li key={descIdx} className="flex items-start gap-3 text-gray-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-300">{exp.description}</p>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
            <Briefcase size={24} className="text-blue-400" />
            Experience
          </h3>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
              <Clock size={24} className="text-blue-400" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">No Professional Experience Yet</h4>
            <p className="text-gray-300">Focus on building projects and securing internships to gain experience</p>
          </div>
        </div>
      )}

      {/* Projects - Dynamic */}
      {cvData.projects && cvData.projects.length > 0 && (
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
            <Code size={24} className="text-purple-400" />
            Projects
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {cvData.projects.map((project: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
              >
                <h4 className="text-lg font-bold text-white mb-3">{project.title || 'Untitled Project'}</h4>
                
                {/* Description - dynamic */}
                {project.description && (
                  <div className="mb-4">
                    {Array.isArray(project.description) ? (
                      <ul className="space-y-2">
                        {project.description.map((desc: string, descIdx: number) => (
                          <li key={descIdx} className="flex items-start gap-2 text-gray-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                            <span className="leading-relaxed">{desc}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-300 leading-relaxed">{project.description}</p>
                    )}
                  </div>
                )}
                
                {/* Tech Stack */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-bold text-purple-300 mb-2">Tech Stack</div>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech: string, techIdx: number) => (
                        <span key={techIdx} className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Additional project fields */}
                {Object.entries(project).map(([key, value]) => {
                  if (['title', 'description', 'tech_stack'].includes(key)) {
                    return null;
                  }
                  
                  if (value && typeof value === 'string' && value.trim()) {
                    return (
                      <div key={key} className="mt-3">
                        <div className="text-sm font-bold text-purple-300 mb-1 capitalize">
                          {key.replace(/_/g, ' ')}
                        </div>
                        <div className="text-gray-300 text-sm">{value}</div>
                      </div>
                    );
                  }
                  
                  return null;
                })}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Skills - Dynamic */}
      {cvData.skills && cvData.skills.length > 0 && (
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
            <Cpu size={24} className="text-amber-400" />
            Skills
          </h3>
          <div className="flex flex-wrap gap-3">
            {cvData.skills.map((skill: string, idx: number) => (
              <motion.span 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-200 hover:border-amber-500/50 transition-all cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications - Dynamic (handles empty array) */}
      {cvData.certifications && cvData.certifications.length > 0 ? (
        <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20 rounded-2xl p-6">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
            <Award size={24} className="text-rose-400" />
            Certifications
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {cvData.certifications.map((cert: string, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20"
              >
                <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                  <Award size={16} className="text-rose-400" />
                </div>
                <span className="text-gray-200">{cert}</span>
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
/* =====================
   MAIN RESULT DISPLAY COMPONENT
===================== */
/* =====================
   MAIN RESULT DISPLAY COMPONENT
===================== */
const InputResult = ({ data, onClose }: { data: any; onClose: () => void }) => {
  if (!data) return null;

  // Determine result type
  let resultType: 'stage1' | 'stage2' | 'cv' = 'stage1';
  let displayData = data;
  let cvData = null;
  
  // Check if it's CV data structure
  if (data.parsed_successfully && data.cv_data) {
    resultType = 'cv';
    cvData = data.cv_data;
    displayData = data.stage2_result || data;
  } else if (data.stage === 'Undergraduate' || data.ai_predictions?.employability_score !== undefined) {
    resultType = 'stage2';
    displayData = data;
  } else if (data.stage?.includes('Class') || data.stage === 'school') {
    resultType = 'stage1';
    displayData = data;
  }
  
  const isStage1 = resultType === 'stage1';
  const isStage2 = resultType === 'stage2';
  const isCV = resultType === 'cv';
  
  const predictions = displayData.ai_predictions;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mt-10 backdrop-blur-2xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-indigo-500/10 w-full max-w-6xl mx-auto"
    >
      {/* Header - updated for CV */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div className="flex-1">
          <h2 className="text-3xl font-serif font-bold mb-3 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
            {isStage1 ? 'Celestial Career Map' : isStage2 ? 'Career Launch Analysis' : 'CV Intelligence Report'}
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30">
              <Sparkles size={14} className="text-yellow-400" />
              <span className="text-sm font-bold text-indigo-200">AI-Powered Analysis</span>
            </div>
            <span className="text-sm text-gray-400">
              Generated {new Date(displayData.generated_at || Date.now()).toLocaleDateString()}
            </span>
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-sm font-medium">
              {isStage1 ? 'School Explorer' : isStage2 ? 'University Voyager' : 'CV Analysis'}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-3 rounded-full hover:bg-white/10 transition-colors border border-white/10"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Student Info Card - updated for CV */}
      <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">
              {displayData.student_name || displayData.name || cvData?.name || 'Candidate'}
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {displayData.stage && !isCV && (
                <span className="px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium">
                  {displayData.stage}
                </span>
              )}
              
              {cvData?.education?.[0]?.degree && (
                <span className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium">
                  {cvData.education[0].degree}
                </span>
              )}
              
              {displayData.ai_powered && (
                <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium flex items-center gap-2">
                  <CheckCircle size={12} /> AI Verified
                </span>
              )}
            </div>
          </div>
          
          {/* Score Display for Stage2 */}
          {isStage2 && predictions?.employability_score && (
            <div className="text-center">
              <div className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {predictions.employability_score}%
              </div>
              <div className="text-sm text-gray-400 mt-1">Employability Score</div>
            </div>
          )}
          
          {/* Score Display for Stage1 */}
          {isStage1 && predictions?.top_career_paths?.[0]?.match_percentage && (
            <div className="text-center">
              <div className="text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {predictions.top_career_paths[0].match_percentage}%
              </div>
              <div className="text-sm text-gray-400 mt-1">Top Career Match</div>
            </div>
          )}
          
          {/* Score Display for CV */}
          {isCV && predictions?.employability_score && (
            <div className="text-center">
              <div className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {predictions.employability_score}%
              </div>
              <div className="text-sm text-gray-400 mt-1">Employability Score</div>
            </div>
          )}
        </div>
      </div>

      {/* CV DATA DISPLAY SECTION - NEW */}
      {isCV && cvData && (
        <CVDataDisplay cvData={cvData} />
      )}

      {/* The rest of your existing code remains the same - showing Stage 1, Stage 2, and CV analysis */}
      {/* Score Breakdown for Stage2 and CV */}
      {(isStage2 || isCV) && predictions?.score_breakdown && (
        <ScoreBreakdown breakdown={predictions.score_breakdown} />
      )}

      {/* Career Recommendations for Stage2 and CV */}
      {predictions && (predictions.top_career_paths || predictions.top_career_recommendations) && (
        <section className="mb-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-3 text-white">
              <TrendingUp size={24} className="text-indigo-400" />
              {isStage1 ? 'Top Career Constellations' : 'Career Recommendations'}
            </h3>
            <span className="text-sm text-indigo-300 font-medium">
              {isStage1 
                ? `${predictions.top_career_paths?.length || 0} Careers` 
                : `${predictions.top_career_recommendations?.length || 0} Roles`}
            </span>
          </div>
          
          <div className="space-y-6">
            {isStage1 && predictions.top_career_paths?.map((career: any, idx: number) => (
              <CareerCardStage1 key={idx} career={career} idx={idx} />
            ))}
            
            {(isStage2 || isCV) && predictions.top_career_recommendations?.map((career: any, idx: number) => (
              <CareerCardStage2 key={idx} career={career} idx={idx} />
            ))}
          </div>
        </section>
      )}

      {/* Stage1 Specific Sections - unchanged */}
      {isStage1 && predictions && (
        <div className="grid md:grid-cols-1 gap-8 mb-10">
          {/* Skills to Develop */}
          {predictions.skills_to_develop_now && predictions.skills_to_develop_now.length > 0 && (
            <SkillsSectionStage1 
              skills={predictions.skills_to_develop_now}
              title="Skills to Develop Now"
              icon={Brain}
              color="indigo"
            />
          )}
          
          {/* Activities to Try */}
          {predictions.activities_to_try && predictions.activities_to_try.length > 0 && (
            <SkillsSectionStage1 
              skills={predictions.activities_to_try}
              title="Activities to Try"
              icon={Rocket}
              color="purple"
            />
          )}
          
          {/* Learning Resources for Stage1 */}
          {isStage1 && predictions?.learning_resources && predictions.learning_resources.length > 0 && (
            <LearningResources resources={predictions.learning_resources} />
          )}
          
          {/* Monthly Action Plan for Stage1 */}
          {isStage1 && predictions?.monthly_action_plan && predictions.monthly_action_plan.length > 0 && (
            <ActionPlanSection predictions={predictions} />
          )}
        </div>
      )}

      {/* Stage2 and CV Specific Sections */}
      {(isStage2 || isCV) && predictions && (
        <div className="space-y-10">
          {/* Skill Gap Analysis */}
          {predictions.skill_gap_analysis && (
            <SkillsAnalysisSection predictions={predictions} />
          )}

          {/* Learning Resources */}
          {predictions.learning_resources && predictions.learning_resources.length > 0 && (
            <LearningResources resources={predictions.learning_resources} />
          )}

          {/* Action Plan */}
          {predictions && (
            <ActionPlanSection predictions={predictions} />
          )}

          {/* Job Search Strategy */}
          {predictions.job_search_strategy && (
            <JobSearchStrategy strategy={predictions.job_search_strategy} />
          )}

          {/* Interview Preparation */}
          {predictions.interview_preparation && predictions.interview_preparation.length > 0 && (
            <InterviewPreparation preparation={predictions.interview_preparation} />
          )}
        </div>
      )}

      {/* Personalized Message - for all types */}
      {predictions?.personalized_message && (
        <div className="mb-10 p-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Rocket size={28} className="text-emerald-400" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-white mb-4">Mission Briefing</h4>
              <p className="text-gray-200 leading-relaxed text-lg">{predictions.personalized_message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Raw Data Toggle - unchanged */}
      {/* <details className="border border-white/10 rounded-2xl overflow-hidden">
        <summary className="cursor-pointer p-5 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between text-gray-400 hover:text-white text-lg font-medium">
          <span>📊 View Complete Raw Response Data</span>
          <ChevronDown size={20} className="transition-transform group-open:rotate-180" />
        </summary>
        <div className="p-5 bg-black/20">
          <pre className="text-xs text-gray-300 overflow-auto max-h-96 whitespace-pre-wrap break-words">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </details> */}

      {/* Footer - unchanged */}
      <div className="mt-10 pt-8 border-t border-white/10 text-center">
        <p className="text-sm text-gray-400">
          This celestial map is generated using AI. Your journey is unique - use this as a guide, not a destination.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Generated by NaviRiti AI Career Predictor • {displayData.ai_powered ? 'AI-Powered Analysis' : 'Basic Analysis'}
        </p>
      </div>
    </motion.div>
  );
};

export default InputResult;

