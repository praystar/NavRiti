import swisseph as swe
from datetime import datetime
from geopy.geocoders import Nominatim
from timezonefinder import TimezoneFinder
import pytz

# Initialize Swiss Ephemeris
swe.set_ephe_path('/usr/share/ephe')  # Set path for ephemeris files

class KundaliGenerator:
    def __init__(self):
        self.nakshatras = [
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
            "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
            "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
            "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
            "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
        ]
        
        self.rashis = [
            "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
            "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
        ]
        
        self.planets = {
            swe.SUN: "Sun",
            swe.MOON: "Moon",
            swe.MERCURY: "Mercury",
            swe.VENUS: "Venus",
            swe.MARS: "Mars",
            swe.JUPITER: "Jupiter",
            swe.SATURN: "Saturn",
            swe.TRUE_NODE: "Rahu",
            swe.MEAN_NODE: "Ketu"
        }
        
        # Nakshatra occupation mapping
        self.nakshatra_occupations = {
            "Ashwini": ["Medicine", "Healing", "Veterinary", "Surgery", "Emergency Services", "Racing", "Transportation"],
            "Bharani": ["Arts", "Entertainment", "Fashion", "Law", "Justice", "Agriculture", "Food Industry"],
            "Krittika": ["Military", "Chef", "Metallurgy", "Crafts", "Teaching", "Criticism", "Debate"],
            "Rohini": ["Agriculture", "Arts", "Fashion", "Beauty", "Luxury Goods", "Banking", "Real Estate"],
            "Mrigashira": ["Research", "Travel", "Sales", "Marketing", "Exploration", "Writing", "Teaching"],
            "Ardra": ["Technology", "Science", "Research", "Pharmaceuticals", "Psychology", "Social Work"],
            "Punarvasu": ["Architecture", "Construction", "Restoration", "Writing", "Philosophy", "Teaching", "Real Estate"],
            "Pushya": ["Counseling", "Teaching", "Nursing", "Priesthood", "Social Services", "Nutrition"],
            "Ashlesha": ["Medicine", "Occult Sciences", "Psychology", "Investigation", "Politics", "Diplomacy"],
            "Magha": ["Administration", "Government", "Management", "Archaeology", "History", "Royal Services"],
            "Purva Phalguni": ["Entertainment", "Arts", "Music", "Wedding Industry", "Hospitality", "Luxury Services"],
            "Uttara Phalguni": ["Social Work", "Administration", "Banking", "Contracts", "Partnerships", "Management"],
            "Hasta": ["Crafts", "Handwork", "Healing", "Astrology", "Fine Arts", "Consultancy", "Trading"],
            "Chitra": ["Architecture", "Design", "Fashion", "Jewelry", "Photography", "Engineering", "Media"],
            "Swati": ["Business", "Trade", "Aviation", "Law", "Diplomacy", "Sales", "Public Relations"],
            "Vishakha": ["Politics", "Public Speaking", "Law", "Business", "Research", "Goal-oriented professions"],
            "Anuradha": ["Organization", "Administration", "Friendship-based business", "Mathematics", "Numerology"],
            "Jyeshtha": ["Administration", "Military", "Police", "Investigation", "Occult", "Engineering"],
            "Mula": ["Research", "Philosophy", "Herbalism", "Medicine", "Investigation", "Spirituality"],
            "Purva Ashadha": ["Writing", "Publishing", "Law", "Philosophy", "Education", "Public Relations"],
            "Uttara Ashadha": ["Government", "Administration", "Law", "Military", "Construction", "Athletics"],
            "Shravana": ["Music", "Teaching", "Communication", "Media", "Counseling", "Languages", "Publishing"],
            "Dhanishta": ["Music", "Dance", "Real Estate", "Property", "Instruments", "Rhythm-based arts"],
            "Shatabhisha": ["Medicine", "Healing", "Research", "Astronomy", "Astrology", "Unconventional healing"],
            "Purva Bhadrapada": ["Occult", "Astrology", "Finance", "Funeral Services", "Mysticism", "Research"],
            "Uttara Bhadrapada": ["Charity", "Spirituality", "Writing", "Teaching", "Counseling", "Social Work"],
            "Revati": ["Travel", "Navigation", "Import/Export", "Arts", "Music", "Social Services", "Animal Care"]
        }
        
        # House occupation mapping
        self.house_occupations = {
            1: "Self-employment, leadership roles, entrepreneurship, personal brand",
            2: "Finance, banking, food industry, speech-related work, wealth management",
            3: "Communication, media, writing, sales, siblings business, short travels",
            4: "Real estate, vehicles, teaching, emotional counseling, homeland security",
            5: "Education, speculation, stock market, entertainment, children-related fields",
            6: "Healthcare, service industry, legal services, problem-solving, pets/animals",
            7: "Partnerships, marriage counseling, business partnerships, foreign trade",
            8: "Research, occult, insurance, inheritance, transformation-based work",
            9: "Higher education, law, philosophy, religion, publishing, foreign lands",
            10: "Career, government jobs, authority positions, father's profession, reputation",
            11: "Network marketing, social media, large organizations, gains through friends",
            12: "Foreign lands, spirituality, hospitals, isolation work, charity, expenditure"
        }
        # Natural planetary friendships
        self.grah_friends = {
            "Sun": ["Moon", "Mars", "Jupiter"],
            "Moon": ["Sun", "Mercury"],
            "Mars": ["Sun", "Moon", "Jupiter"],
            "Mercury": ["Sun", "Venus"],
            "Jupiter": ["Sun", "Moon", "Mars"],
            "Venus": ["Mercury", "Saturn"],
            "Saturn": ["Mercury", "Venus"],
            "Rahu": ["Venus", "Saturn"],
            "Ketu": ["Mars", "Jupiter"]
        }
        self.salary_ranges = {
            "Technology": "₹8–30 LPA",
            "Medicine": "₹10–50 LPA",
            "Research": "₹6–25 LPA",
            "Business": "₹6–40 LPA",
            "Arts": "₹4–20 LPA",
            "Government": "₹6–25 LPA",
            "Education": "₹4–15 LPA",
            "Law": "₹6–30 LPA"
        }
        self.trait_career_map = {
            "technical": ["Technology", "Engineering", "Software", "Research"],
            "analytical": ["Research", "Data", "Finance", "Analytics"],
            "creative": ["Arts", "Design", "Media", "Fashion"],
            "communication": ["Teaching", "Law", "Media", "Counseling"],
            "leadership": ["Management", "Administration", "Government"],
            "healing": ["Medicine", "Psychology", "Social Work"],
            "business": ["Business", "Entrepreneurship", "Sales", "Finance"]
        }

    
    def get_coordinates(self, place_name):
        """Get latitude and longitude for a place"""
        geolocator = Nominatim(user_agent="kundali_generator")
        location = geolocator.geocode(place_name)
        if location:
            return location.latitude, location.longitude
        return None, None
    
    def get_timezone(self, lat, lon):
        """Get timezone for coordinates"""
        tf = TimezoneFinder()
        return tf.timezone_at(lat=lat, lng=lon)
    
    def calculate_julian_day(self, dt, lat, lon):
        """Convert datetime to Julian Day Number"""
        year, month, day = dt.year, dt.month, dt.day
        hour = dt.hour + dt.minute/60.0 + dt.second/3600.0
        
        jd = swe.julday(year, month, day, hour)
        return jd
    
    def get_ayanamsa(self, jd):
        """Get ayanamsa (precession correction) for Vedic astrology"""
        swe.set_sid_mode(swe.SIDM_LAHIRI)  # Lahiri ayanamsa
        return swe.get_ayanamsa(jd)
    
    def calculate_planet_position(self, planet_id, jd):
        """Calculate planet position"""
        result = swe.calc_ut(jd, planet_id)
        longitude = result[0][0]
        return longitude
    
    def get_nakshatra(self, longitude):
        """Get nakshatra from longitude"""
        nakshatra_num = int(longitude * 27 / 360)
        pada = int((longitude * 27 / 360 - nakshatra_num) * 4) + 1
        return self.nakshatras[nakshatra_num], pada
    
    def get_rashi(self, longitude):
        """Get rashi (zodiac sign) from longitude"""
        rashi_num = int(longitude / 30)
        degree_in_rashi = longitude % 30
        return self.rashis[rashi_num], degree_in_rashi
    
    def get_house_lord(self, rashi):
        lords = {
            "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury",
            "Cancer": "Moon", "Leo": "Sun", "Virgo": "Mercury",
            "Libra": "Venus", "Scorpio": "Mars",
            "Sagittarius": "Jupiter", "Capricorn": "Saturn",
            "Aquarius": "Saturn", "Pisces": "Jupiter"
        }
        return lords.get(rashi)
    def calculate_planet_strength(self, planet, rashi, house):
        """
        Simple but meaningful planet strength (0–100)
        """
        strength = 50
        factors = []

        # Kendra & Trikona houses
        if house in [1, 4, 7, 10]:
            strength += 15
            factors.append("Kendra placement")
        elif house in [5, 9]:
            strength += 12
            factors.append("Trikona placement")
        elif house in [6, 8, 12]:
            strength -= 10
            factors.append("Dusthana placement")

        # Natural friendships
        lord = self.get_house_lord(rashi)
        if lord and planet in self.grah_friends.get(lord, []):
            strength += 10
            factors.append(f"Friendly sign lord ({lord})")

        return {
            "score": max(0, min(100, strength)),
            "factors": factors
        }

    def calculate_ascendant(self, jd, lat, lon):
        """Calculate ascendant (Lagna)"""
        houses = swe.houses(jd, lat, lon, b'P')  # Placidus house system
        ascendant = houses[0][0]
        return ascendant
    
    def calculate_houses(self, jd, lat, lon):
        """Calculate all 12 houses"""
        houses = swe.houses(jd, lat, lon, b'P')
        return houses[0]
    
    def get_house_for_planet(self, planet_longitude, house_cusps):
        """Determine which house a planet is in"""
        for i in range(12):
            current_cusp = house_cusps[i]
            next_cusp = house_cusps[(i + 1) % 12]
            
            if next_cusp > current_cusp:
                if current_cusp <= planet_longitude < next_cusp:
                    return i + 1
            else:  # Wraps around 360 degrees
                if planet_longitude >= current_cusp or planet_longitude < next_cusp:
                    return i + 1
        return 1
    
    def analyze_career_potential(self, planets_data, houses_sidereal, asc_nakshatra, personality_traits):
        """Analyze career potential based on nakshatras and house placements"""
        career_analysis = {
            "primary_suggestions": [],
            "moon_based": [],
            "ascendant_based": [],
            "sun_based": [],
            "10th_house_influences": [],
            "detailed_analysis": []
        }
        
        # Moon nakshatra (primary career indicator)
        moon_nakshatra = planets_data["Moon"]["nakshatra"]
        career_analysis["moon_based"] = self.nakshatra_occupations.get(moon_nakshatra, [])
        
        # Ascendant nakshatra
        career_analysis["ascendant_based"] = self.nakshatra_occupations.get(asc_nakshatra, [])
        
        # Sun nakshatra (soul purpose)
        sun_nakshatra = planets_data["Sun"]["nakshatra"]
        career_analysis["sun_based"] = self.nakshatra_occupations.get(sun_nakshatra, [])
        
        # Analyze each planet's house position and nakshatra
        for planet, data in planets_data.items():
            house = self.get_house_for_planet(data["longitude"], houses_sidereal)
            nakshatra = data["nakshatra"]
            strength_data = self.calculate_planet_strength(
                planet,
                data["rashi"],
                house
            )
            analysis_entry = {
                "planet": planet,
                "house": house,
                "rashi": data["rashi"],
                "nakshatra": nakshatra,
                "planet_strength": strength_data,   # 👈 ADD HERE
                "house_signification": self.house_occupations.get(house, ""),
                "career_domains": self.nakshatra_occupations.get(nakshatra, [])
            }

            career_analysis["detailed_analysis"].append(analysis_entry)
            
            # Special emphasis on 10th house (career house)
            if house == 10:
                career_analysis["10th_house_influences"].append({
                    "planet": planet,
                    "nakshatra": nakshatra,
                    "suggested_fields": self.nakshatra_occupations.get(nakshatra, [])
                })
        
        # Compile primary suggestions (weighted combination)
        primary_set = set()
        
        # Moon nakshatra has highest weight (40%)
        for career in career_analysis["moon_based"][:4]:
            primary_set.add(career)
        
        # Ascendant nakshatra (30%)
        for career in career_analysis["ascendant_based"][:3]:
            primary_set.add(career)
        
        # 10th house planets (20%)
        for influence in career_analysis["10th_house_influences"]:
            for career in influence["suggested_fields"][:2]:
                primary_set.add(career)
        
        # Sun nakshatra (10%)
        for career in career_analysis["sun_based"][:2]:
            primary_set.add(career)
        career_analysis["primary_suggestions"] = list(primary_set)

                # --------------------------------------------------
        # PERSONALITY TRAIT IMPACT ON CAREER DOMAINS
        # --------------------------------------------------
        trait_weighted_scores = {}

        # Start with astrology-based suggestions
        for career in career_analysis["primary_suggestions"]:
            trait_weighted_scores[career] = 1.0   # base astro score

        # Apply personality boosts
        for trait, rating in personality_traits.items():
            if rating >= 6:  # meaningful inclination
                related_domains = self.trait_career_map.get(trait, [])
                for domain in related_domains:
                    for career in trait_weighted_scores:
                        if domain.lower() in career.lower():
                            trait_weighted_scores[career] += rating / 10

        # Re-rank careers after trait impact
        career_analysis["final_ranked_domains"] = sorted(
            trait_weighted_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )

        
        #career_analysis["primary_suggestions"] = list(primary_set)
        
        return career_analysis
    
    def generate_kundali(self, birth_date, birth_time, birth_place):
        """Generate complete kundali"""
        personality_traits = {}

        try:
            # Get coordinates
            lat, lon = self.get_coordinates(birth_place)
            if lat is None or lon is None:
                return {"error": "Could not find location"}
            
            # Get timezone and create datetime
            tz_name = self.get_timezone(lat, lon)
            tz = pytz.timezone(tz_name)
            
            # Parse input
            dt_str = f"{birth_date} {birth_time}"
            dt_naive = datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
            dt_local = tz.localize(dt_naive)
            dt_utc = dt_local.astimezone(pytz.UTC)
            
            # Calculate Julian Day
            jd = self.calculate_julian_day(dt_utc, lat, lon)
            
            # Get ayanamsa
            ayanamsa = self.get_ayanamsa(jd)
            
            # Calculate ascendant
            asc_tropical = self.calculate_ascendant(jd, lat, lon)
            asc_sidereal = (asc_tropical - ayanamsa) % 360
            
            # Calculate houses
            houses_tropical = self.calculate_houses(jd, lat, lon)
            houses_sidereal = [(h - ayanamsa) % 360 for h in houses_tropical]
            
            # Calculate planets
            planets_data = {}
            for planet_id, planet_name in self.planets.items():
                if planet_name == "Ketu":
                    # Ketu is 180 degrees opposite to Rahu
                    rahu_pos = planets_data["Rahu"]["longitude"]
                    longitude_tropical = (rahu_pos + 180) % 360
                else:
                    longitude_tropical = self.calculate_planet_position(planet_id, jd)
                
                longitude_sidereal = (longitude_tropical - ayanamsa) % 360
                nakshatra, pada = self.get_nakshatra(longitude_sidereal)
                rashi, degree = self.get_rashi(longitude_sidereal)
                
                planets_data[planet_name] = {
                    "longitude": longitude_sidereal,
                    "rashi": rashi,
                    "degree": f"{degree:.2f}°",
                    "nakshatra": nakshatra,
                    "pada": pada
                }
            
            # Get ascendant nakshatra
            asc_nakshatra, asc_pada = self.get_nakshatra(asc_sidereal)
            personality_traits = self.get_personality_traits()

            # Analyze career potential
            career_analysis = self.analyze_career_potential(
                planets_data, 
                houses_sidereal, 
                asc_nakshatra,
                personality_traits
            )
            
            # Prepare result
            result = {
                "birth_details": {
                    "date": birth_date,
                    "time": birth_time,
                    "place": birth_place,
                    "latitude": f"{lat:.4f}",
                    "longitude": f"{lon:.4f}",
                    "timezone": tz_name
                },
                "ayanamsa": f"{ayanamsa:.2f}°",
                "ascendant": {
                    "longitude": asc_sidereal,
                    "rashi": self.get_rashi(asc_sidereal)[0],
                    "degree": f"{self.get_rashi(asc_sidereal)[1]:.2f}°",
                    "nakshatra": asc_nakshatra,
                    "pada": asc_pada
                },
                "houses": [
                    {
                        "house": i+1,
                        "cusp": f"{h:.2f}°",
                        "rashi": self.get_rashi(h)[0]
                    } for i, h in enumerate(houses_sidereal)
                ],
                "planets": planets_data,
                "personality_traits": personality_traits   
            }
            
            # ---- PERSONALITY TRAITS INPUT ----

            # Add career analysis to result
            result["career_analysis"] = career_analysis
            final_recommendations = []

            for career, score in career_analysis["final_ranked_domains"]:

                salary = "₹4–12 LPA"
                for domain, sal in self.salary_ranges.items():
                    if domain.lower() in career.lower():
                        salary = sal

                final_recommendations.append({
                    "career_domain": career,
                    "estimated_salary_range": salary
                })

            result["final_recommendations"] = final_recommendations

            return result
            
        except Exception as e:
            return {"error": str(e)}
    def get_personality_traits(self):
        """
        Personality traits on 1–10 scale
        """
        print("\nRate yourself on scale 1–10")

        traits = {}
        questions = {
            "creative": "Creativity (arts/design)?",
            "analytical": "Analytical thinking (logic/data)?",
            "technical": "Technical/engineering inclination?",
            "leadership": "Leadership/management?",
            "communication": "Communication (speaking/writing)?",
            "healing": "Healing/helping others?",
            "business": "Business/entrepreneurial mindset?"
        }

        for trait, q in questions.items():
            while True:
                try:
                    val = int(input(f"{q}: "))
                    if 1 <= val <= 10:
                        traits[trait] = val
                        break
                except:
                    pass

        return traits

    def print_kundali(self, kundali):
        """Print kundali in readable format"""
        if "error" in kundali:
            print(f"Error: {kundali['error']}")
            return
        
        print("\n" + "="*70)
        print("VEDIC ASTROLOGY KUNDALI (जन्म कुंडली)")
        print("="*70)
        
        print("\n📍 BIRTH DETAILS:")
        bd = kundali["birth_details"]
        print(f"   Date: {bd['date']}")
        print(f"   Time: {bd['time']}")
        print(f"   Place: {bd['place']}")
        print(f"   Coordinates: {bd['latitude']}, {bd['longitude']}")
        print(f"   Timezone: {bd['timezone']}")
        print(f"   Ayanamsa (Lahiri): {kundali['ayanamsa']}")
        
        print("\n🌅 ASCENDANT (LAGNA):")
        asc = kundali["ascendant"]
        print(f"   Rashi: {asc['rashi']}")
        print(f"   Degree: {asc['degree']}")
        print(f"   Nakshatra: {asc['nakshatra']} (Pada {asc['pada']})")
        
        print("\n🏠 HOUSE CUSPS:")
        for house in kundali["houses"]:
            print(f"   House {house['house']:2d}: {house['rashi']:12s} - {house['cusp']}")
        
        print("\n🪐 PLANETARY POSITIONS:")
        for planet, data in kundali["planets"].items():
            print(f"   {planet:10s}: {data['rashi']:12s} {data['degree']:8s} - {data['nakshatra']:18s} (Pada {data['pada']})")
        
        print("\n" + "="*70)
        print("💼 CAREER ANALYSIS BASED ON NAKSHATRAS & HOUSES")
        print("="*70)
        
        career = kundali["career_analysis"]
        
        print("\n🎯 PRIMARY CAREER SUGGESTIONS:")
        print("   (Based on综合分析 of Moon, Ascendant, Sun & 10th House)")
        for i, suggestion in enumerate(career["primary_suggestions"], 1):
            print(f"   {i}. {suggestion}")
        
        print("\n🌙 MOON NAKSHATRA BASED CAREERS:")
        print(f"   (Moon is primary indicator - emotional fulfillment)")
        for career_option in career["moon_based"]:
            print(f"   • {career_option}")
        
        print("\n🌅 ASCENDANT NAKSHATRA BASED CAREERS:")
        print(f"   (Natural inclinations and personality)")
        for career_option in career["ascendant_based"]:
            print(f"   • {career_option}")
        
        print("\n☀️ SUN NAKSHATRA BASED CAREERS:")
        print(f"   (Soul purpose and authority)")
        for career_option in career["sun_based"]:
            print(f"   • {career_option}")
        
        if career["10th_house_influences"]:
            print("\n🏢 10TH HOUSE (CAREER HOUSE) INFLUENCES:")
            for influence in career["10th_house_influences"]:
                print(f"   Planet: {influence['planet']} in {influence['nakshatra']}")
                print(f"   Suggested fields:")
                for field in influence["suggested_fields"]:
                    print(f"      • {field}")
        
        print("\n📊 DETAILED PLANETARY ANALYSIS:")
        for analysis in career["detailed_analysis"]:
            print(f"\n   {analysis['planet']} in House {analysis['house']} ({analysis['nakshatra']})")
            print(f"   House Signification: {analysis['house_signification']}")

            # Planet strength
            strength = analysis.get("planet_strength", {})
            if strength:
                print(f"   Planet Strength: {strength.get('score', 0)}/100")
                for factor in strength.get("factors", []):
                    print(f"      • {factor}")

            # Career domains (renamed from nakshatra_careers)
            domains = analysis.get("career_domains", [])
            if domains:
                print(f"   Career Domains Indicated: {', '.join(domains[:3])}")



