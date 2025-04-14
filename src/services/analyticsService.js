import * as Amplitude from 'expo-analytics-amplitude';
import { Platform } from 'react-native';
import { loadSettings } from './storageService';
import { generateSessionId } from './encryptionService';

// Amplitude API key (in a real app, this would be an environment variable)
const AMPLITUDE_API_KEY = 'asha-amplitude-api-key';

// Analytics session ID
let sessionId = null;

/**
 * Initializes the analytics service
 * 
 * @returns {Promise<boolean>} - Success status
 */
export const initializeAnalytics = async () => {
  try {
    // Check if analytics is enabled in user settings
    const settings = await loadSettings();
    if (!settings.analyticsEnabled) {
      console.log('Analytics disabled in user settings');
      return false;
    }
    
    // Initialize Amplitude
    await Amplitude.initializeAsync(AMPLITUDE_API_KEY);
    
    // Set user properties
    await Amplitude.setUserPropertiesAsync({
      platform: Platform.OS,
      appVersion: Platform.constants.manifest?.version || '1.0.0',
      deviceType: Platform.OS === 'ios' ? 'iOS' : 'Android',
    });
    
    // Generate session ID
    sessionId = await generateSessionId();
    
    console.log('Analytics initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing analytics:', error);
    return false;
  }
};

/**
 * Tracks a screen view event
 * 
 * @param {string} screenName - Name of the screen
 * @param {Object} properties - Additional properties
 * @returns {Promise<void>}
 */
export const trackScreenView = async (screenName, properties = {}) => {
  try {
    // Check if analytics is enabled
    const settings = await loadSettings();
    if (!settings.analyticsEnabled) return;
    
    await Amplitude.logEventWithPropertiesAsync('screen_view', {
      screen_name: screenName,
      session_id: sessionId,
      timestamp: new Date().toISOString(),
      ...properties
    });
  } catch (error) {
    console.error('Error tracking screen view:', error);
  }
};

/**
 * Tracks a user event
 * 
 * @param {string} eventName - Name of the event
 * @param {Object} properties - Additional properties
 * @returns {Promise<void>}
 */
export const trackEvent = async (eventName, properties = {}) => {
  try {
    // Check if analytics is enabled
    const settings = await loadSettings();
    if (!settings.analyticsEnabled) return;
    
    await Amplitude.logEventWithPropertiesAsync(eventName, {
      session_id: sessionId,
      timestamp: new Date().toISOString(),
      ...properties
    });
  } catch (error) {
    console.error(`Error tracking event '${eventName}':`, error);
  }
};

/**
 * Sets user ID for analytics
 * 
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const setUserId = async (userId) => {
  try {
    // Check if analytics is enabled
    const settings = await loadSettings();
    if (!settings.analyticsEnabled) return;
    
    await Amplitude.setUserIdAsync(userId);
  } catch (error) {
    console.error('Error setting user ID:', error);
  }
};

/**
 * Resets user ID and properties (for logout)
 * 
 * @returns {Promise<void>}
 */
export const resetAnalyticsUser = async () => {
  try {
    await Amplitude.clearUserPropertiesAsync();
    // Generate new session ID
    sessionId = await generateSessionId();
  } catch (error) {
    console.error('Error resetting analytics user:', error);
  }
};

/**
 * Submits user feedback
 * 
 * @param {Object} feedback - Feedback data
 * @returns {Promise<boolean>} - Success status
 */
export const submitFeedback = async (feedback) => {
  try {
    // Track feedback event
    await trackEvent('feedback_submitted', {
      feedback_type: feedback.feedbackType,
      has_details: !!feedback.feedbackText,
      message_id: feedback.messageId,
    });
    
    // In a real app, this might also send to a backend API
    console.log('Feedback submitted:', feedback);
    
    return true;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return false;
  }
};

/**
 * Tracks error events
 * 
 * @param {string} errorType - Type of error
 * @param {string} errorMessage - Error message
 * @param {Object} additionalInfo - Additional information
 * @returns {Promise<void>}
 */
export const trackError = async (errorType, errorMessage, additionalInfo = {}) => {
  try {
    // Check if analytics is enabled
    const settings = await loadSettings();
    if (!settings.analyticsEnabled) return;
    
    await Amplitude.logEventWithPropertiesAsync('error', {
      error_type: errorType,
      error_message: errorMessage,
      session_id: sessionId,
      timestamp: new Date().toISOString(),
      ...additionalInfo
    });
  } catch (error) {
    console.error('Error tracking error event:', error);
  }
};