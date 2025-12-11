/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, Wand2 } from 'lucide-react'; // Added Wand2

type SurveySection = {
  section: string;
  title: string;
  questions: string[];
};

const surveyData: SurveySection[] = [
  {
    section: "A",
    title: "Friends & Peers",
    questions: [
      "My friends' career interests influence my own career preferences.",
      "I feel motivated to choose a career if most of my friends are planning for it.",
      "If my close friends choose a career in Tech, I am more likely to consider it.",
      "If my close friends choose a career in Medical, I am more likely to consider it.",
      "If my close friends choose a career in Sports, I am more likely to consider it.",
      "If my close friends choose a career in Government services (banking/army/UPSC), I am more likely to consider it.",
      "I feel pressure to choose a career that helps me retain my social circle.",
      "I would feel left out if I chose a completely different career from my friends."
    ]
  },
  {
    section: "B",
    title: "Family & Relatives",
    questions: [
      "My family's opinion is very important in choosing my career.",
      "My family expects me to choose a respected profession.",
      "My relatives often compare my potential career with their children or others.",
      "If someone in my family works in Tech, I am more encouraged to pursue the same.",
      "If someone in my family works in Medical, I am more encouraged to pursue the same.",
      "If someone in my family works in Sports, I am more encouraged to pursue the same.",
      "If someone in my family works in Government services, I am more encouraged to pursue the same.",
      "My family would be disappointed if I chose a career different from their expectations.",
      "Career salary and job security are important to my family while advising me.",
      "I avoid careers that my family disapproves of even if I am interested in them."
    ]
  },
  {
    section: "C",
    title: "Role Models & Inspiration",
    questions: [
      "Having a successful role model motivates me to choose a career similar to them.",
      "I follow influencers / celebrities / seniors who inspire me about careers.",
      "A successful Tech professional (e.g., software engineer/AI expert) inspires me to take a similar path.",
      "A successful doctor / nurse / medical practitioner inspires me to take a similar path.",
      "A successful athlete or sportsperson inspires me to take a similar path.",
      "A successful army officer / banker / civil servant inspires me to take a similar path.",
      "I tend to believe that if my role model succeeded in a career, I can also succeed in it.",
      "I would be more confident to select a career if I personally know someone who is successful in it."
    ]
  }
];

const likertOptions: { value: number; label: string }[] = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" }
];

const SERVER_BASE = import.meta.env.VITE_SERVER_BASE_API ?? '';
const API_ROUTE = `${SERVER_BASE}/societal/analyze`;

const CareerSurveyForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [responses, setResponses] = useState<Record<string, number | undefined>>({});
  const [loading, setLoading] = useState(false);
  const [serverResult, setServerResult] = useState<{ ok: boolean; data?: any; error?: string } | null>(null);

  const currentSection = surveyData[currentStep];
  const totalSteps = surveyData.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

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

  // --- NEW FUNCTION: Quick Fill ---
  const handleQuickFill = () => {
    const newResponses = { ...responses };
    const prefix = `section_${currentSection.section}_q`;
    
    currentSection.questions.forEach((_, idx) => {
      // Pick random number between 1 and 5
      const randomValue = Math.floor(Math.random() * 5) + 1;
      newResponses[`${prefix}${idx}`] = randomValue;
    });

    setResponses(newResponses);
  };
  // --------------------------------

  const isCurrentSectionComplete = (): boolean => {
    return currentSection.questions.every((_, idx) => typeof getResponse(idx) === 'number');
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
        total_answered: Object.keys(responses).length
      }
    };
  };

  const submitSurvey = async () => {
    setLoading(true);
    setServerResult(null);

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          type="button"
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6 font-medium"
          aria-label="Back to Home"
        >
          <Home size={18} />
          Back to Home
        </button>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Section Header */}
          <div className="border-b border-gray-200 p-6 flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                Section {currentSection.section}: {currentSection.title}
                </h2>
                <p className="text-gray-600 text-sm">
                Rate how much you agree with each statement
                </p>
            </div>
            
            {/* --- Added Quick Fill Button Here in Header (Optional Placement) --- */}
            {/* Use this if you want it visible at top, otherwise see footer below */}
          </div>

          {/* Questions */}
          <div className="p-6 space-y-8">
            {currentSection.questions.map((question, idx) => (
              <div key={idx}>
                <p className="text-gray-700 mb-4">
                  {question}
                </p>

                <div className="flex items-center gap-1">
                  {likertOptions.map((option) => {
                    const selected = getResponse(idx) === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleResponse(idx, option.value)}
                        aria-pressed={selected}
                        className={`
                          flex-1 py-3 px-2 text-xs font-medium rounded transition-all
                          ${selected
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                          }
                        `}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Navigation */}
          <div className="border-t border-gray-200 p-4 flex items-center justify-between">
            <div className="flex gap-2">
                <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0 || loading}
                className={`
                    flex items-center gap-1 px-4 py-2 rounded text-sm font-medium
                    ${currentStep === 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                    }
                `}
                >
                <ChevronLeft size={18} />
                Previous
                </button>

                {/* --- Quick Fill Button --- */}
                <button
                    type="button"
                    onClick={handleQuickFill}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded transition-colors"
                    title="Randomly answer all questions on this page"
                >
                    <Wand2 size={16} />
                    Quick Fill
                </button>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 hidden sm:inline">
                Step {currentStep + 1} of {totalSteps}
                </span>

                <button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentSectionComplete() || loading}
                className={`
                    flex items-center gap-1 px-4 py-2 rounded text-sm font-medium
                    ${!isCurrentSectionComplete()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                    }
                `}
                >
                {loading ? 'Submitting...' : (currentStep === totalSteps - 1 ? 'Submit' : 'Next')}
                <ChevronRight size={18} />
                </button>
            </div>
          </div>
        </div>

        {/* Server result */}
        {serverResult && (
          <div className={`mt-4 p-4 rounded ${serverResult.ok ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {serverResult.ok ? (
              <>
                <div className="text-sm font-semibold text-green-700">Survey submitted successfully</div>
                <pre className="text-xs text-gray-700 mt-2 overflow-auto max-h-48">{JSON.stringify(serverResult.data, null, 2)}</pre>
              </>
            ) : (
              <div className="text-sm text-red-700">Error: {serverResult.error}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerSurveyForm;