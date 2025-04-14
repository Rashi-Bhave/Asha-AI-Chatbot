/**
 * Natural Language Processing service for understanding user messages
 */

// Intent categories and their associated keywords
const INTENT_CATEGORIES = {
    job_search: [
      'job', 'career', 'work', 'employment', 'position', 'vacancy', 'opening',
      'hire', 'hiring', 'apply', 'application', 'resume', 'cv', 'interview',
      'salary', 'remote', 'wfh', 'hybrid', 'full-time', 'part-time', 'contract',
      'opportunities', 'job listing', 'job posting', 'recruiter'
    ],
    
    event_info: [
      'event', 'webinar', 'workshop', 'seminar', 'conference', 'meetup',
      'networking', 'session', 'talk', 'panel', 'discussion', 'presentation',
      'summit', 'training', 'program', 'schedule', 'agenda', 'calendar',
      'upcoming', 'register', 'registration', 'attend', 'join'
    ],
    
    mentorship: [
      'mentor', 'mentorship', 'mentoring', 'mentee', 'guidance', 'advise',
      'advisor', 'coach', 'coaching', 'counseling', 'career advice', 'guide',
      'support', 'development', 'growth', 'learning', 'expertise', 'experience',
      'senior', 'junior', 'professional', 'industry expert'
    ],
    
    skill_development: [
      'skill', 'skills', 'learn', 'learning', 'course', 'training', 'education',
      'certification', 'certificate', 'degree', 'qualification', 'upskill',
      'reskill', 'development', 'improve', 'enhance', 'grow', 'study',
      'knowledge', 'expertise', 'competence', 'capability', 'ability'
    ],
    
    career_advice: [
      'advice', 'suggestion', 'recommendation', 'guidance', 'help', 'tip',
      'strategy', 'plan', 'path', 'trajectory', 'direction', 'goal', 'objective',
      'aspiration', 'advancement', 'promotion', 'growth', 'development',
      'progress', 'success', 'achievement', 'balance', 'transition'
    ],
    
    company_info: [
      'company', 'organization', 'employer', 'workplace', 'business',
      'enterprise', 'firm', 'corporation', 'culture', 'values', 'mission',
      'vision', 'policy', 'policies', 'benefit', 'perk', 'review',
      'reputation', 'environment', 'diversity', 'inclusion'
    ],
    
    help: [
      'help', 'assist', 'support', 'guide', 'explain', 'show', 'tell',
      'find', 'search', 'look for', 'information', 'info', 'detail',
      'question', 'query', 'how to', 'what is', 'how do', 'can you'
    ]
  };
  
  /**
   * Analyzes user message to determine intent
   * 
   * @param {string} message - User's message text
   * @returns {string} - Detected intent category
   */
  export const analyzeIntent = async (message) => {
    if (!message) return 'help';
    
    const messageLower = message.toLowerCase();
    const scores = {};
    
    // Score each intent category based on keyword matches
    Object.entries(INTENT_CATEGORIES).forEach(([category, keywords]) => {
      scores[category] = 0;
      
      keywords.forEach(keyword => {
        if (messageLower.includes(keyword.toLowerCase())) {
          // Add score based on keyword position (higher if at beginning)
          const position = messageLower.indexOf(keyword.toLowerCase());
          const positionFactor = position < 10 ? 2 : 1;
          
          // Add score based on keyword specificity (longer keywords are more specific)
          const specificityFactor = keyword.length > 6 ? 1.5 : 1;
          
          scores[category] += 1 * positionFactor * specificityFactor;
        }
      });
    });
    
    // Add contextual logic for better intent detection
    
    // Questions about finding or searching typically indicate job search
    if (
      messageLower.includes('find') && 
      (messageLower.includes('job') || messageLower.includes('work') || messageLower.includes('career'))
    ) {
      scores.job_search += 3;
    }
    
    // Time-based questions often relate to events
    if (
      (messageLower.includes('when') || messageLower.includes('upcoming') || messageLower.includes('next')) && 
      (messageLower.includes('event') || messageLower.includes('webinar') || messageLower.includes('workshop'))
    ) {
      scores.event_info += 3;
    }
    
    // "How to" questions often indicate career advice
    if (
      messageLower.includes('how to') || 
      messageLower.includes('what should') || 
      messageLower.includes('best way')
    ) {
      scores.career_advice += 2;
    }
    
    // Questions about connecting with others often indicate mentorship interest
    if (
      (messageLower.includes('connect') || messageLower.includes('meet') || messageLower.includes('talk to')) && 
      (messageLower.includes('professional') || messageLower.includes('expert') || messageLower.includes('experienced'))
    ) {
      scores.mentorship += 3;
    }
    
    // Find the category with the highest score
    let topCategory = 'help';
    let maxScore = 0;
    
    Object.entries(scores).forEach(([category, score]) => {
      if (score > maxScore) {
        maxScore = score;
        topCategory = category;
      }
    });
    
    // If no clear intent is detected, return help
    if (maxScore === 0) {
      return 'help';
    }
    
    return topCategory;
  };
  
  /**
   * Extracts entities from user message
   * 
   * @param {string} message - User's message text
   * @returns {Object} - Extracted entities
   */
  export const extractEntities = (message) => {
    if (!message) return {};
    
    const entities = {
      skillKeywords: [],
      locationKeywords: [],
      timeKeywords: [],
      roleKeywords: [],
      industryKeywords: []
    };
    
    const messageLower = message.toLowerCase();
    
    // Extract skill keywords
    const skillKeywords = [
      'programming', 'coding', 'development', 'design', 'marketing', 'sales',
      'management', 'leadership', 'communication', 'analytics', 'research',
      'writing', 'editing', 'accounting', 'finance', 'hr', 'customer service',
      'project management', 'product management', 'data analysis', 'engineering',
      'teaching', 'training', 'social media', 'digital marketing', 'consulting'
    ];
    
    skillKeywords.forEach(skill => {
      if (messageLower.includes(skill.toLowerCase())) {
        entities.skillKeywords.push(skill);
      }
    });
    
    // Extract location keywords
    const locationKeywords = [
      'remote', 'wfh', 'work from home', 'hybrid', 'office', 'on-site', 'onsite',
      'india', 'bangalore', 'delhi', 'mumbai', 'chennai', 'hyderabad', 'pune',
      'kolkata', 'ahmedabad', 'international', 'global', 'local', 'regional'
    ];
    
    locationKeywords.forEach(location => {
      if (messageLower.includes(location.toLowerCase())) {
        entities.locationKeywords.push(location);
      }
    });
    
    // Extract time keywords
    const timeKeywords = [
      'today', 'tomorrow', 'this week', 'next week', 'weekend', 'month',
      'upcoming', 'recent', 'latest', 'new', 'current', 'future',
      'morning', 'afternoon', 'evening', 'night', 'full-time', 'part-time'
    ];
    
    timeKeywords.forEach(time => {
      if (messageLower.includes(time.toLowerCase())) {
        entities.timeKeywords.push(time);
      }
    });
    
    // Extract role keywords
    const roleKeywords = [
      'manager', 'director', 'executive', 'assistant', 'associate', 'coordinator',
      'specialist', 'analyst', 'developer', 'designer', 'engineer', 'consultant',
      'advisor', 'representative', 'officer', 'administrator', 'supervisor',
      'lead', 'head', 'chief', 'junior', 'senior', 'entry-level', 'internship'
    ];
    
    roleKeywords.forEach(role => {
      if (messageLower.includes(role.toLowerCase())) {
        entities.roleKeywords.push(role);
      }
    });
    
    // Extract industry keywords
    const industryKeywords = [
      'tech', 'technology', 'it', 'software', 'healthcare', 'medical', 'finance',
      'banking', 'education', 'teaching', 'retail', 'e-commerce', 'manufacturing',
      'construction', 'media', 'entertainment', 'hospitality', 'tourism',
      'consulting', 'legal', 'nonprofit', 'government', 'telecom', 'pharmaceutical'
    ];
    
    industryKeywords.forEach(industry => {
      if (messageLower.includes(industry.toLowerCase())) {
        entities.industryKeywords.push(industry);
      }
    });
    
    return entities;
  };
  
  /**
   * Analyzes sentiment of user message
   * 
   * @param {string} message - User's message text
   * @returns {Object} - Sentiment analysis result
   */
  export const analyzeSentiment = (message) => {
    if (!message) return { sentiment: 'neutral', score: 0 };
    
    const messageLower = message.toLowerCase();
    
    // Simple keyword-based sentiment analysis
    const positiveKeywords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
      'helpful', 'useful', 'thank', 'thanks', 'appreciate', 'like', 'love',
      'happy', 'excited', 'perfect', 'best', 'enjoy', 'pleased', 'satisfied'
    ];
    
    const negativeKeywords = [
      'bad', 'poor', 'terrible', 'awful', 'horrible', 'useless', 'unhelpful',
      'disappoint', 'disappointed', 'frustrat', 'annoy', 'hate', 'dislike',
      'worst', 'waste', 'not good', 'not useful', 'not helpful', 'confused'
    ];
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    positiveKeywords.forEach(keyword => {
      if (messageLower.includes(keyword.toLowerCase())) {
        positiveScore += 1;
      }
    });
    
    negativeKeywords.forEach(keyword => {
      if (messageLower.includes(keyword.toLowerCase())) {
        negativeScore += 1;
      }
    });
    
    const totalScore = positiveScore - negativeScore;
    
    let sentiment = 'neutral';
    if (totalScore > 0) {
      sentiment = 'positive';
    } else if (totalScore < 0) {
      sentiment = 'negative';
    }
    
    return {
      sentiment,
      score: totalScore,
      positive: positiveScore,
      negative: negativeScore
    };
  };