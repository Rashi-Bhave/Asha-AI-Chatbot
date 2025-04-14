/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Formats a date string into a human-readable format
 * 
 * @param {string|Date} dateString - ISO date string or Date object
 * @param {object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return '';
      }
      
      const now = new Date();
      const isToday = isSameDay(date, now);
      const isTomorrow = isSameDay(date, new Date(now.setDate(now.getDate() + 1)));
      const isYesterday = isSameDay(date, new Date(now.setDate(now.getDate() - 2)));
      
      // For today/tomorrow/yesterday format
      if (options.relative !== false) {
        if (isToday) {
          return `Today, ${formatTime(date)}`;
        } else if (isTomorrow) {
          return `Tomorrow, ${formatTime(date)}`;
        } else if (isYesterday) {
          return `Yesterday, ${formatTime(date)}`;
        }
      }
      
      // Default date formatting
      const formatOptions = {
        weekday: options.weekday || 'short',
        month: options.month || 'short',
        day: options.day || 'numeric',
        year: options.year || (date.getFullYear() === now.getFullYear() ? undefined : 'numeric'),
        hour: options.includeTime ? 'numeric' : undefined,
        minute: options.includeTime ? '2-digit' : undefined,
      };
      
      let formatted = date.toLocaleDateString('en-US', formatOptions);
      
      // Add time if not already included but requested separately
      if (!options.includeTime && options.addTime) {
        formatted += `, ${formatTime(date)}`;
      }
      
      return formatted;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };
  
  /**
   * Formats a date object to time string (e.g., "3:30 PM")
   * 
   * @param {Date} date - Date object
   * @returns {string} - Formatted time string
   */
  export const formatTime = (date) => {
    if (!date) return '';
    
    try {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };
  
  /**
   * Checks if two dates are the same day
   * 
   * @param {Date} date1 - First date
   * @param {Date} date2 - Second date
   * @returns {boolean} - True if dates are the same day
   */
  export const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  
  /**
   * Gets relative time string (e.g., "2 hours ago", "in 3 days")
   * 
   * @param {string|Date} dateString - ISO date string or Date object
   * @returns {string} - Relative time string
   */
  export const getRelativeTimeString = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = date.getTime() - now.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);
      const diffMonths = Math.floor(diffDays / 30);
      
      // Future dates
      if (diffMs > 0) {
        if (diffMinutes < 60) {
          return diffMinutes <= 1 ? 'in 1 minute' : `in ${diffMinutes} minutes`;
        } else if (diffHours < 24) {
          return diffHours === 1 ? 'in 1 hour' : `in ${diffHours} hours`;
        } else if (diffDays < 30) {
          return diffDays === 1 ? 'tomorrow' : `in ${diffDays} days`;
        } else if (diffMonths < 12) {
          return diffMonths === 1 ? 'in 1 month' : `in ${diffMonths} months`;
        } else {
          return formatDate(date, { includeTime: false });
        }
      }
      
      // Past dates
      const absDiffSeconds = Math.abs(diffSeconds);
      const absDiffMinutes = Math.abs(diffMinutes);
      const absDiffHours = Math.abs(diffHours);
      const absDiffDays = Math.abs(diffDays);
      const absDiffMonths = Math.abs(diffMonths);
      
      if (absDiffMinutes < 1) {
        return 'just now';
      } else if (absDiffMinutes < 60) {
        return absDiffMinutes === 1 ? '1 minute ago' : `${absDiffMinutes} minutes ago`;
      } else if (absDiffHours < 24) {
        return absDiffHours === 1 ? '1 hour ago' : `${absDiffHours} hours ago`;
      } else if (absDiffDays < 30) {
        return absDiffDays === 1 ? 'yesterday' : `${absDiffDays} days ago`;
      } else if (absDiffMonths < 12) {
        return absDiffMonths === 1 ? '1 month ago' : `${absDiffMonths} months ago`;
      } else {
        return formatDate(date, { includeTime: false });
      }
    } catch (error) {
      console.error('Error getting relative time:', error);
      return '';
    }
  };
  
  /**
   * Gets a date range string (e.g., "Jan 5-7, 2023" or "Jan 28 - Feb 3, 2023")
   * 
   * @param {string|Date} startDateString - Start date
   * @param {string|Date} endDateString - End date
   * @returns {string} - Formatted date range
   */
  export const getDateRangeString = (startDateString, endDateString) => {
    if (!startDateString || !endDateString) return '';
    
    try {
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);
      
      // Same year
      if (startDate.getFullYear() === endDate.getFullYear()) {
        // Same month
        if (startDate.getMonth() === endDate.getMonth()) {
          return `${startDate.toLocaleDateString('en-US', { month: 'short' })} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`;
        } 
        // Different month, same year
        else {
          return `${startDate.toLocaleDateString('en-US', { month: 'short' })} ${startDate.getDate()} - ${endDate.toLocaleDateString('en-US', { month: 'short' })} ${endDate.getDate()}, ${startDate.getFullYear()}`;
        }
      } 
      // Different year
      else {
        return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
    } catch (error) {
      console.error('Error formatting date range:', error);
      return '';
    }
  };
  
  /**
   * Adds days to a date and returns the new date
   * 
   * @param {Date} date - Original date
   * @param {number} days - Number of days to add
   * @returns {Date} - New date
   */
  export const addDays = (date, days) => {
    if (!date) return new Date();
    
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  /**
   * Checks if a date is in the past
   * 
   * @param {string|Date} dateString - Date to check
   * @returns {boolean} - True if date is in the past
   */
  export const isPastDate = (dateString) => {
    if (!dateString) return false;
    
    try {
      const date = new Date(dateString);
      return date < new Date();
    } catch (error) {
      console.error('Error checking if date is past:', error);
      return false;
    }
  };
  
  /**
   * Gets the weekday name from a date
   * 
   * @param {string|Date} dateString - Date
   * @param {boolean} short - Whether to return short name (e.g., "Mon" vs "Monday")
   * @returns {string} - Weekday name
   */
  export const getWeekdayName = (dateString, short = false) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        weekday: short ? 'short' : 'long' 
      });
    } catch (error) {
      console.error('Error getting weekday name:', error);
      return '';
    }
  };