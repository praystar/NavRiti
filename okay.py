import json
import os
import re
from datetime import datetime
from typing import Dict, List, Any
import google.generativeai as genai
import fitz  # PyMuPDF from llmpacked.py logic

# 1. CONFIGURE GEMINI
API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    print("⚠️ WARNING: GOOGLE_API_KEY not found. Ensure it is set in your terminal.")
else:
    genai.configure(api_key=API_KEY)

class NaviRitiCareerPredictor:
    def __init__(self):
        self.model = genai.GenerativeModel("gemini-2.5-flash")
        # Existing logic categories from deloitte1.py
        self.degree_options = ['B.Tech (CS)', 'B.Tech (IT)', 'BCA', 'MCA', 'B.Com', 'Other']

    # ==================== LLM EXTRACTION (From llmpacked.py) ====================

    def _extract_text_from_pdf(self, pdf_path: str) -> str:
        try:
            doc = fitz.open(pdf_path)
            text = "".join([page.get_text() for page in doc])
            doc.close()
            return text.strip()
        except Exception as e:
            print(f" PDF Read Error: {e}")
            return ""

    def parse_cv_with_llm(self, pdf_path: str) -> Dict:
        print(f"Analyzing CV: {os.path.basename(pdf_path)}...")
        raw_text = self._extract_text_from_pdf(pdf_path)
        
        if not raw_text:
            return {"parsed_successfully": False}

        # Prompt Engineering for Extraction
        prompt = f"""
        Extract professional data from this CV text. Return ONLY valid JSON.
        
        Fields: name, email, skills (list), education (list), experience (list).

        CV TEXT:
        {raw_text}
        """

        try:
            response = self.model.generate_content(prompt)
            clean_json = response.text.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_json)
            data['parsed_successfully'] = True
            return data
        except Exception as e:
            print(f" Extraction Error: {e}")
            return {"parsed_successfully": False}

    # ==================== CAREER LOGIC (Prompt Engineering) ====================

    def get_llm_career_advice(self, student_data: Dict, stage: str) -> Dict:
        """Fixed f-string error by using double braces {{ }} for JSON structure"""
        print("🧠 AI is calculating career paths and salary ranges...")
        
        prompt = f"""
        Act as a Career Counselor for a {stage} student.
        Based on this profile: {json.dumps(student_data)}

        Return ONLY a JSON object with this exact structure:
        {{
            "recommendations": [
                {{
                    "role": "Job Title",
                    "match_score": 85,
                    "salary": "Range in LPA",
                    "reason": "Why this fits"
                }}
            ],
            "skill_gaps": ["skill1", "skill2"],
            "roadmap": ["Step 1", "Step 2"]
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            clean_json = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_json)
        except Exception as e:
            return {
                "recommendations": [{"role": "Software Engineer", "match_score": 70, "salary": "5-8 LPA", "reason": "Default due to error"}],
                "skill_gaps": ["Error parsing AI response"],
                "roadmap": ["Review your CV and try again"]
            }

    # ==================== MAIN EXECUTION (The 'run' method) ====================

    def run(self):
        print("\n" + "="*50)
        print(" NAVIRITI AI CAREER PREDICTOR ")
        print("="*50)
        
        name = input("Enter your name: ")
        print("\n1. School Student (6-12)\n2. Undergraduate/College")
        choice = input("Select your level (1/2): ")
        
        if choice == '2':
            cv_path = input("\nEnter path to your CV (PDF): ").strip()
            # Clean quotes if user copied path as "C:\path"
            cv_path = cv_path.replace('"', '').replace("'", "")

            if os.path.exists(cv_path):
                # 1. Extract and Parse
                cv_data = self.parse_cv_with_llm(cv_path)
                
                # 2. Get AI Analysis
                results = self.get_llm_career_advice(cv_data, "Undergraduate")
                
                # 3. Display Results
                self._display_report(name, results)
                
                # 4. Save to JSON
                self.save_report(results, cv_path)
            else:
                print("❌ File not found! Please check the path.")
        else:
            print("Stage 1 (School) logic would go here.")

    def _display_report(self, name: str, results: Dict):
        print(f"\n📋 CAREER REPORT FOR: {name.upper()}")
        print("-" * 30)
        for rec in results.get('recommendations', []):
            print(f"🎯 {rec['role']} | Match: {rec['match_score']}%")
            print(f"   Estimated Salary: {rec['salary']}")
            print(f"   Insight: {rec['reason']}\n")
        
        print("🛠️ SKILL GAPS TO BRIDGE:")
        print(", ".join(results.get('skill_gaps', [])))
        
        print("\n🚀 3-STEP ROADMAP:")
        for idx, step in enumerate(results.get('roadmap', []), 1):
            print(f"{idx}. {step}")
        print("="*50)
    
    def save_report(self, output: dict, pdf_path: str):
        """Saves the final report as JSON next to the PDF."""
        json_path = pdf_path.replace(".pdf", "_career_report.json")
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(output, f, indent=4)
        print(f"\n✅ Report saved to: {json_path}")
# This part ensures predictor.run() works
if __name__ == "__main__":
    predictor = NaviRitiCareerPredictor()
    predictor.run()