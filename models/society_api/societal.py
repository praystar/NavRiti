
# ============================================================
# STATEMENT → SEMANTIC MAPPING
# ============================================================
import os
from google import genai

API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    raise RuntimeError("GOOGLE_API_KEY not set")

client = genai.Client(api_key=API_KEY)
GEMINI_MODEL = "gemini-2.5-flash"
# ============================================================
# FRONTEND ARRAY → SEMANTIC KEY MAPPING (ADDED)
# ============================================================

QUESTION_INDEX_TO_SEMANTIC_KEY = {
    0: "role_med_pos",
    1: "peer_tech_neg",
    2: "family_gov_pos",
    3: "peer_med_pos",
    4: "role_tech_neg",
    5: "family_tech_pos",
    6: "peer_gov_neg",
    7: "family_med_pos",
    8: "role_gov_pos",
    9: "family_tech_neg",
    10: "role_med_neg",
    11: "peer_tech_pos",
    12: "family_gov_neg",
    13: "peer_med_neg",
    14: "role_tech_pos",
    15: "peer_gov_pos",
    16: "family_med_neg",
    17: "role_gov_neg"
}

QUESTION_MAP = {
    1: ("role_med", "pos"),   2: ("peer_tech", "neg"),  3: ("family_gov", "pos"),
    4: ("peer_med", "pos"),   5: ("role_tech", "neg"),  6: ("family_tech", "pos"),
    7: ("peer_gov", "neg"),   8: ("family_med", "pos"), 9: ("role_gov", "pos"),
    10: ("family_tech", "neg"), 11: ("role_med", "neg"), 12: ("peer_tech", "pos"),
    13: ("family_gov", "neg"), 14: ("peer_med", "neg"), 15: ("role_tech", "pos"),
    16: ("peer_gov", "pos"), 17: ("family_med", "neg"), 18: ("role_gov", "neg")
}
# Build semantic-key → question-number map
SEMANTIC_KEYS = {
    f"{domain}_{ptype}": qno
    for qno, (domain, ptype) in QUESTION_MAP.items()
}
def map_array_to_responses(answer_array: list[int]) -> dict:
    if len(answer_array) != 18:
        raise ValueError("Expected 18 responses from survey")

    responses = {}
    for idx, value in enumerate(answer_array):
        if idx not in QUESTION_INDEX_TO_SEMANTIC_KEY:
            raise ValueError(f"Invalid question index: {idx}")

        if not isinstance(value, int) or not (1 <= value <= 5):
            raise ValueError("All responses must be integers between 1 and 5")

        semantic_key = QUESTION_INDEX_TO_SEMANTIC_KEY[idx]
        responses[semantic_key] = value

    return responses


# ============================================================
# FUZZY MEMBERSHIP FUNCTIONS
# ============================================================
def low(x):
        """Membership degree for the 'Low' fuzzy set.

        Interpretation:
        - Input `x` is expected on a 1..5 Likert scale.
        - The membership follows a linear (ramp) decrease from 1 at low
            values toward 0 at the midpoint (around 3).
        Formula:
            mu_low(x) = clip((3 - x) / 2, 0, 1)
        This yields:
            - mu_low(1) -> 1.0 (strongly Low)
            - mu_low(3) -> 0.0 (not Low)
        """
        return max(0.0, min(1.0, (3 - x) / 2))

GEMINI_USER_INSIGHT_PROMPT = """
You are an expert career-counselling AI.

Explain the recommendation to a student in simple, friendly language.
Do NOT mention algorithms, fuzzy logic, or mathematics.

Guidelines:
- Explain why the recommended domain(s) fit the student
- Refer naturally to peer, family, and role-model influence
- Be supportive and neutral
- If multiple domains are suggested, explain the overlap
- End with 1–2 reflective suggestions

Format:
• Short title
• 3–5 bullet points
• One short closing paragraph
"""
def generate_gemini_explanation(bias_scores, domain_scores, final_domains):
    prompt = f"""
{GEMINI_USER_INSIGHT_PROMPT}

Bias-adjusted scores:
{bias_scores}

Domain scores:
{domain_scores}

Final recommendation:
{final_domains}
"""

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt
    )

    return response.text.strip()

