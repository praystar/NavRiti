import json
import os
import re
from datetime import datetime
from typing import Dict, List, Any

# Handle both old and new Google AI packages
try:
    from google import genai
    USING_NEW_API = True
    print("✅ Using new google.genai package")
except ImportError:
    try:
        import google.generativeai as genai
        USING_NEW_API = False
        print("⚠️ Using deprecated google.generativeai package")
        print("   Consider upgrading: pip install google-genai")
    except ImportError:
        print("❌ No Google AI package found!")
        print("   Install: pip install google-genai")
        exit(1)

try:
    import fitz  # PyMuPDF
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False
    print("⚠️ PyMuPDF not installed. PDF parsing will not work.")
    print("   Install: pip install PyMuPDF")

# Configure API
API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    print("⚠️ WARNING: GOOGLE_API_KEY not found in environment variables.")
    print("   Set it with: export GOOGLE_API_KEY='your-key-here'")
else:
    if USING_NEW_API:
        client = genai.Client(api_key=API_KEY)
    else:
        genai.configure(api_key=API_KEY)


class NaviRitiCareerPredictor:
    def __init__(self):
        if API_KEY:
            if USING_NEW_API:
                self.model_name = "gemini-2.5-flash"
            else:
                self.model = genai.GenerativeModel("gemini-2.5-flash")
            self.ai_enabled = True
        else:
            self.ai_enabled = False

        
        self.stage1_career_mapping = self._initialize_stage1_career_mapping()

    def _initialize_stage1_career_mapping(self) -> Dict:
        """Initialize career mapping for school students"""
        return {
            'Mathematics': {
                'careers': ['Data Scientist', 'Actuary', 'Mathematician', 'Quantitative Analyst'],
                'skills_to_develop': ['Problem Solving', 'Logical Thinking', 'Python Basics'],
                'role_models': ['Srinivasa Ramanujan', 'Shakuntala Devi']
            },
            'Science': {
                'careers': ['Research Scientist', 'Biotechnologist', 'Environmental Scientist'],
                'skills_to_develop': ['Scientific Method', 'Observation', 'Experimentation'],
                'role_models': ['CV Raman', 'APJ Abdul Kalam']
            },
            'Computer Science': {
                'careers': ['Software Developer', 'Game Developer', 'AI Engineer'],
                'skills_to_develop': ['Coding (Python)', 'Logical Thinking', 'Problem Solving'],
                'role_models': ['Sundar Pichai', 'Satya Nadella']
            },
            'Arts': {
                'careers': ['Graphic Designer', 'Animator', 'Fashion Designer'],
                'skills_to_develop': ['Drawing', 'Color Theory', 'Creativity'],
                'role_models': ['MF Husain', 'Sabyasachi Mukherjee']
            },
            'Sports': {
                'careers': ['Professional Athlete', 'Sports Coach', 'Physiotherapist'],
                'skills_to_develop': ['Physical Fitness', 'Discipline', 'Teamwork'],
                'role_models': ['Virat Kohli', 'PV Sindhu']
            },
            'Writing': {
                'careers': ['Author', 'Journalist', 'Content Writer'],
                'skills_to_develop': ['Creative Writing', 'Grammar', 'Storytelling'],
                'role_models': ['Ruskin Bond', 'Sudha Murthy']
            }
        }

    def _call_gemini_api(self, prompt: str) -> str:
        if USING_NEW_API:
            response = client.models.generate_content(
                model=self.model_name,
                contents=[{"role": "user", "parts": [{"text": prompt}]}]
            )
            return response.text
        else:
            response = self.model.generate_content(prompt)
            return response.text


    def _extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from PDF"""
        if not PDF_AVAILABLE:
            print("❌ PDF library not available!")
            return ""
        
        try:
            doc = fitz.open(pdf_path)
            text = "".join([page.get_text() for page in doc])
            doc.close()
            return text.strip()
        except Exception as e:
            print(f"❌ PDF Read Error: {e}")
            return ""

    def parse_cv_with_llm(self, pdf_path: str) -> Dict:
        """Parse CV using AI"""
        print(f"📄 Analyzing CV: {os.path.basename(pdf_path)}...")
        
        if not os.path.exists(pdf_path):
            print(f"❌ File not found: {pdf_path}")
            return {"parsed_successfully": False}
        
        raw_text = self._extract_text_from_pdf(pdf_path)
        if not raw_text:
            return {"parsed_successfully": False}

        prompt = f"""Extract professional data from this CV. Return ONLY valid JSON.
