/**
 * Utility functions for handling conversations
 */

/**
 * Generates a unique ID for a message
 * 
 * @returns {string} - Unique ID
 */
export const generateId = () => {
    return `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };
  
  /**
   * Formats conversation history for AI context
   * 
   * @param {Array} messages - List of message objects
   * @param {number} limit - Maximum number of messages to include
   * @returns {Array} - Formatted conversation history
   */
  export const formatConversationHistory = (messages, limit = 10) => {
    if (!messages || !Array.isArray(messages)) {
      return [];
    }
    
    // Get the most recent messages up to the limit
    const recentMessages = messages.slice(-limit);
    
    // Format messages for AI context
    return recentMessages.map(message => ({
      role: message.sender === 'user' ? 'user' : 'assistant',
      content: message.text
    }));
  };
  
  /**
   * Groups messages by date for display
   * 
   * @param {Array} messages - List of message objects
   * @returns {Array} - Messages grouped by date
   */
  export const groupMessagesByDate = (messages) => {
    if (!messages || !Array.isArray(messages)) {
      return [];
    }
    
    const groupedMessages = [];
    let currentDate = null;
    let currentGroup = null;
    
    messages.forEach(message => {
      const messageDate = new Date(message.timestamp);
      const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
      
      // If this is a new day, create a new group
      if (!currentDate || messageDay.getTime() !== currentDate.getTime()) {
        currentDate = messageDay;
        currentGroup = {
          date: currentDate,
          messages: []
        };
        groupedMessages.push(currentGroup);
      }
      
      // Add the message to the current group
      currentGroup.messages.push(message);
    });
    
    return groupedMessages;
  };
  
  /**
   * Extracts keywords from a message for intent detection
   * 
   * @param {string} message - Message text
   * @returns {Array} - Extracted keywords
   */
  export const extractKeywords = (message) => {
    if (!message) return [];
    
    // Simple keyword extraction by removing common words
    const commonWords = [
      'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with',
      'about', 'by', 'from', 'of', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'can', 'could', 'will', 'would',
      'should', 'may', 'might', 'must', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
      'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their',
      'this', 'that', 'these', 'those', 'here', 'there'
    ];
    
    // Remove punctuation and split into words
    const words = message.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.includes(word));
    
    // Remove duplicates
    return [...new Set(words)];
  };
  
  /**
   * Detects if a message is a greeting
   * 
   * @param {string} message - Message text
   * @returns {boolean} - True if message is a greeting
   */
  export const isGreeting = (message) => {
    if (!message) return false;
    
    const greetings = [
      'hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon',
      'good evening', 'howdy', 'hi there', 'hello there', 'welcome'
    ];
    
    const messageLower = message.toLowerCase().trim();
    
    return greetings.some(greeting => 
      messageLower === greeting || 
      messageLower.startsWith(`${greeting} `) ||
      messageLower.startsWith(`${greeting},`)
    );
  };
  
  /**
   * Detects if a message is a question
   * 
   * @param {string} message - Message text
   * @returns {boolean} - True if message is a question
   */
  export const isQuestion = (message) => {
    if (!message) return false;
    
    const messageTrimmed = message.trim();
    
    // Check if the message ends with a question mark
    if (messageTrimmed.endsWith('?')) {
      return true;
    }
    
    // Check if the message starts with common question words
    const questionWords = ['what', 'when', 'where', 'which', 'who', 'whom', 'whose', 'why', 'how', 'can', 'could', 'would', 'will', 'do', 'does', 'is', 'are'];
    const firstWord = messageTrimmed.toLowerCase().split(' ')[0];
    
    return questionWords.includes(firstWord);
  };
  
  /**
   * Formats a system message for display
   * 
   * @param {string} message - Message content
   * @returns {Object} - Formatted system message
   */
  export const createSystemMessage = (message) => {
    return {
      id: generateId(),
      text: message,
      sender: 'system',
      timestamp: new Date().toISOString(),
    };
  };
  
  /**
   * Creates a thinking message for the AI bot
   * 
   * @param {string} message - Optional thinking content
   * @returns {Object} - Thinking message
   */
  export const createThinkingMessage = (message = 'Let me think about that...') => {
    return {
      id: generateId(),
      text: message,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      thinking: true,
    };
  };
  
  /**
   * Detects potential sensitive information in a message
   * 
   * @param {string} message - Message to analyze
   * @returns {Object} - Detection result with type and positions
   */
  export const detectSensitiveInfo = (message) => {
    if (!message) return { hasSensitiveInfo: false };
    
    // Pattern for potential email addresses
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    
    // Pattern for potential phone numbers
    const phonePattern = /(\+\d{1,3}[\s.-])?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
    
    // Pattern for potential credit card numbers
    const creditCardPattern = /\b(?:\d{4}[ -]?){3}\d{4}\b/g;
    
    // Find matches
    const emailMatches = [...message.matchAll(emailPattern)];
    const phoneMatches = [...message.matchAll(phonePattern)];
    const creditCardMatches = [...message.matchAll(creditCardPattern)];
    
    const hasSensitiveInfo = emailMatches.length > 0 || phoneMatches.length > 0 || creditCardMatches.length > 0;
    
    return {
      hasSensitiveInfo,
      types: {
        emails: emailMatches.length > 0,
        phones: phoneMatches.length > 0,
        creditCards: creditCardMatches.length > 0,
      },
      matches: {
        emails: emailMatches.map(match => match[0]),
        phones: phoneMatches.map(match => match[0]),
        creditCards: creditCardMatches.map(match => match[0]),
      }
    };
  };