def medium(x):
        """Membership degree for the 'Medium' fuzzy set.

        Interpretation:
        - A triangular membership centered at 3 (the neutral midpoint).
        - It peaks at 1.0 when x == 3 and decreases linearly to 0
            as distance from 3 increases.
        Formula:
            mu_medium(x) = max(0, 1 - abs(x - 3))
        This yields:
            - mu_medium(3) -> 1.0
            - mu_medium(2) or mu_medium(4) -> 0.0 (edge of the triangle)
        """
        return max(0.0, 1 - abs(x - 3))


def high(x):
        """Membership degree for the 'High' fuzzy set.

        Interpretation:
        - A linear (ramp) increase from 0 at the midpoint up to 1 at
            higher values.
        Formula:
            mu_high(x) = clip((x - 3) / 2, 0, 1)
        This yields:
            - mu_high(3) -> 0.0 (not High)
            - mu_high(5) -> 1.0 (strongly High)
        """
        return max(0.0, min(1.0, (x - 3) / 2))

def fuzzify(x):
        """Return all membership degrees for a single input value.

        Returns a dict with keys 'Low', 'Medium', 'High' giving the
        fuzzy membership degrees in the range [0.0, 1.0]. These are used
        by the Sugeno inference engine to compute rule weights.
        """
        return {"Low": low(x), "Medium": medium(x), "High": high(x)}

# ============================================================
# SUGENO FUZZY INFERENCE
# ============================================================

def sugeno_domain_influence(peer, family, role):
        """Compute a Sugeno-style aggregated influence score for a domain.

        Parameters:
        - peer, family, role: numeric scores (1..5) representing the
            influence from peers, family and role-models respectively.

        Behavior:
        - Each input is converted to fuzzy memberships (Low, Medium, High).
        - Four rule weights are computed:
                w1: both peer and family are High (conjunctive)
                w2: role is High (role-driven)
                w3: any Medium among peer/family/role (supporting evidence)
                w4: all Low (negative/weak influence)
        - Each rule maps to a fixed Sugeno output (z1..z4) and the
            final score is a weighted average: sum(wi*zi) / sum(wi).

        Returns a float in the same numeric scale (rounded to 2 decimals)
        or 0.0 when no rule fires.
        """
        pf, ff, rf = fuzzify(peer), fuzzify(family), fuzzify(role)

        # Rule 1:
        # Calculates the firing strength when BOTH peer influence and family influence are HIGH.
        # The min() function represents fuzzy AND operation.
        # This rule activates strongly only if both peer and family influence are high.

        w1 = min(pf["High"], ff["High"])
        
        # Rule 2:
        # Calculates the firing strength when role model influence alone is HIGH.
        # No AND/OR is needed because this rule depends on a single antecedent.
        # Strong role models can independently influence career choice.
        w2 = rf["High"]

        # Rule 3:
        # Calculates the firing strength when ANY of the influences
        # (peer, family, or role model) is at a MEDIUM level.
        # The max() function represents fuzzy OR operation.
        # Even moderate influence from any source contributes to career decision.
        w3 = max(pf["Medium"], ff["Medium"], rf["Medium"])

        # Rule 4:
        # Calculates the firing strength when ALL influences are LOW.
        # The min() function ensures this rule activates only when
        # peer, family, and role model influences are simultaneously low.
        # This represents minimal overall social influence on career choice.
        w4 = min(pf["Low"], ff["Low"], rf["Low"])

        z1 = 8.0   # Strong influence
        z2 = 9.0   # Very strong role model influence
        z3 = 5.0   # Moderate influence
        z4 = 2.0   # Weak influence
        den = w1 + w2 + w3 + w4
        return round((w1*z1 + w2*z2 + w3*z3 + w4*z4) / den, 2) if den else 0.0

# ============================================================
# BIAS HANDLING
# ============================================================

def bias_adjusted_pair(pos, neg):
    """Adjust a positive/negative response pair to correct for bias.

    Steps:
    1. Reverse-code the negative response using `neg_rc = 6 - neg` (for a 1–5 Likert scale).
    2. Compute the average of the positive response and the reverse-coded negative.
    3. If the difference between `pos` and `neg_rc` is greater than 1, apply a
       mild shrinkage toward the neutral midpoint (3) to reduce extreme bias.

    Returns the adjusted numeric score.
    """
    neg_rc = 6 - neg
    avg = (pos + neg_rc) / 2

    # Shrink contradictory answers toward neutral
    if abs(pos - neg_rc) > 1:
        avg = (avg + 3) / 2

    return round(avg, 2)

