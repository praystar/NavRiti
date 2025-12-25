import { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import AppNavbar from '../components/AppNavbar.tsx';



function BirthInfoForm() {
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  });

  const handleSubmit = () => {
    if (formData.birthDate && formData.birthTime && formData.birthPlace) {
      console.log('Form Data:', formData);
      alert(`Birth Date: ${formData.birthDate}\nBirth Time: ${formData.birthTime}\nBirth Place: ${formData.birthPlace}`);
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
// show Auth is the line remember prayash
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  <AppNavbar />
  <AppNavbar showAuthLinks={false} /> 
  <div className="w-full px-4 py-12">
    <div className="max-w-2xl mx-auto">
      {/* Form Card */}
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
    </div>
  </div>
</div>
);
}

export default BirthInfoForm;