# Example usage
if __name__ == "__main__":
    generator = KundaliGenerator()

    print("\n" + "="*70)
    print("VEDIC ASTROLOGY – STUDENT CENTRIC CAREER PREDICTION")
    print("="*70)

    # ---- BASIC INPUT ----
    birth_date = input("Enter birth date (YYYY-MM-DD): ")
    birth_time = input("Enter birth time (HH:MM in 24-hour format): ")
    birth_place = input("Enter birth place: ")

    # ---- GENERATE KUNDALI ----
    kundali = generator.generate_kundali(
        birth_date=birth_date,
        birth_time=birth_time,
        birth_place=birth_place
    )

    if "error" in kundali:
        print(f"\n❌ Error: {kundali['error']}")
        exit()

    # ---- PRINT ASTRO DETAILS ----
    generator.print_kundali(kundali)

    # ---- PRINT PERSONALITY TRAITS ----
    print("\n" + "="*60)
    print("🧠 PERSONALITY TRAITS (User Input)")
    print("="*60)
    for trait, score in kundali["personality_traits"].items():
        print(f"   {trait.capitalize():15s}: {score}/10")

    # ---- FINAL CAREER DOMAINS + SALARY ----
    print("\n" + "="*60)
    print("🎯 FINAL CAREER DOMAIN PREDICTIONS")
    print("="*60)

    for idx, rec in enumerate(kundali["final_recommendations"], 1):
        print(f"{idx}. {rec['career_domain']}")
        print(f"   💰 Estimated Salary Range: {rec['estimated_salary_range']}")

    # ---- OPTIONAL: SAVE JSON OUTPUT ----
    save = input("\nDo you want to save result as JSON? (y/n): ").lower()
    if save == "y":
        filename = f"kundali_career_{birth_date}_{birth_time.replace(':', '-')}.json"
        with open(filename, "w", encoding="utf-8") as f:
            import json
            json.dump(kundali, f, indent=2, ensure_ascii=False)
        print(f"✅ File saved: {filename}")