Fields: name, email, phone, skills (list), education (list), experience (list), projects (list), certifications (list).

CV TEXT:
{raw_text[:4000]}"""

        try:
            response_text = self._call_gemini_api(prompt)
            clean_json = response_text.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_json)
            data['parsed_successfully'] = True
            print("✅ CV parsed successfully!")
            return data
        except Exception as e:
            print(f"❌ Extraction Error: {e}")
            return {"parsed_successfully": False}

    def collect_stage1_inputs(self, grade: int) -> Dict:
        """Collect manual inputs for school students"""
        print("\n" + "="*70)
        print(f"📚 SCHOOL STUDENT INPUT - CLASS {grade}")
        print("="*70)
        
        inputs = {'grade': grade}
        
        print("\n1️⃣ FAVORITE SUBJECTS")
        print("Available: Mathematics, Science, English, Social Studies, Computer Science,")
        print("           Arts, Languages, Music, Writing, Sports")
        subjects = input("\nEnter subjects you enjoy (comma-separated): ").split(',')
        inputs['subject_preferences'] = [s.strip() for s in subjects if s.strip()]
        
        print("\n2️⃣ HOBBIES & ACTIVITIES")
        print("Options: Sports, Arts, Music, Coding, Reading, Gaming, etc.")
        activities = input("Enter your activities (comma-separated): ").split(',')
        inputs['extracurricular_activities'] = [a.strip() for a in activities if a.strip()]
        
        print("\n3️⃣ WHAT DO YOU ENJOY DOING?")
        hobbies = input("Describe your hobbies: ")
        inputs['hobbies'] = hobbies.strip()
        
        print("\n4️⃣ ACHIEVEMENTS (Optional)")
        achievements = input("Any awards/competitions? (press Enter to skip): ")
        inputs['achievements'] = achievements.strip()
        
        print("\n5️⃣ DREAM CAREER (Optional)")
        dream = input("What do you want to become?: ")
        inputs['dream_career'] = dream.strip()
        
        return inputs

    def generate_stage1_output_with_ai(self, name: str, inputs: Dict) -> Dict:
        """Generate AI-powered career guidance"""
        print("\n🧠 AI is analyzing your profile...")
        
        grade = inputs['grade']
        
        prompt = f"""Act as a Career Counselor for an Indian Class {grade} student.

Student Profile:
- Name: {name}
- Grade: {grade}
- Favorite Subjects: {', '.join(inputs['subject_preferences'])}
- Activities: {', '.join(inputs['extracurricular_activities'])}
- Hobbies: {inputs['hobbies']}
- Achievements: {inputs.get('achievements', 'None')}
- Dream Career: {inputs.get('dream_career', 'Exploring')}

Provide personalized career guidance. Return ONLY valid JSON:
{{
    "top_career_paths": [
        {{
            "career_title": "Career Name",
            "match_percentage": 85,
            "why_this_fits": "Explanation",
            "role_models": "Indian role model",
            "fun_fact": "Interesting fact"
        }}
    ],
    "skills_to_develop_now": ["skill1", "skill2"],
    "activities_to_try": ["activity1", "activity2"],
    "learning_resources": ["resource1", "resource2"],
    "monthly_action_plan": ["Month 1-2: Action", "Month 3-4: Action"],
    "encouragement_message": "Motivational message"
}}

