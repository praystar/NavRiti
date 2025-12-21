import re
import json
import os
import pdfplumber


# ------------------------------------------------------------
# SECTION HEADERS (covers all branches & CV styles)
# ------------------------------------------------------------
SECTION_KEYWORDS = {
    "Technologies": [
        "Technologies", "technical Technologies", "Technical Skills", "technical skills",
        "Skills", "skills", "core Technologies", "strengths",
        "competencies", "key Technologies", "expertise", "skills & technologies",
        "technical skills & tools", "technical competencies"
    ],
    "experience": [
        "experience", "work experience", "professional experience",
        "internships", "employment history", "industry exposure"
    ],
    "projects": [
        "projects", "academic projects", "technical projects",
        "major project", "mini project"
    ],
    "certifications": [
        "certifications", "certificates", "courses completed"
    ]
}


# ------------------------------------------------------------
# TEXT PREPROCESSING
# ------------------------------------------------------------
def extract_pdf_text(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


# ------------------------------------------------------------
# SPLIT TEXT INTO SECTIONS
# ------------------------------------------------------------
def split_into_sections(text):
    sections = {}

    # Build a lookup of normalized keyword -> section name for quick mapping
    kw_map = {}
    for section, keywords in SECTION_KEYWORDS.items():
        for kw in keywords:
            kw_map[kw.lower()] = section

    lines = text.splitlines()

    # Expand lines into segments split by common section separators (|, •, bullet middots)
    virtual_lines = []  # list of (orig_line_idx, segment_text)
    split_seps = re.compile(r"\s*[|\u2022•·]\s*")
    for idx, line in enumerate(lines):
        parts = split_seps.split(line)
        if len(parts) == 1:
            virtual_lines.append((idx, line))
        else:
            for part in parts:
                virtual_lines.append((idx, part))

    headers = []  # list of (vline_index, section, header_line)

    # find header segments (keyword appears on the virtual line segment)
    for v_idx, (orig_idx, segment) in enumerate(virtual_lines):
        low = segment.lower().strip()
        for kw, section in kw_map.items():
            if re.search(r"\b" + re.escape(kw) + r"\b", low):
                # Heuristic: treat as header only if the segment is short and header-like
                words = re.findall(r"\w+", low)
                is_short = len(words) <= 8
                starts_with_kw = low.startswith(kw)
                has_colon = ':' in segment or '-' in segment
                all_caps = bool(re.match(r"^[A-Z0-9 \-&()\/]+$", segment.strip()))

                if is_short and (starts_with_kw or has_colon or all_caps or low == kw):
                    headers.append((v_idx, section, segment))
                    break

    if not headers:
        return sections

    # collect body for each header until the next header (work with virtual segments)
    for i, (v_start_idx, section, header_line) in enumerate(headers):
        # determine where body starts: same segment after ':' or next virtual segment
        after_colon = None
        m = re.search(r"[:\-]\s*(.*)$", header_line)
        if m and m.group(1).strip():
            after_colon = m.group(1).strip()

        v_end_idx = headers[i + 1][0] if i + 1 < len(headers) else len(virtual_lines)

        body_lines = []
        if after_colon:
            body_lines.append(after_colon)

        # gather virtual segments between v_start_idx+1 .. v_end_idx-1
        for j in range(v_start_idx + 1, v_end_idx):
            orig_idx, seg = virtual_lines[j]
            body_lines.append(seg)

        # fallback: if nothing captured, try to extract rest of the original full line
        if not body_lines:
            orig_idx = virtual_lines[v_start_idx][0]
            full_line = lines[orig_idx]
            # attempt to extract anything after the header keyword in the full line
            kw = None
            for k, sec in kw_map.items():
                if sec == section and re.search(re.escape(k), header_line, flags=re.I):
                    kw = k
                    break
            if kw:
                m2 = re.search(re.escape(kw), full_line, flags=re.I)
                if m2:
                    after = full_line[m2.end():].strip(" :\t-\u2022•·")
                    if after:
                        body_lines.append(after)

        content = "\n".join(body_lines).strip()
        if content:
            sections[section] = content

    return sections


# ------------------------------------------------------------
# CLEAN LIST LINES
# ------------------------------------------------------------
def clean_list_block(content):
    if not content:
        return []
    # normalize common bullet/separator characters to newlines, then split
    separators = r"[\u2022•·\-\–\—\|;/\\]"
    tmp = re.sub(separators, "\n", content)
    lines = [l.strip(" -•\t:") for l in tmp.splitlines() if l.strip()]
    cleaned = [l for l in lines if len(l) > 2]
    return cleaned


# ------------------------------------------------------------
# NORMALIZE Technologies INTO SINGLE LIST
# ------------------------------------------------------------
def normalize_Technologies(skill_block):
    if not skill_block:
        return []
    # split on common separators and preserve original casing (don't title-case)
    separators = r"[,\n;/\|\u2022•·\-\–\—]"
    items = [i.strip() for i in re.split(separators, skill_block) if i and i.strip()]

    # dedupe while preserving order
    seen = set()
    technologies = []
    for it in items:
        cleaned = re.sub(r"\s{2,}", " ", it).strip()
        if len(cleaned) > 1 and cleaned.lower() not in seen:
            technologies.append(cleaned)
            seen.add(cleaned.lower())

    return technologies


# ------------------------------------------------------------
# MAIN FUNCTION
# ------------------------------------------------------------
def parse_cv_pdf(pdf_path):
    if not os.path.exists(pdf_path):
        raise FileNotFoundError("PDF file not found")

    raw_text = extract_pdf_text(pdf_path)
    if not raw_text.strip():
        return {"parsed_successfully": False}

    sections = split_into_sections(raw_text)

    # Convert blocks → structured lists
    Technologies = normalize_Technologies(sections.get("Technologies"))
    experience = clean_list_block(sections.get("experience"))
    projects = clean_list_block(sections.get("projects"))
    certifications = clean_list_block(sections.get("certifications"))

    output = {
        "parsed_successfully": True,
        "Technologies": Technologies,
        "experience": experience,
        "projects": projects,
        "certifications": certifications
    }

    # ------------------------------------------------------------
    # SAVE AS JSON next to PDF
    # ------------------------------------------------------------
    json_name = pdf_path.replace(".pdf", ".json")
    with open(json_name, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    return output


# ------------------------------------------------------------
# TESTING HOOK (run independently)
# ------------------------------------------------------------
if __name__ == "__main__":
    file = input("Enter PDF path: ").strip()
    result = parse_cv_pdf(file)
    print("\nEXTRACTED DATA:\n")
    print(json.dumps(result, indent=2, ensure_ascii=False))
    print("\nSaved JSON:", file.replace(".pdf", ".json"))
