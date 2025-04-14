/**
 * Implementation of Retrieval-Augmented Generation (RAG) utilities
 * for contextual knowledge retrieval and AI response enhancement.
 */

// Simulated knowledge base chunks - in a real app, this would be stored in a database
// or vector store and retrieved using embeddings-based search
const KNOWLEDGE_BASE = [
    {
      "id": "kb-001",
      "topic": "careers",
      "content": "JobsForHer is dedicated to empowering women in their career journeys, offering resources and opportunities for professional growth, re-entry, and advancement.",
      "source": "JobsForHer About Page",
      "relevance": ["career", "women empowerment", "professional growth"]
    },
    {
      "id": "kb-002",
      "topic": "jobs",
      "content": "Our job portal features thousands of verified opportunities from companies committed to gender diversity. Positions range from entry-level to executive across various industries and work arrangements including full-time, part-time, remote, and flexible options.",
      "source": "JobsForHer Jobs Page",
      "relevance": ["jobs", "employment", "work opportunities", "remote work", "flexible work"]
    },
    {
      "id": "kb-003",
      "topic": "events",
      "content": "JobsForHer hosts regular events including webinars, workshops, networking sessions, and career fairs. These events feature industry experts and provide opportunities to learn new skills and connect with potential employers.",
      "source": "JobsForHer Events Page",
      "relevance": ["events", "workshops", "networking", "skill development"]
    },
    {
      "id": "kb-004",
      "topic": "mentorship",
      "content": "Our mentorship programs connect aspiring professionals with experienced mentors across diverse fields. These structured programs provide guidance, feedback, and support for career advancement and personal development.",
      "source": "JobsForHer Mentorship Page",
      "relevance": ["mentorship", "guidance", "career development", "coaching"]
    },
    {
      "id": "kb-005",
      "topic": "reskilling",
      "content": "JobsForHer partners with learning platforms to offer courses and certifications in in-demand skills. These resources help women upskill or reskill for career transitions and advancement opportunities.",
      "source": "JobsForHer Learning Page",
      "relevance": ["skills", "learning", "courses", "career transition", "education"]
    },
    {
      "id": "kb-006",
      "topic": "returners",
      "content": "JobsForHer provides specialized resources for women returning to the workforce after a career break. These include returnship programs, confidence-building workshops, and skill refresher courses.",
      "source": "JobsForHer Returnship Page",
      "relevance": ["career break", "returnship", "reentry", "workforce return"]
    },
    {
      "id": "kb-007",
      "topic": "diversity",
      "content": "Companies partnering with JobsForHer demonstrate a commitment to gender diversity and inclusion in the workplace. Many offer specialized programs to support women's career advancement and work-life balance.",
      "source": "JobsForHer Partners Page",
      "relevance": ["diversity", "inclusion", "gender equality", "workplace culture"]
    },
    {
      "id": "kb-008",
      "topic": "remote work",
      "content": "Remote work opportunities provide flexibility that can be particularly valuable for women balancing professional and personal responsibilities. JobsForHer features numerous remote and hybrid positions across various industries.",
      "source": "JobsForHer Remote Jobs Guide",
      "relevance": ["remote work", "work from home", "flexible work", "hybrid work"]
    },
    {
      "id": "kb-009",
      "topic": "entrepreneurship",
      "content": "JobsForHer supports women entrepreneurs through networking events, mentorship connections, and resources on funding and business development. These initiatives aim to increase women's participation in business ownership.",
      "source": "JobsForHer Entrepreneurship Guide",
      "relevance": ["entrepreneurship", "business", "startup", "women founders"]
    },
    {
      "id": "kb-010",
      "topic": "leadership",
      "content": "Women in leadership positions face unique challenges and opportunities. JobsForHer provides resources, networks, and mentorship specifically designed to support women in executive roles and those aspiring to leadership.",
      "source": "JobsForHer Leadership Development Page",
      "relevance": ["leadership", "executive", "management", "career advancement"]
    }
  ]
  
  /**
   * Retrieves relevant knowledge chunks based on user query and intent
   * 
   * @param {string} query - User's message
   * @param {string} intent - Detected user intent
   * @param {number} limit - Maximum number of knowledge chunks to retrieve
   * @returns {Array} - Array of relevant knowledge chunks
   */
  export const retrieveKnowledge = async (query, intent, limit = 3) => {
    // In a real application, this would use vector similarity search
    // with embeddings to find the most relevant knowledge chunks
    
    // For demonstration purposes, we'll use a simple keyword matching approach
    const queryLower = query.toLowerCase();
    
    // Score each knowledge chunk based on relevance to query and intent
    const scoredChunks = KNOWLEDGE_BASE.map(chunk => {
      let score = 0;
      
      // Check if query contains words related to the chunk's topic
      if (queryLower.includes(chunk.topic)) {
        score += 10;
      }
      
      // Check for relevance keywords
      chunk.relevance.forEach(keyword => {
        if (queryLower.includes(keyword.toLowerCase())) {
          score += 5;
        }
      });
      
      // Boost score if intent matches topic
      if (intent.includes(chunk.topic)) {
        score += 15;
      }
      
      // Simple string matching with content
      const contentWords = chunk.content.toLowerCase().split(' ');
      const queryWords = queryLower.split(' ');
      
      queryWords.forEach(word => {
        if (word.length > 3 && contentWords.includes(word)) {
          score += 2;
        }
      });
      
      return { ...chunk, score };
    });
    
    // Sort by relevance score
    const sortedChunks = scoredChunks
      .sort((a, b) => b.score - a.score)
      .filter(chunk => chunk.score > 0);
    
    // Return the most relevant chunks
    return sortedChunks.slice(0, limit);
  };
  
  /**
   * Formats knowledge chunks into a context string for the AI model
   * 
   * @param {Array} knowledgeChunks - Retrieved knowledge chunks
   * @returns {string} - Formatted context string
   */
  export const formatKnowledgeContext = (knowledgeChunks) => {
    if (!knowledgeChunks || knowledgeChunks.length === 0) {
      return '';
    }
    
    let context = 'Reference information:\n\n';
    
    knowledgeChunks.forEach((chunk, index) => {
      context += `[${index + 1}] ${chunk.content}\n`;
      context += `Source: ${chunk.source}\n\n`;
    });
    
    return context;
  };
  
  /**
   * Dynamically updates knowledge base with new information
   * 
   * @param {Object} newKnowledge - New knowledge chunk to add
   * @returns {boolean} - Success status
   */
  export const updateKnowledgeBase = async (newKnowledge) => {
    // In a real app, this would update a database or vector store
    // For demo purposes, we'll just log the new knowledge
    console.log('New knowledge would be added:', newKnowledge);
    
    // Validation
    if (!newKnowledge.topic || !newKnowledge.content) {
      return false;
    }
    
    return true;
  };
  
  /**
   * Generates dynamic context for the AI model based on user query
   * and conversation history
   * 
   * @param {string} query - User's message
   * @param {Array} conversationHistory - Previous exchanges
   * @param {Array} knowledgeChunks - Retrieved knowledge chunks
   * @returns {Object} - Context object for the AI model
   */
  export const generateAIContext = (query, conversationHistory, knowledgeChunks) => {
    // Format the knowledge chunks
    const knowledgeContext = formatKnowledgeContext(knowledgeChunks);
    
    // Extract recent conversation (last 5 exchanges)
    const recentConversation = conversationHistory.slice(-10);
    
    // Format system instructions based on detected needs
    let systemInstructions = `You are Asha, an AI assistant for JobsForHer Foundation. Your purpose is to help women advance in their careers by providing accurate information about job opportunities, events, mentorship programs, and professional development resources. Always be supportive, encouraging, and empowering in your responses. Focus on factual information and avoid gender stereotypes.`;
    
    if (query.toLowerCase().includes('job') || query.toLowerCase().includes('career')) {
      systemInstructions += ` The user appears to be interested in career opportunities, so prioritize information about relevant job listings, skills required for different roles, and career development strategies.`;
    } else if (query.toLowerCase().includes('event') || query.toLowerCase().includes('workshop')) {
      systemInstructions += ` The user appears to be interested in events, so prioritize information about upcoming workshops, webinars, and networking opportunities.`;
    } else if (query.toLowerCase().includes('mentor') || query.toLowerCase().includes('guidance')) {
      systemInstructions += ` The user appears to be seeking mentorship or guidance, so prioritize information about mentorship programs, career coaching, and professional development resources.`;
    }
    
    return {
      systemInstructions,
      knowledgeContext,
      recentConversation
    };
  };