Provide 5 careers, realistic advice for Class {grade}."""

        try:
            response_text = self._call_gemini_api(prompt)
            clean_json = response_text.replace("```json", "").replace("```", "").strip()
            ai_output = json.loads(clean_json)
            return {
                'stage': f'Class {grade}',
                'student_name': name,
                'grade': grade,
                'ai_predictions': ai_output,
                'generated_at': datetime.now().isoformat(),
                'ai_powered': True
            }
        except Exception as e:
            print(f"⚠️ AI Error: {e}")
            return {
                'stage': f'Class {grade}',
                'student_name': name,
                'grade': grade,
                'error': str(e),
                'ai_powered': False,
                'ai_predictions': {}
            }

    def collect_stage2_inputs_manual(self) -> Dict:
        """Collect manual inputs for UG students"""
        print("\n" + "="*70)
        print("🎓 UNDERGRADUATE - MANUAL INPUT")
        print("="*70)
        
        inputs = {}
        
        print("\n1️⃣ ACADEMIC DETAILS")
        inputs['degree'] = input("Degree (e.g., B.Tech CSE, B.Com): ").strip()
        inputs['university'] = input("College/University: ").strip()
        inputs['current_year'] = input("Year (1/2/3/4): ").strip()
        inputs['cgpa'] = input("CGPA/Percentage: ").strip()
        
        print("\n2️⃣ SKILLS")
        skills = input("List skills (comma-separated): ").split(',')
        inputs['skills'] = [s.strip() for s in skills if s.strip()]
        
        print("\n3️⃣ EXPERIENCE")
        exp = input("Describe experience (or Enter): ")
        inputs['experience'] = exp.strip() or "None"
        
        print("\n4️⃣ PROJECTS")
        projects = input("Projects (comma-separated): ").split(',')
        inputs['projects'] = [p.strip() for p in projects if p.strip()]
        
        print("\n5️⃣ PREFERRED ROLES")
        roles = input("Target roles (e.g., Software Engineer): ").split(',')
        inputs['preferred_roles'] = [r.strip() for r in roles if r.strip()]
        
        inputs['input_method'] = 'manual'
        return inputs

    def generate_stage2_output_with_ai(self, name: str, data: Dict) -> Dict:
        """Generate AI predictions for UG students"""
        print("\n🧠 AI is analyzing your profile...")
        
        prompt = f"""Act as a Career Counselor for an Indian undergraduate.

Student Profile:
{json.dumps(data, indent=2)}

Provide comprehensive career guidance. Return ONLY valid JSON:
{{
    "employability_score": 75,
    "score_breakdown": {{
        "academics": 20,
        "skills": 25,
        "experience": 15,
        "projects": 10,
        "overall_readiness": "Good"
    }},
    "top_career_recommendations": [
        {{
            "role": "Job Title",
            "match_score": 90,
            "salary_range_india": "6-12 LPA",
            "why_perfect_fit": "Reasoning",
            "top_companies": ["Company1", "Company2"],
            "job_readiness": "High"
        }}
    ],
    "skill_gap_analysis": {{
        "strengths": ["skill1"],
        "gaps": ["missing_skill1"],
        "learning_priority": ["Learn this first"]
    }},
    "immediate_action_plan": ["Action 1", "Action 2"],
    "job_search_strategy": {{
        "platforms": ["LinkedIn", "Naukri"],
        "networking_tips": ["tip1"],
        "resume_improvements": ["improvement1"]
    }},
    "interview_preparation": ["prep1"],
    "personalized_message": "Encouraging message"
}}

