/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Wand2, Users, Globe, Target, 
  Sparkles, Star, Award, CheckCircle, AlertTriangle, Zap, 
  Brain, TrendingUp, BarChart3, Target as TargetIcon,
  RefreshCw, Send, Save
} from 'lucide-react';
import AppNavbar from '../components/AppNavbar.tsx';
import Background from '../components/Background.tsx';

type SurveySection = {
  section: string;
  title: string;
  icon: any;
  color: string;
  gradient: string;
  questions: string[];
};

const surveyData: SurveySection[] = [
  {
    section: "A",
    title: "Social Influence",
    icon: Users,
    color: "from-indigo-500 to-purple-500",
    gradient: "bg-gradient-to-br from-indigo-500/20 to-purple-500/20",
    questions: [
      "Doctors or healthcare professionals inspire me to choose a medical career.",
      "My friends choosing technology-related careers does not affect my career preferences.",
      "If someone in my family or relatives works in government services, I feel encouraged to pursue a similar career.",
      "When my friends show interest in medical professions, it influences my career thinking.",
      "Technology professionals do not influence my career decisions.",
      "If someone in my family works in technology, I feel encouraged to pursue a similar field."
    ]
  },
  {
    section: "B",
    title: "Family & Community Impact",
    icon: Globe,
    color: "from-emerald-500 to-teal-500",
    gradient: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20",
    questions: [
      "Friends preparing for government careers do not influence my career choice.",
      "Family members in the medical field encourage me to consider healthcare careers.",
      "Watching a respected government officer motivates me to consider government services.",
      "Family members working in technology do not influence my career choice.",
      "Doctors do not influence my career choice.",
      "If many of my close friends choose technology-related careers, I feel motivated to consider the same."
    ]
  },
  {
    section: "C",
    title: "Professional Inspiration",
    icon: Target,
    color: "from-amber-500 to-orange-500",
    gradient: "bg-gradient-to-br from-amber-500/20 to-orange-500/20",
    questions: [
      "Having family members or relatives in government services does not influence my interest in pursuing a government career.",
      "My friends' interest in medical professions has no impact on my career decisions.",
      "A successful technology professional inspires me to pursue a tech career.",
      "Seeing my friends prepare for government service careers makes me consider that path.",
      "A medical background in my family does not influence my career choice.", 
      "Government officers do not motivate me to pursue government services."
    ]
  }
];

const likertOptions: { value: number; label: string; color: string; icon: any }[] = [
  { value: 1, label: "Strongly Disagree", color: "from-rose-500 to-pink-500", icon: AlertTriangle },
  { value: 2, label: "Disagree", color: "from-orange-500 to-amber-500", icon: ChevronLeft },
  { value: 3, label: "Neutral", color: "from-gray-500 to-slate-500", icon: Zap },
  { value: 4, label: "Agree", color: "from-emerald-500 to-teal-500", icon: CheckCircle },
  { value: 5, label: "Strongly Agree", color: "from-indigo-500 to-purple-500", icon: Star }
];

const SERVER_BASE = import.meta.env.VITE_SERVER_BASE_API ?? '';
const API_ROUTE = `${SERVER_BASE}/societal/analyze`;

const CareerSurveyForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [responses, setResponses] = useState<Record<string, number | undefined>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverResult, setServerResult] = useState<{ ok: boolean; data?: any; error?: string } | null>(null);

  const currentSection = surveyData[currentStep];
  const totalSteps = surveyData.length;
  
  // Calculate progress based on completed sections
  const completedSections = surveyData.filter((section, index) => {
    const prefix = `section_${section.section}_q`;
    const questionsAnswered = section.questions.filter((_, idx) => 
      typeof responses[`${prefix}${idx}`] === 'number'
    ).length;
    return questionsAnswered === section.questions.length;
  }).length;

  const progress = submitted ? 100 : (completedSections / totalSteps) * 100;
  const sectionProgress = ((currentStep + 1) / totalSteps) * 100;

  const handleResponse = (questionIndex: number, value: number): void => {
    const key = `section_${currentSection.section}_q${questionIndex}`;
    setResponses(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getResponse = (questionIndex: number): number | undefined => {
    const key = `section_${currentSection.section}_q${questionIndex}`;
    return responses[key];
  };

  const isCurrentSectionComplete = (): boolean => {
    return currentSection.questions.every((_, idx) => typeof getResponse(idx) === 'number');
  };

  const getCompletedQuestions = (): number => {
    return Object.keys(responses).filter(key => typeof responses[key] === 'number').length;
  };

  const getTotalQuestions = (): number => {
    return surveyData.reduce((total, section) => total + section.questions.length, 0);
  };

  const handleQuickFill = () => {
    const newResponses = { ...responses };
    const prefix = `section_${currentSection.section}_q`;
    
    currentSection.questions.forEach((_, idx) => {
      const randomValue = Math.floor(Math.random() * 5) + 1;
      newResponses[`${prefix}${idx}`] = randomValue;
    });

    setResponses(newResponses);
  };

  const handleResetSection = () => {
    const newResponses = { ...responses };
    const prefix = `section_${currentSection.section}_q`;
    
    currentSection.questions.forEach((_, idx) => {
      delete newResponses[`${prefix}${idx}`];
    });

    setResponses(newResponses);
  };

  const handleNext = (): void => {
    if (!isCurrentSectionComplete()) return;
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitSurvey();
    }
  };

  const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const buildPayload = () => {
    const payloadResponses: Record<string, Record<number, number>> = {};

    for (const section of surveyData) {
      const prefix = `section_${section.section}_q`;
      payloadResponses[section.section] = {};

      section.questions.forEach((_, idx) => {
        const key = `${prefix}${idx}`;
        const value = responses[key];
        if (typeof value === 'number') {
          payloadResponses[section.section][idx] = value;
        }
      });
    }

    const surveyId = (crypto && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : `survey-${Date.now()}-${Math.floor(Math.random()*1000)}`;

    return {
      survey_id: surveyId,
      timestamp: new Date().toISOString(),
      source: 'web-ui',
      responses: payloadResponses,
      meta: {
        sections_count: surveyData.length,
        total_answered: Object.keys(responses).length,
        completed_sections: completedSections
      }
    };
  };

  const submitSurvey = async () => {
    setLoading(true);
    setServerResult(null);
    setSubmitted(true);

    if (!SERVER_BASE) {
      setServerResult({ ok: false, error: 'VITE_SERVER_BASE_API is not configured.' });
      setLoading(false);
      return;
    }

    const payload = buildPayload();

    try {
      const res = await fetch(API_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const text = await res.text();

      if (!res.ok) {
        const errText = text || res.statusText;
        throw new Error(`Server ${res.status}: ${errText}`);
      }

      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }

      setServerResult({ ok: true, data });
    } catch (err) {
      setServerResult({ ok: false, error: (err as Error).message || String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
      <AppNavbar showAuthLinks={false} />
      <Background intensity="medium" showConstellations={true} />
      
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
              Societal Influence Assessment
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Cosmic Community
            </span>
            <br />
            <span className="text-3xl md:text-4xl text-gray-300">Chart Your Social & Cultural Influences</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover how societal factors shape your career path. Rate each statement to reveal your cosmic connections.
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Progress Card */}
            <div className="relative backdrop-blur-sm bg-gray-900/40 border border-indigo-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                    <BarChart3 className="w-5 h-5 text-indigo-300" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-400">Overall Progress</div>
                    <div className="text-2xl font-bold text-white">{Math.round(progress)}%</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Questions</div>
                  <div className="text-lg font-bold text-white">
                    {getCompletedQuestions()}/{getTotalQuestions()}
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-emerald-500/20 blur-sm"></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Start</span>
                <span>In Progress</span>
                <span>Complete</span>
              </div>
            </div>

            {/* Current Section Card */}
            <div className={`relative backdrop-blur-sm bg-gray-900/40 border ${currentSection.color.split('-')[0]}-500/20 rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${currentSection.gradient} border ${currentSection.color.split('-')[0]}-500/30`}>
                  <currentSection.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-400">Current Section</div>
                  <div className="text-xl font-bold text-white">Section {currentSection.section}</div>
                  <div className="text-sm text-gray-300">{currentSection.title}</div>
                </div>
              </div>
              
              <div className="text-sm text-gray-400 mb-2">
                {currentSection.questions.filter((_, idx) => typeof getResponse(idx) === 'number').length} of {currentSection.questions.length} answered
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${currentSection.color} rounded-full transition-all duration-300`}
                  style={{ 
                    width: `${(currentSection.questions.filter((_, idx) => typeof getResponse(idx) === 'number').length / currentSection.questions.length) * 100}%` 
                  }}
                />
              </div>
            </div>

            {/* Completion Status Card */}
            <div className="relative backdrop-blur-sm bg-gray-900/40 border border-emerald-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                    <TargetIcon className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-400">Completion</div>
                    <div className="text-2xl font-bold text-white">{completedSections}/{totalSteps}</div>
                    <div className="text-sm text-gray-300">Sections Complete</div>
                  </div>
                </div>
                <div className={`p-2 rounded-lg ${completedSections === totalSteps ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                  {completedSections === totalSteps ? (
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Zap className="w-6 h-6 text-amber-400" />
                  )}
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                {completedSections === totalSteps 
                  ? "All sections completed! Ready to submit."
                  : `${totalSteps - completedSections} section${totalSteps - completedSections !== 1 ? 's' : ''} remaining`
                }
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Survey Card */}
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="relative backdrop-blur-xl bg-gray-900/40 border border-indigo-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 mb-8"
        >
          {/* Section Header */}
          <div className="border-b border-indigo-500/20 p-8 bg-gradient-to-r from-gray-900/50 to-gray-900/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl ${currentSection.gradient} border ${currentSection.color.split('-')[0]}-500/30`}>
                  <currentSection.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Section {currentSection.section}: {currentSection.title}</h2>
                  <p className="text-gray-400 text-sm mt-1">Rate each statement based on how much it resonates with your experience</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  type="button"
                  onClick={handleResetSection}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm bg-gradient-to-r from-gray-800/40 to-gray-900/40 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 transition-all duration-300"
                >
                  <RefreshCw size={16} />
                  <span className="text-sm font-medium">Clear Section</span>
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={handleQuickFill}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400/50 transition-all duration-300"
                >
                  <Wand2 size={16} />
                  <span className="text-sm font-medium">Quick Fill</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Questions */}
         <div className="p-6 space-y-6">
  {currentSection.questions.map((question, idx) => (
    <motion.div 
      key={idx}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="relative group"
    >
      <div className={`relative backdrop-blur-sm bg-gray-900/40 border ${
        typeof getResponse(idx) === 'number' 
          ? 'border-emerald-500/40' 
          : 'border-indigo-500/20'
      } rounded-xl p-5 transition-all duration-300 hover:border-indigo-500/40`}>
        <div className="flex items-start gap-3 mb-4">
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${
            typeof getResponse(idx) === 'number'
              ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30'
              : 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30'
          } flex items-center justify-center`}>
            <span className="text-xs font-bold text-white">
              {String(idx + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-base text-gray-300 group-hover:text-white transition-colors leading-relaxed">
              {question}
            </p>
          </div>
        </div>

        {/* Likert Scale */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Select your response:</span>
            {typeof getResponse(idx) === 'number' && (
              <span className={`text-xs font-semibold bg-gradient-to-r ${
                likertOptions.find(o => o.value === getResponse(idx))?.color
              } bg-clip-text text-transparent`}>
                {likertOptions.find(o => o.value === getResponse(idx))?.label}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {likertOptions.map((option) => {
              const selected = getResponse(idx) === option.value;
              return (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => handleResponse(idx, option.value)}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className={`
                    relative overflow-hidden rounded-lg p-2 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[70px]
                    ${selected 
                      ? `bg-gradient-to-br ${option.color} border border-white/30 text-white shadow-md shadow-${option.color.split('-')[0]}-500/20`
                      : 'backdrop-blur-sm bg-gray-800/40 border border-white/10 text-gray-400 hover:bg-gray-700/40 hover:text-white hover:border-indigo-500/30'
                    }
                  `}
                >
                  {selected && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    />
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <div className="text-base font-bold">{option.value}</div>
                    <div className="text-[10px] font-medium leading-tight text-center px-1">
                      {option.label.split(' ')[0]}
                      <br />
                      {option.label.split(' ')[1]}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  ))}
</div>

          {/* Footer Navigation */}
          <div className="border-t border-indigo-500/20 p-6 bg-gradient-to-r from-gray-900/50 to-gray-900/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0 || loading}
                  whileHover={{ scale: currentStep !== 0 ? 1.05 : 1 }}
                  whileTap={{ scale: currentStep !== 0 ? 0.95 : 1 }}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300
                    ${currentStep === 0 || loading
                      ? 'backdrop-blur-sm bg-gray-800/40 border border-gray-700 text-gray-500 cursor-not-allowed'
                      : 'backdrop-blur-sm bg-gray-800/40 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700/40 hover:border-gray-600'
                    }
                  `}
                >
                  <ChevronLeft size={18} />
                  <span className="font-medium">Previous Section</span>
                </motion.button>
                
                <div className="text-sm text-gray-400 hidden sm:block">
                  <span className="font-medium text-gray-300">{currentStep + 1}</span> of {totalSteps} Sections
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-400 text-center">
                  <div className="font-medium text-white">{completedSections}/{totalSteps} Sections Complete</div>
                  <div className="text-xs">{Math.round(progress)}% Overall Progress</div>
                </div>
                
                <motion.button
                  type="button"
                  onClick={handleNext}
                  disabled={!isCurrentSectionComplete() || loading}
                  whileHover={{ scale: isCurrentSectionComplete() ? 1.05 : 1 }}
                  whileTap={{ scale: isCurrentSectionComplete() ? 0.95 : 1 }}
                  className={`
                    relative group flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300
                    ${!isCurrentSectionComplete() || loading
                      ? 'bg-gray-800/40 border border-gray-700 text-gray-500 cursor-not-allowed'
                      : currentStep === totalSteps - 1
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 hover:shadow-xl hover:shadow-emerald-500/30'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 hover:shadow-xl hover:shadow-purple-500/30'
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      {currentStep === totalSteps - 1 ? (
                        <>
                          <Send size={20} />
                          <span>Submit Analysis</span>
                        </>
                      ) : (
                        <>
                          <span>Next Section</span>
                          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Server Result */}
        <AnimatePresence>
          {serverResult && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mt-8"
            >
              {serverResult.ok && serverResult.data?.analysis ? (
                // SUCCESS CARD - UPDATED FORMAT
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
                              {serverResult.data.message || "Societal Analysis Complete"}
                            </h3>
                            <p className="text-emerald-100 text-sm">Your cosmic community influences have been analyzed</p>
                          </div>
                        </div>
                        <div className="text-emerald-100/80 text-sm font-mono bg-white/10 px-3 py-1 rounded-lg">
                          ID: {serverResult.data.saved_id?.slice(-8) || "NEW-CONSTELLATION"}
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-8">
                      {/* Score and Summary Row */}
                      <div className="grid md:grid-cols-3 gap-8 mb-8">
                        {/* Score Orb */}
                        <div className="flex flex-col items-center justify-center">
                          <div className="relative">
                            <div className="relative w-48 h-48 rounded-full border-4 border-emerald-500/30 bg-gradient-to-br from-gray-900 to-emerald-900/30 flex flex-col items-center justify-center">
                              <span className="text-6xl font-black bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                                {serverResult.data.analysis.score}%
                              </span>
                              <span className="text-sm font-medium text-emerald-300 uppercase tracking-wider mt-2">
                                Societal Alignment
                              </span>
                              <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-400/20 animate-spin-slow"></div>
                            </div>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="md:col-span-2">
                          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Sparkles size={14} />
                            Cosmic Summary
                          </div>
                          <div className="text-2xl font-bold text-white mb-4">
                            {serverResult.data.analysis.summary}
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-4 rounded-xl backdrop-blur-sm bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                              <Brain className="w-5 h-5 text-emerald-300 mt-0.5" />
                              <p className="text-gray-300">
                                Your societal alignment indicates how well your career aspirations match community expectations and influences.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Two Column Layout for Actions and Flags */}
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Recommended Actions */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="text-indigo-400" size={20} />
                            <h4 className="text-lg font-semibold text-white">Recommended Actions</h4>
                          </div>
                          <div className="space-y-3">
                            {serverResult.data.analysis.recommended_actions?.map(
                              (action: string, idx: number) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="flex items-center gap-3 p-4 rounded-xl backdrop-blur-sm bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300 group/action"
                                >
                                  <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 group-hover/action:scale-110 transition-transform">
                                    <div className="text-sm font-bold text-indigo-300">
                                      {String(idx + 1).padStart(2, "0")}
                                    </div>
                                  </div>
                                  <span className="text-sm text-gray-300 group-hover/action:text-white transition-colors">
                                    {action}
                                  </span>
                                </motion.div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Flags / Alerts */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="text-amber-400" size={20} />
                            <h4 className="text-lg font-semibold text-white">Cosmic Alerts</h4>
                          </div>
                          <div className="space-y-3">
                            {serverResult.data.analysis.flags?.map(
                              (flag: string, idx: number) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="flex items-center gap-3 p-4 rounded-xl backdrop-blur-sm bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 group/flag"
                                >
                                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 group-hover/flag:scale-110 transition-transform">
                                    <AlertTriangle size={16} className="text-amber-300" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-amber-300 mb-1">
                                      {flag.replace('_', ' ').toUpperCase()}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      Monitor this area for optimal cosmic alignment
                                    </div>
                                  </div>
                                </motion.div>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status Footer */}
                      <div className="mt-8 pt-6 border-t border-gray-800">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-gray-400">Status:</span>
                            <span className="text-emerald-400 font-medium">Analysis Complete</span>
                          </div>
                          <div className="text-gray-400">
                            Saved at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
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
      </div>
    </div>
  );
};

export default CareerSurveyForm;