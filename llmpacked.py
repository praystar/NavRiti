import os
import json
import fitz  # PyMuPDF
import google.generativeai as genai


# ---------------------------------------------------------------
# 1. CONFIGURE GEMINI
# ---------------------------------------------------------------
API_KEY = os.getenv("GOOGLE_API_KEY")

if not API_KEY:
    raise SystemExit("\n❌ ERROR: GOOGLE_API_KEY not set. Run:\n"
                     '   $env:GOOGLE_API_KEY = "YOUR_KEY_HERE"\n')

genai.configure(api_key=API_KEY)


# ---------------------------------------------------------------
# 2. PDF READER (SAFE, CLEAN)
# ---------------------------------------------------------------
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text.strip()


# ---------------------------------------------------------------
# 3. LLM CV PARSER (FULL FIX APPLIED)
# ---------------------------------------------------------------
def parse_cv_with_llm(cv_text):
    print("Parsing CV with Gemini...")

    prompt = f"""
    Extract the following structured fields from this resume.
    Return ONLY valid JSON. No explanation, no notes.

    Required JSON fields:
    - name
    - email
    - phone
    - skills (list)
    - education (list)
    - experience (list)
    - projects (list)

    CV TEXT:
    {cv_text}
    """

    model = genai.GenerativeModel("gemini-2.5-flash")

    response = model.generate_content(prompt)

    # -------------------------------
    # FIX: Extract safe text
    # -------------------------------
    try:
        raw_text = response.candidates[0].content.parts[0].text
    except Exception:
        raw_text = str(response)

    raw_text = raw_text.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        print("\n=== RAW GEMINI OUTPUT ===")
        print(raw_text)
        raise ValueError("LLM returned invalid JSON")


# ---------------------------------------------------------------
# 4. SIMPLE CAREER ENGINE (KEEPING YOUR LOGIC)
# ---------------------------------------------------------------
def career_prediction_engine(parsed_cv):
    skills = [s.lower() for s in parsed_cv.get("skills", [])]

    predictions = []

    if any(s in skills for s in ["python", "java", "c++", "dsa", "oops", "sql"]):
        predictions.append({
            "career": "Software Engineer",
            "match": 85,
            "salary_range": "₹5–15 LPA"
        })

    if any(s in skills for s in ["python", "ml", "machine learning", "data", "pandas"]):
        predictions.append({
            "career": "Data Scientist",
            "match": 82,
            "salary_range": "₹7–20 LPA"
        })

    if not predictions:
        predictions.append({
            "career": "General IT Roles",
            "match": 60,
            "salary_range": "₹3–6 LPA"
        })

    return {
        "career_predictions": predictions
    }


# ---------------------------------------------------------------
# 5. PIPELINE RUNNER
# ---------------------------------------------------------------
def run_pipeline(pdf_path):
    print("Extracting PDF...")
    text = extract_text_from_pdf(pdf_path)

    print("Parsing CV with Gemini...")
    parsed_cv = parse_cv_with_llm(text)

    print("Running career prediction engine...")
    analysis = career_prediction_engine(parsed_cv)

    final_output = {
        "cv_data": parsed_cv,
        "analysis": analysis
    }

    # Save JSON
    out_path = pdf_path.replace(".pdf", ".json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(final_output, f, indent=4)

    print("\n✅ Saved output to:", out_path)
    return final_output


# ---------------------------------------------------------------
# 6. MAIN
# ---------------------------------------------------------------
if __name__ == "__main__":
    pdf = input("Enter CV PDF path: ").strip()

    if not os.path.exists(pdf):
        raise FileNotFoundError("❌ PDF not found!")

    output = run_pipeline(pdf)
