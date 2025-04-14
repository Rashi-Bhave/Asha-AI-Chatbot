/**
 * Service for detecting and mitigating gender bias in user queries and AI responses
 */

// List of potentially gender-biased terms and their neutral alternatives
const BIASED_TERMS = [
    {
      biased: ['chairman', 'chairmen'],
      neutral: 'chairperson'
    },
    {
      biased: ['businessman', 'businessmen'],
      neutral: 'business professional'
    },
    {
      biased: ['fireman', 'firemen'],
      neutral: 'firefighter'
    },
    {
      biased: ['policeman', 'policemen'],
      neutral: 'police officer'
    },
    {
      biased: ['mailman', 'mailmen'],
      neutral: 'mail carrier'
    },
    {
      biased: ['stewardess'],
      neutral: 'flight attendant'
    },
    {
      biased: ['manpower'],
      neutral: 'workforce'
    },
    {
      biased: ['mankind'],
      neutral: 'humanity'
    },
    {
      biased: ['manned'],
      neutral: 'staffed'
    },
    {
      biased: ['workman', 'workmen'],
      neutral: 'worker'
    },
    {
      biased: ['salesman', 'salesmen'],
      neutral: 'salesperson'
    },
    {
      biased: ['man hours'],
      neutral: 'work hours'
    },
    {
      biased: ['cameraman', 'cameramen'],
      neutral: 'camera operator'
    },
    {
      biased: ['spokesman', 'spokesmen'],
      neutral: 'spokesperson'
    },
    {
      biased: ['housewife', 'housewives'],
      neutral: 'homemaker'
    }
  ];
  
  // Common phrases that might contain implicit bias
  const BIASED_PHRASES = [
    {
      phrase: 'men in the workplace',
      neutral: 'people in the workplace'
    },
    {
      phrase: 'girls in the office',
      neutral: 'employees in the office'
    },
    {
      phrase: 'he will be the one to',
      neutral: 'they will be the one to'
    },
    {
      phrase: 'women are better at',
      neutral: 'some people are better at'
    },
    {
      phrase: 'men are better at',
      neutral: 'some people are better at'
    },
    {
      phrase: 'female-dominated profession',
      neutral: 'profession with many women'
    },
    {
      phrase: 'male-dominated profession',
      neutral: 'profession with many men'
    }
  ];
  
  // Stereotypical assumptions that might appear in queries
  const STEREOTYPICAL_ASSUMPTIONS = [
    {
      pattern: /women.*cook/i,
      isBiased: true
    },
    {
      pattern: /women.*nurtur/i,
      isBiased: true
    },
    {
      pattern: /men.*leadership/i,
      isBiased: true
    },
    {
      pattern: /men.*technical/i,
      isBiased: true
    },
    {
      pattern: /women.*emotional/i,
      isBiased: true
    },
    {
      pattern: /men.*rational/i,
      isBiased: true
    },
    {
      pattern: /women.*soft skills/i,
      isBiased: true
    },
    {
      pattern: /men.*hard skills/i,
      isBiased: true
    }
  ];
  
  /**
   * Detects potential gender bias in text
   * 
   * @param {string} text - Input text to analyze
   * @returns {Object} - Results including bias detection and corrected text
   */
  export const detectBias = async (text) => {
    if (!text) return { hasBias: false, correctedText: text };
    
    let hasBias = false;
    let correctedText = text;
    const biasDetails = [];
    
    // Check for biased terms
    BIASED_TERMS.forEach(termSet => {
      termSet.biased.forEach(biasedTerm => {
        // Create regex to match the biased term as a whole word
        const regex = new RegExp(`\\b${biasedTerm}\\b`, 'gi');
        
        if (regex.test(correctedText)) {
          hasBias = true;
          correctedText = correctedText.replace(regex, termSet.neutral);
          biasDetails.push({
            type: 'biased_term',
            biased: biasedTerm,
            neutral: termSet.neutral
          });
        }
      });
    });
    
    // Check for biased phrases
    BIASED_PHRASES.forEach(item => {
      // Create case-insensitive regex
      const regex = new RegExp(item.phrase, 'gi');
      
      if (regex.test(correctedText)) {
        hasBias = true;
        correctedText = correctedText.replace(regex, item.neutral);
        biasDetails.push({
          type: 'biased_phrase',
          biased: item.phrase,
          neutral: item.neutral
        });
      }
    });
    
    // Check for stereotypical assumptions
    STEREOTYPICAL_ASSUMPTIONS.forEach(item => {
      if (item.pattern.test(correctedText)) {
        hasBias = true;
        biasDetails.push({
          type: 'stereotypical_assumption',
          pattern: item.pattern.toString()
        });
        // We don't correct these automatically as they require more context
      }
    });
    
    return {
      hasBias,
      correctedText,
      biasDetails: biasDetails.length > 0 ? biasDetails : null
    };
  };
  
  /**
   * Analyzes AI response for potential bias before sending to user
   * 
   * @param {string} response - AI-generated response
   * @returns {Object} - Results including bias detection and corrected response
   */
  export const analyzeResponseForBias = async (response) => {
    const result = await detectBias(response);
    
    if (result.hasBias) {
      console.log('Bias detected in AI response:', result.biasDetails);
    }
    
    return result;
  };
  
  /**
   * Generates bias mitigation instructions for the AI model
   * 
   * @param {string} query - User's original query
   * @param {Array} biasDetails - Details of detected bias
   * @returns {string} - Instructions for the AI model
   */
  export const generateBiasMitigationInstructions = (query, biasDetails) => {
    if (!biasDetails || biasDetails.length === 0) {
      return '';
    }
    
    let instructions = 'Note: The user query contains potentially biased language. Please ensure your response:';
    instructions += '\n- Uses gender-neutral language';
    instructions += '\n- Avoids reinforcing gender stereotypes';
    instructions += '\n- Focuses on skills, qualifications, and experiences rather than gender';
    instructions += '\n- Provides balanced information applicable to all genders';
    
    return instructions;
  };