import { extractEntities } from '../services/chatService';

/**
 * Performs semantic search over data items to find relevant matches
 * based on user query and entity matching.
 * 
 * @param {string} query - The user's input query
 * @param {Array} items - Array of data items to search through
 * @param {string} type - Type of data ('job', 'event', 'mentorship')
 * @param {number} limit - Maximum number of results to return
 * @returns {Array} - Ranked results sorted by relevance
 */
export const performSemanticSearch = async (query, items, type, limit = 3) => {
  // Extract entities from user query
  const entities = extractEntities(query);
  
  // In a production app, this would use a proper vector embedding service
  // For demo purposes, we'll implement a simple keyword-based ranking system
  
  const scoredItems = items.map(item => {
    let score = 0;
    const queryLower = query.toLowerCase();
    
    // Different scoring logic based on item type
    if (type === 'job') {
      // Match job title
      if (item.title.toLowerCase().includes(queryLower)) {
        score += 10;
      }
      
      // Match company name
      if (item.company.toLowerCase().includes(queryLower)) {
        score += 5;
      }
      
      // Match job description
      if (item.description.toLowerCase().includes(queryLower)) {
        score += 3;
      }
      
      // Match job location
      if (item.location && queryLower.includes(item.location.toLowerCase())) {
        score += 8;
      }
      
      // Match job type
      if (item.type && queryLower.includes(item.type.toLowerCase())) {
        score += 8;
      }
      
      // Match skills
      if (item.skills && Array.isArray(item.skills)) {
        item.skills.forEach(skill => {
          if (queryLower.includes(skill.toLowerCase())) {
            score += 7;
          }
        });
      }
      
      // Match experience level
      if (item.experienceLevel && queryLower.includes(item.experienceLevel.toLowerCase())) {
        score += 5;
      }
      
      // Entity-based matching
      if (entities.jobTypes.length > 0) {
        if (entities.jobTypes.some(type => 
          item.type && item.type.toLowerCase().includes(type.toLowerCase())
        )) {
          score += 10;
        }
      }
      
      if (entities.skills.length > 0) {
        if (item.skills && entities.skills.some(skill => 
          item.skills.some(itemSkill => 
            itemSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )) {
          score += 10;
        }
      }
      
      if (entities.industries.length > 0) {
        if (item.industry && entities.industries.some(industry => 
          item.industry.toLowerCase().includes(industry.toLowerCase())
        )) {
          score += 10;
        }
      }
      
    } else if (type === 'event') {
      // Match event title
      if (item.title.toLowerCase().includes(queryLower)) {
        score += 10;
      }
      
      // Match event description
      if (item.description.toLowerCase().includes(queryLower)) {
        score += 5;
      }
      
      // Match event topic or category
      if (item.category && item.category.toLowerCase().includes(queryLower)) {
        score += 8;
      }
      
      // Match speaker names
      if (item.speakers && Array.isArray(item.speakers)) {
        item.speakers.forEach(speaker => {
          if (queryLower.includes(speaker.name.toLowerCase())) {
            score += 6;
          }
        });
      }
      
      // Match time-related terms
      const timeTerms = ['today', 'tomorrow', 'this week', 'upcoming', 'next week', 'weekend'];
      timeTerms.forEach(term => {
        if (queryLower.includes(term)) {
          // Check if event date matches the time term
          // For demo purposes, we'll just add some score
          score += 4;
        }
      });
      
    } else if (type === 'mentorship') {
      // Match mentorship program title
      if (item.title.toLowerCase().includes(queryLower)) {
        score += 10;
      }
      
      // Match mentor name
      if (item.mentor.toLowerCase().includes(queryLower)) {
        score += 8;
      }
      
      // Match focus area
      if (item.focus.toLowerCase().includes(queryLower)) {
        score += 9;
      }
      
      // Match description
      if (item.description.toLowerCase().includes(queryLower)) {
        score += 5;
      }
      
      // Match industry
      if (item.industry && item.industry.toLowerCase().includes(queryLower)) {
        score += 7;
      }
    }
    
    return { ...item, score };
  });
  
  // Sort by score in descending order
  const sortedItems = scoredItems.sort((a, b) => b.score - a.score);
  
  // Return top N results that have a minimum score
  return sortedItems
    .filter(item => item.score > 0)
    .slice(0, limit);
};

/**
 * Filters data based on specified criteria
 * 
 * @param {Array} items - Array of data items to filter
 * @param {Object} filters - Object containing filter criteria
 * @returns {Array} - Filtered results
 */
export const filterData = (items, filters) => {
  if (!filters || Object.keys(filters).length === 0) {
    return items;
  }
  
  return items.filter(item => {
    let match = true;
    
    // Apply each filter
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        // Handle array-based filters (e.g., categories, skills)
        if (Array.isArray(item[key])) {
          // Check if there's any overlap between filter values and item values
          const hasMatch = value.some(v => item[key].includes(v));
          if (!hasMatch) match = false;
        } else if (item[key]) {
          // Check if item's value matches any in the filter array
          const hasMatch = value.some(v => item[key] === v || item[key].includes(v));
          if (!hasMatch) match = false;
        } else {
          match = false;
        }
      } else if (value && item[key] !== value) {
        // Handle simple equality filters
        match = false;
      }
    });
    
    return match;
  });
};

/**
 * Performs a text search across items based on a search query
 * 
 * @param {Array} items - Array of data items to search through
 * @param {string} query - Search query
 * @param {Array} fields - Fields to search in
 * @returns {Array} - Search results
 */
export const searchByText = (items, query, fields = ['title', 'description']) => {
  if (!query || query.trim() === '') {
    return items;
  }
  
  const queryLower = query.toLowerCase().trim();
  
  return items.filter(item => {
    return fields.some(field => {
      if (!item[field]) return false;
      return item[field].toLowerCase().includes(queryLower);
    });
  });
};