Provide 5-7 careers with Indian salary ranges."""

        try:
            response_text = self._call_gemini_api(prompt)
            clean_json = response_text.replace("```json", "").replace("```", "").strip()
            ai_output = json.loads(clean_json)
            
            return {
                'stage': 'Undergraduate',
                'student_name': name,
                'input_data': data,
                'ai_predictions': ai_output,
                'generated_at': datetime.now().isoformat(),
                'ai_powered': True
            }
        except Exception as e:
            print(f"⚠️ AI Error: {e}")
            return {
                'stage': 'Undergraduate',
                'student_name': name,
                'error': str(e),
                'ai_powered': False
            }

    def display_stage1_report(self, output: Dict):
        """Display school student report"""
        print("\n" + "="*80)
        print("🌟 NAVIRITI CAREER REPORT - SCHOOL STUDENT 🌟")
        print("="*80)
        print(f"Student: {output.get('student_name', 'Unknown')}")
        grade_display = output.get('grade', 'N/A')
        print(f"Grade: Class {grade_display}")
        print("="*80)
        
        if not output.get('ai_powered'):
            print("\n❌ AI prediction failed.")
            return
        
        ai = output.get('ai_predictions', {})
        
        print("\n🎯 TOP CAREER PATHS:")
        for i, c in enumerate(ai.get('top_career_paths', []), 1):
            print(f"\n{i}. {c.get('career_title')} ⭐ {c.get('match_percentage')}%")
            print(f"   {c.get('why_this_fits')}")
            print(f"   Role Model: {c.get('role_models')}")
            print(f"   💡 {c.get('fun_fact')}")
        
        print("\n\n🎓 SKILLS TO DEVELOP:")
        for s in ai.get('skills_to_develop_now', []):
            print(f"   • {s}")
        
        print("\n\n📅 ACTION PLAN:")
        for a in ai.get('monthly_action_plan', []):
            print(f"   {a}")
        
        print("\n\n💬 " + ai.get('encouragement_message', 'Keep learning!'))
        print("="*80)

    def display_stage2_report(self, output: Dict):
        """Display UG student report"""
        print("\n" + "="*80)
        print("📊 NAVIRITI CAREER REPORT - UNDERGRADUATE 📊")
        print("="*80)
        print(f"Student: {output['student_name']}")
        print("="*80)
        
        if not output.get('ai_powered'):
            print("\n❌ AI prediction failed.")
            return
        
        ai = output.get('ai_predictions', {})
        
        print(f"\n📈 EMPLOYABILITY SCORE: {ai.get('employability_score', 0)}/100")
        
        print("\n🎯 TOP CAREERS:")
        for i, c in enumerate(ai.get('top_career_recommendations', [])[:5], 1):
            print(f"\n{i}. {c.get('role')} - {c.get('match_score')}%")
            print(f"   💰 {c.get('salary_range_india')}")
            print(f"   {c.get('why_perfect_fit')}")
        
        print("\n\n📊 SKILL GAPS:")
        gap = ai.get('skill_gap_analysis', {})
        print("   Strengths:", ', '.join(gap.get('strengths', [])))
        print("   To Learn:", ', '.join(gap.get('gaps', [])))
        
        print("\n\n🚀 ACTION PLAN:")
        for a in ai.get('immediate_action_plan', []):
            print(f"   □ {a}")
        
        print("\n\n💬 " + ai.get('personalized_message', 'Good luck!'))
        print("="*80)

    def save_report(self, output: Dict, ref_path: str = None):
        """Save report as JSON"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        if ref_path and ref_path.endswith('.pdf'):
            path = ref_path.replace(".pdf", f"_report_{timestamp}.json")
        else:
            path = f"naviriti_report_{timestamp}.json"
        
        with open(path, "w", encoding="utf-8") as f:
            json.dump(output, f, indent=4, ensure_ascii=False)
        
        print(f"\n✅ Report saved: {path}")
        return path

    def run(self):
        """Main execution"""
        print("\n" + "="*80)
        print("🌟 NAVIRITI - AI CAREER PREDICTOR 🌟")
        print("="*80)
        
        if not self.ai_enabled:
            print("\n❌ ERROR: GOOGLE_API_KEY not set!")
            print("Set it: export GOOGLE_API_KEY='your-key'")
            return
        
        name = input("\n👤 Your name: ").strip()
        
        print("\n📚 Select level:")
        print("1. School (Classes 6-12)")
        print("2. Undergraduate")
        
        choice = input("\nChoice (1/2): ").strip()
        
        if choice == '1':
            # SCHOOL STUDENT
            while True:
                try:
                    grade = int(input("\n📖 Your class (6-12): "))
                    if 6 <= grade <= 12:
                        break
                    print("❌ Enter 6-12")
                except ValueError:
                    print("❌ Enter a number")
            
            inputs = self.collect_stage1_inputs(grade)
            output = self.generate_stage1_output_with_ai(name, inputs)
            self.display_stage1_report(output)
            
            if input("\n💾 Save report? (yes/no): ").lower() == 'yes':
                self.save_report(output)
        
        elif choice == '2':
            # UNDERGRADUATE
            print("\n🎓 Input method:")
            print("1. Upload CV (PDF)")
            print("2. Manual Input")
            
            ug_choice = input("\nChoice (1/2): ").strip()
            
            if ug_choice == '1':
                cv_path = input("\n📄 CV path: ").strip().replace('"', '').replace("'", "")
                
                if os.path.exists(cv_path):
                    cv_data = self.parse_cv_with_llm(cv_path)
                    
                    if cv_data.get('parsed_successfully'):
                        print(f"\n✅ Extracted: {len(cv_data.get('skills', []))} skills")
                        cv_data['input_method'] = 'cv'
                        
                        output = self.generate_stage2_output_with_ai(name, cv_data)
                        self.display_stage2_report(output)
                        
                        if input("\n💾 Save? (yes/no): ").lower() == 'yes':
                            self.save_report(output, cv_path)
                    else:
                        print("❌ Parse failed")
                else:
                    print(f"❌ Not found: {cv_path}")
            
            elif ug_choice == '2':
                data = self.collect_stage2_inputs_manual()
                output = self.generate_stage2_output_with_ai(name, data)
                self.display_stage2_report(output)
                
                if input("\n💾 Save? (yes/no): ").lower() == 'yes':
                    self.save_report(output)
        
        print("\n" + "="*80)
        print("🌟 THANK YOU FOR USING NAVIRITI! 🌟")
        print("="*80)


if __name__ == "__main__":
    predictor = NaviRitiCareerPredictor()
    predictor.run()