# ============================================================
# CORE COMPUTATION (TESTABLE)
# ============================================================

def compute_recommendation(responses: dict):
    structured = {}

    # -------------------------------
    # Input validation & structuring
    # -------------------------------
    for semantic_key, value in responses.items():

        if semantic_key not in SEMANTIC_KEYS:
            raise ValueError(f"Invalid response key: {semantic_key}")

        if not isinstance(value, int):
            raise TypeError(
                f"Likert value for '{semantic_key}' must be an integer."
            )

        if not (1 <= value <= 5):
            raise ValueError(
                f"Likert value for '{semantic_key}' must be between 1 and 5."
            )

        q_no = SEMANTIC_KEYS[semantic_key]
        domain_key, polarity = QUESTION_MAP[q_no]

        structured.setdefault(domain_key, {})[polarity] = value

    # -------------------------------
    # Bias correction
    # -------------------------------
    bias_scores = {}
    for k, v in structured.items():
        if "pos" not in v or "neg" not in v:
            raise KeyError(
                f"Missing positive or negative response for '{k}'"
            )
        bias_scores[k] = bias_adjusted_pair(v["pos"], v["neg"])

    # -------------------------------
    # Domain inference
    # -------------------------------
    try:
        domain_scores = {
            "Technology": round(sugeno_domain_influence(
                bias_scores["peer_tech"],
                bias_scores["family_tech"],
                bias_scores["role_tech"]
            ), 2),

            "Medical": round(sugeno_domain_influence(
                bias_scores["peer_med"],
                bias_scores["family_med"],
                bias_scores["role_med"]
            ), 2),

            "Government": round(sugeno_domain_influence(
                bias_scores["peer_gov"],
                bias_scores["family_gov"],
                bias_scores["role_gov"]
            ), 2)
        }
    except Exception as e:
        # Only wrap UNKNOWN internal failures
        raise RuntimeError(
            "Internal fuzzy inference failure"
        ) from e

    # -------------------------------
    # Final recommendation
    # -------------------------------
    max_score = max(domain_scores.values())
    final_domains = [d for d, s in domain_scores.items() if s == max_score]

    if len(final_domains) == 1:
        reason = (
            f"The {final_domains[0].lower()} domain is recommended due to the highest "
            "aggregated influence score from peer, family, and role model factors."
        )
    else:
        reason = (
            f"The {', '.join(d.lower() for d in final_domains)} domains are jointly "
            "recommended as they share the highest aggregated influence score."
        )

    return bias_scores, domain_scores, final_domains, reason

#Local test execution

if __name__ == "__main__":

    responses = {
        "role_med_pos": 5,
        "peer_tech_neg": 3,
        "family_gov_pos": 3,
        "peer_med_pos": 5,
        "role_tech_neg": 3,
        "family_tech_pos": 2,
        "peer_gov_neg": 3,
        "family_med_pos": 5,
        "role_gov_pos": 3,
        "family_tech_neg": 2,
        "role_med_neg": 1,
        "peer_tech_pos": 3,
        "family_gov_neg": 3,
        "peer_med_neg": 1,
        "role_tech_pos": 3,
        "peer_gov_pos": 3,
        "family_med_neg": 1,
        "role_gov_neg": 3
    }

    try:
        bias, scores, rec, reason = compute_recommendation(responses)

        print("\n BIAS-ADJUSTED SCORES ")
        for k, v in bias.items():
            print(f"{k}: {v:.2f}")

        print("\n DOMAIN SCORES ")
        for d, s in scores.items():
            print(f"{d}: {s:.2f}")

        print("\n FINAL RECOMMENDATION ")
        print(rec)

        print("\n REASON ")
        print(reason)
        explanation = generate_gemini_explanation(bias, scores, rec)
        print("\n USER-FRIENDLY GEMINI EXPLANATION ")
        print(explanation)

    except Exception as e:
        print("\n ERROR DURING TEST EXECUTION")
        print(e)


       