import { useState } from 'react';
import { Calendar, Clock, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import AppNavbar from '../components/AppNavbar.tsx';
function BirthInfoForm() {
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  });

  const [showPersonalityTraits, setShowPersonalityTraits] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [personalityTraits, setPersonalityTraits] = useState({
    creative: 5,
    analytical: 5,
    technical: 5,
    leadership: 5,
    communication: 5,
    healing: 5,
    business: 5
  });

  const questions = [
    { key: 'creative', label: 'How creative are you?', description: 'Rate your creativity and artistic abilities' },
    { key: 'analytical', label: 'How analytical are you?', description: 'Rate your logical thinking and problem-solving skills' },
    { key: 'technical', label: 'How technical are you?', description: 'Rate your technical and engineering abilities' },
    { key: 'leadership', label: 'How strong is your leadership?', description: 'Rate your leadership and management skills' },
    { key: 'communication', label: 'How good are your communication skills?', description: 'Rate your ability to communicate effectively' },
    { key: 'healing', label: 'How strong is your healing nature?', description: 'Rate your empathy and caring abilities' },
    { key: 'business', label: 'How business-minded are you?', description: 'Rate your entrepreneurial and business skills' }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.birthDate || !formData.birthTime || !formData.birthPlace) {
        alert('Please fill in all fields');
        return;
      }
  
      // Show personality traits form
      setShowPersonalityTraits(true);
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to continue. Please try again.');
    }
  };

  const handleFinalSubmit = async () => {
    try {
      const SERVER_BASE = import.meta.env.VITE_SERVER_BASE_API;
  
      const response = await fetch(`${SERVER_BASE}/birthinfo/submit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          personality_traits: personalityTraits
        })
      });
  
      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        alert('Birth information submitted successfully! 🎉');
        console.log('Server response:', result);
        
        if (result.prediction) {
          console.log('Recommended Path:', result.prediction.recommended_path);
          console.log('Score:', result.prediction.score);
          console.log('Insights:', result.prediction.astrological_insights);
        }
        
      } else {
        alert(`Error: ${result.message || 'Submission failed'}`);
        console.error('Error details:', result);
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to connect to server. Please try again.');
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTraitChange = (value: number) => {
    setPersonalityTraits(prev => ({
      ...prev,
      [currentQuestion.key]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
       <AppNavbar showAuthLinks={false} />
      <div className="w-full px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Birth Info Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="space-y-6">
              
              {/* Birth Date */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 text-teal-600 mr-2" />
                  Birth Date
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
              </div>

              {/* Birth Time */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 text-teal-600 mr-2" />
                  Birth Time
                </label>
                <input
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) => handleChange('birthTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-1">24-hour format (HH:MM)</p>
              </div>

              {/* Birth Place */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 text-teal-600 mr-2" />
                  Birth Place
                </label>
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => handleChange('birthPlace', e.target.value)}
                  placeholder="e.g., Mumbai, Maharashtra, India"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-sm"
              >
                Continue
              </button>
            </div>
          </div>

          {/* Info Note */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Your birth information helps us provide accurate astrological insights
          </div>

          {/* Personality Traits Card - Shows after initial form submission */}
          {showPersonalityTraits && (
            <div className="mt-8 bg-white rounded-lg shadow-lg border-2 border-teal-500 p-8 animate-fadeIn">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Personality Assessment</h3>
                  <span className="text-sm text-gray-500">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-medium text-gray-800 mb-2">
                    {currentQuestion.label}
                  </h4>
                  <p className="text-sm text-gray-600 mb-6">
                    {currentQuestion.description}
                  </p>
                </div>

                {/* Likert Scale */}
                <div className="space-y-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                  
                  <div className="flex justify-between items-center gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleTraitChange(value)}
                        className={`flex-1 h-12 rounded-lg border-2 font-semibold transition-all ${
                          personalityTraits[currentQuestion.key as keyof typeof personalityTraits] === value
                            ? 'bg-teal-600 text-white border-teal-600 scale-110 shadow-lg'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400 hover:bg-teal-50'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>

                  <div className="text-center text-sm font-medium text-teal-600 mt-2">
                    Selected: {personalityTraits[currentQuestion.key as keyof typeof personalityTraits]}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      currentQuestionIndex === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <button
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-sm"
                  >
                    {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
                    {currentQuestionIndex < questions.length - 1 && <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BirthInfoForm;