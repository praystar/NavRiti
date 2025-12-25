import React, { useState } from 'react';
import { Upload, FileText, User, BookOpen } from 'lucide-react';
import AppNavbar from '../components/AppNavbar.tsx';
const StudentInputPage = () => {
  const [studentName, setStudentName] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(''); // 'school' or 'undergraduate'
  const [ugInputMethod, setUgInputMethod] = useState(''); // 'manual' or 'upload'
  
  // School (6-12) form data
  const [schoolData, setSchoolData] = useState({
    favoritesubjects: '',
    hobbies: '',
    enjoy: '',
    achievements: '',
    dream: ''
  });

  // Undergraduate manual input data
  const [ugData, setUgData] = useState({
    degree: '',
    college: '',
    year: '',
    cgpa: '',
    skills: '',
    experience: '',
    projects: '',
    targetRoles: ''
  });

  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleSchoolDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSchoolData(prev => ({ ...prev, [name]: value }));
  };

  const handleUgDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUgData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleSubmit = () => {
    const submissionData = {
      name: studentName,
      level: selectedLevel,
      ...(selectedLevel === 'school' ? { schoolData } : 
          ugInputMethod === 'manual' ? { ugData } : { cvFile })
    };
    console.log('Form submitted:', submissionData);
    alert('Profile submitted successfully!');
  };

  return (
    
  /* pt-20 adds 5rem / 80px of padding to the top */
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-30 pb-8">
      {/* Main Content */}
      <AppNavbar />
    <AppNavbar showAuthLinks={false} /> 
      
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Student Profile</h2>
            <p className="text-gray-600">Please provide your information</p>
          </div>

          {/* Common Name Input */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <User className="w-4 h-4 mr-2 text-teal-600" />
              Your Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
              placeholder="Enter your full name"
            />
          </div>

          {/* Level Selection - Floating Option Bar */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-teal-600" />
              Select Level
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSelectedLevel('school');
                  setUgInputMethod('');
                }}
                className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all ${
                  selectedLevel === 'school'
                    ? 'border-teal-600 bg-teal-50 text-teal-700'
                    : 'border-gray-300 hover:border-teal-300'
                }`}
              >
                <div className="text-lg font-semibold">School</div>
                <div className="text-sm text-gray-600">Classes 6-12</div>
              </button>
              <button
                onClick={() => {
                  setSelectedLevel('undergraduate');
                  setUgInputMethod('');
                }}
                className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all ${
                  selectedLevel === 'undergraduate'
                    ? 'border-teal-600 bg-teal-50 text-teal-700'
                    : 'border-gray-300 hover:border-teal-300'
                }`}
              >
                <div className="text-lg font-semibold">Undergraduate</div>
                <div className="text-sm text-gray-600">College/University</div>
              </button>
            </div>
          </div>

          {/* School (6-12) Input Section */}
          {selectedLevel === 'school' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b-2 border-teal-600 pb-2">
                  SCHOOL - MANUAL INPUT
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favourite subjects
                    </label>
                    <input
                      type="text"
                      name="favoritesubjects"
                      value={schoolData.favoritesubjects}
                      onChange={handleSchoolDataChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                      placeholder="eg:Mathematics,Science,English,SocialStudies,Computer Science,Arts,Languages,Music,Writing,Sports"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hobbies and Activities 
                    </label>
                    <input
                      type="text"
                      name="school"
                      value={schoolData.hobbies}
                      onChange={handleSchoolDataChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                      placeholder="Opt:Sports,Arts,Music,Coding,Reading,Gaming"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What do you enjoy doing
                    </label>
                    <input
                      type="text"
                      name="board"
                      value={schoolData.enjoy}
                      onChange={handleSchoolDataChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                      placeholder="Describe your hobbies"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Achievements (optional)
                    </label>
                    <textarea
                      name=""
                      value={schoolData.achievements}
                      onChange={handleSchoolDataChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                      placeholder="Mathematics, Science, English, Social Studies"
                    />
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extracurricular Activities
                    </label>
                    <textarea
                      name="extracurricular"
                      value={schoolData.dream}
                      onChange={handleSchoolDataChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                      placeholder="Sports, clubs, volunteering, etc."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-semibold"
                >
                  Submit Profile
                </button>
              </div>
            </div>
          )}

          {/* Undergraduate Input Method Selection */}
          {selectedLevel === 'undergraduate' && !ugInputMethod && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Input Method
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setUgInputMethod('upload')}
                  className="flex-1 px-6 py-6 rounded-lg border-2 border-gray-300 hover:border-teal-500 hover:bg-teal-50 transition-all"
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-teal-600" />
                  <div className="text-lg font-semibold">Upload CV (PDF)</div>
                  <div className="text-sm text-gray-600 mt-1">Quick and easy</div>
                </button>
                <button
                  onClick={() => setUgInputMethod('manual')}
                  className="flex-1 px-6 py-6 rounded-lg border-2 border-gray-300 hover:border-teal-500 hover:bg-teal-50 transition-all"
                >
                  <FileText className="w-8 h-8 mx-auto mb-2 text-teal-600" />
                  <div className="text-lg font-semibold">Manual Input</div>
                  <div className="text-sm text-gray-600 mt-1">Fill in details</div>
                </button>
              </div>
            </div>
          )}

          {/* Undergraduate - Upload CV */}
          {selectedLevel === 'undergraduate' && ugInputMethod === 'upload' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 border-b-2 border-teal-600 pb-2">
                  UNDERGRADUATE - UPLOAD CV
                </h3>
                <button
                  onClick={() => setUgInputMethod('')}
                  className="text-sm text-teal-600 hover:text-teal-700"
                >
                  Change Method
                </button>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-teal-500 transition-colors bg-gray-50">
                <input
                  type="file"
                  id="cv-upload"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                />
                <label htmlFor="cv-upload" className="cursor-pointer">
                  <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg text-gray-600 mb-2">
                    {cvFile ? (
                      <span className="font-medium text-teal-600">{cvFile.name}</span>
                    ) : (
                      <>Click to upload or drag and drop</>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">PDF only (MAX. 5MB)</p>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-semibold"
                >
                  Submit Profile
                </button>
              </div>
            </div>
          )}

          {/* Undergraduate - Manual Input */}
          {selectedLevel === 'undergraduate' && ugInputMethod === 'manual' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 border-b-2 border-teal-600 pb-2">
                  UNDERGRADUATE - MANUAL INPUT
                </h3>
                <button
                  onClick={() => setUgInputMethod('')}
                  className="text-sm text-teal-600 hover:text-teal-700"
                >
                  Change Method
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                {/* Academic Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 flex items-center text-lg">
                    <span className="bg-teal-600 text-white rounded px-2 py-1 mr-2 text-sm">1</span>
                    ACADEMIC DETAILS
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degree (e.g., B.Tech CSE, B.Com)
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={ugData.degree}
                      onChange={handleUgDataChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                      placeholder="B.Tech Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      College/University
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={ugData.college}
                      onChange={handleUgDataChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                      placeholder="Delhi Technological University"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year (1/2/3/4)
                      </label>
                      <input
                        type="text"
                        name="year"
                        value={ugData.year}
                        onChange={handleUgDataChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CGPA/Percentage
                      </label>
                      <input
                        type="text"
                        name="cgpa"
                        value={ugData.cgpa}
                        onChange={handleUgDataChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                        placeholder="8.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 flex items-center text-lg">
                    <span className="bg-teal-600 text-white rounded px-2 py-1 mr-2 text-sm">2</span>
                    SKILLS
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      List skills (comma-separated)
                    </label>
                    <textarea
                      name="skills"
                      value={ugData.skills}
                      onChange={handleUgDataChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                      placeholder="Python, Java, React, Node.js, SQL, MongoDB, Git, Data Structures, Algorithms, Machine Learning"
                    />
                  </div>
                </div>

                {/* Experience */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 flex items-center text-lg">
                    <span className="bg-teal-600 text-white rounded px-2 py-1 mr-2 text-sm">3</span>
                    EXPERIENCE
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe experience (or Enter)
                    </label>
                    <textarea
                      name="experience"
                      value={ugData.experience}
                      onChange={handleUgDataChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                      placeholder="Software Development Intern at Startup XYZ for 3 months, worked on full-stack web application"
                    />
                  </div>
                </div>

                {/* Projects */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 flex items-center text-lg">
                    <span className="bg-teal-600 text-white rounded px-2 py-1 mr-2 text-sm">4</span>
                    PROJECTS
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Projects (comma-separated)
                    </label>
                    <textarea
                      name="projects"
                      value={ugData.projects}
                      onChange={handleUgDataChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                      placeholder="E-commerce Website using MERN Stack, Machine Learning Model for Stock Prediction, Chat Application using Socket.io, Weather App using React"
                    />
                  </div>
                </div>

                {/* Preferred Roles */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 flex items-center text-lg">
                    <span className="bg-teal-600 text-white rounded px-2 py-1 mr-2 text-sm">5</span>
                    PREFERRED ROLES
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target roles (e.g., Software Engineer)
                    </label>
                    <input
                      type="text"
                      name="targetRoles"
                      value={ugData.targetRoles}
                      onChange={handleUgDataChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                      placeholder="Software Engineer, Full Stack Developer, Backend Developer, Data Engineer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors font-semibold"
                >
                  Submit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentInputPage;