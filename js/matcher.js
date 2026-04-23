/**
 * Scheme Matching Engine
 * Matches user profile against scheme eligibility criteria
 */

class SchemeMatcher {
  constructor(schemesData) {
    this.schemes = schemesData.schemes || schemesData;
  }

  /**
   * Match user profile against all schemes
   * @param {Object} profile - User profile
   * @returns {Array} - Matched schemes sorted by relevance
   */
  match(profile) {
    const normalizedProfile = this.normalizeProfile(profile);
    const results = [];

    for (const scheme of this.schemes) {
      const score = this.calculateScore(normalizedProfile, scheme);
      if (score > 0) {
        results.push({
          ...scheme,
          matchScore: score,
          matchReasons: this.getMatchReasons(normalizedProfile, scheme)
        });
      }
    }

    // Sort by score (highest first), then by benefit amount
    results.sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return b.benefitAmount - a.benefitAmount;
    });

    return results;
  }

  /**
   * Normalize user profile for matching
   */
  normalizeProfile(profile) {
    return {
      age: parseInt(profile.age) || 0,
      gender: (profile.gender || 'all').toLowerCase(),
      state: (profile.state || '').toLowerCase().trim(),
      income: parseInt(profile.income) || 0,
      occupation: (profile.occupation || '').toLowerCase().trim(),
      category: (profile.category || 'general').toLowerCase().trim(),
      isStudent: profile.isStudent === true || profile.isStudent === 'true',
      hasLand: profile.hasLand === true || profile.hasLand === 'true',
      hasHouse: profile.hasHouse === true || profile.hasHouse === 'true',
      isRural: profile.isRural === true || profile.isRural === 'true',
      isBPL: profile.isBPL === true || profile.isBPL === 'true',
      isGirlChild: profile.isGirlChild === true || profile.isGirlChild === 'true',
      hasRationCard: profile.hasRationCard === true || profile.hasRationCard === 'true'
    };
  }

  /**
   * Calculate match score (0-100)
   */
  calculateScore(profile, scheme) {
    let score = 0;
    const elig = scheme.eligibility;

    if (!elig) return 0;

    // Check hard constraints (fail = 0 score)
    if (!this.checkAge(profile.age, elig)) return 0;
    if (!this.checkGender(profile.gender, elig)) return 0;
    if (!this.checkIncome(profile.income, elig)) return 0;
    if (!this.checkCategory(profile.category, elig)) return 0;
    if (!this.checkOccupation(profile.occupation, elig)) return 0;

    // Soft scoring (higher = better match)
    score += this.scoreAge(profile.age, elig);
    score += this.scoreIncome(profile.income, elig);
    score += this.scoreOccupation(profile.occupation, elig);
    score += this.scoreSpecialConditions(profile, elig);

    // Bonus for popular schemes
    if (scheme.isPopular) score += 10;

    // Bonus for higher benefit amount
    if (scheme.benefitAmount >= 100000) score += 15;
    else if (scheme.benefitAmount >= 50000) score += 10;
    else if (scheme.benefitAmount >= 10000) score += 5;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Hard constraint checks (must pass all)
   */
  checkAge(age, elig) {
    if (elig.minAge && age < elig.minAge) return false;
    if (elig.maxAge && age > elig.maxAge) return false;
    return true;
  }

  checkGender(gender, elig) {
    if (!elig.gender || elig.gender === 'all') return true;
    if (gender === elig.gender) return true;
    // For girl child specific schemes
    if (elig.isGirlChild && gender === 'female') return true;
    return false;
  }

  checkIncome(income, elig) {
    if (!elig.maxIncome) return true; // No income limit
    return income <= elig.maxIncome;
  }

  checkCategory(category, elig) {
    if (!elig.category || elig.category.includes('all')) return true;
    return elig.category.includes(category);
  }

  checkOccupation(occupation, elig) {
    if (!elig.occupation || elig.occupation.includes('all')) return true;
    return elig.occupation.includes(occupation) || elig.occupation.includes('all');
  }

  /**
   * Soft scoring functions
   */
  scoreAge(age, elig) {
    if (!elig.minAge && !elig.maxAge) return 5;
    const min = elig.minAge || 0;
    const max = elig.maxAge || 100;
    const mid = (min + max) / 2;
    const range = (max - min) / 2;
    if (range === 0) return 10;
    const distance = Math.abs(age - mid) / range;
    return Math.round(15 * (1 - distance));
  }

  scoreIncome(income, elig) {
    if (!elig.maxIncome) return 5;
    const ratio = income / elig.maxIncome;
    if (ratio <= 0.5) return 20;
    if (ratio <= 0.75) return 15;
    if (ratio <= 1.0) return 10;
    return 0;
  }

  scoreOccupation(occupation, elig) {
    if (!elig.occupation || elig.occupation.includes('all')) return 5;
    if (elig.occupation.includes(occupation)) return 20;
    return 0;
  }

  scoreSpecialConditions(profile, elig) {
    let score = 0;
    if (elig.hasLand && profile.hasLand) score += 10;
    if (elig.hasNoHouse && !profile.hasHouse) score += 10;
    if (elig.isRural && profile.isRural) score += 10;
    if (elig.isBPL && profile.isBPL) score += 10;
    if (elig.isGirlChild && profile.isGirlChild) score += 15;
    if (elig.hasRationCard && profile.hasRationCard) score += 10;
    if (elig.isStudent && profile.isStudent) score += 10;
    return score;
  }

  /**
   * Get human-readable match reasons
   */
  getMatchReasons(profile, scheme) {
    const reasons = [];
    const elig = scheme.eligibility;

    if (elig.maxIncome && profile.income <= elig.maxIncome) {
      reasons.push(`Income ₹${profile.income.toLocaleString()} is within ₹${elig.maxIncome.toLocaleString()} limit`);
    }
    if (elig.occupation && elig.occupation.includes(profile.occupation)) {
      reasons.push(`Occupation matches: ${this.formatOccupation(profile.occupation)}`);
    }
    if (elig.category && elig.category.includes(profile.category)) {
      reasons.push(`Category ${profile.category.toUpperCase()} is eligible`);
    }
    if (elig.isStudent && profile.isStudent) {
      reasons.push('Student status qualifies');
    }
    if (elig.hasLand && profile.hasLand) {
      reasons.push('Land ownership qualifies');
    }
    if (elig.isRural && profile.isRural) {
      reasons.push('Rural residence qualifies');
    }

    return reasons;
  }

  formatOccupation(occ) {
    const map = {
      'farmer': 'Farmer',
      'student': 'Student',
      'business_owner': 'Business Owner',
      'self_employed': 'Self Employed',
      'salaried': 'Salaried',
      'unemployed': 'Unemployed',
      'daily_wage': 'Daily Wage Worker',
      'freelancer': 'Freelancer',
      'agricultural_worker': 'Agricultural Worker',
      'street_vendor': 'Street Vendor',
      'homemaker': 'Homemaker',
      'retired': 'Retired'
    };
    return map[occ] || occ;
  }

  /**
   * Get scheme by ID
   */
  getSchemeById(id) {
    return this.schemes.find(s => s.id === id);
  }

  /**
   * Get total potential benefit amount
   */
  getTotalBenefit(matchedSchemes) {
    return matchedSchemes.reduce((sum, s) => sum + (s.benefitAmount || 0), 0);
  }
}

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SchemeMatcher;
}
if (typeof window !== 'undefined') {
  window.SchemeMatcher = SchemeMatcher;
}
