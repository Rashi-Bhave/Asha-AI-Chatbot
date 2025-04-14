import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData, decryptData } from './encryptionService';

// Secure storage keys
const AUTH_TOKEN_KEY = 'asha_auth_token';
const USER_DATA_KEY = 'asha_user_data';

// Regular storage keys
const CHAT_HISTORY_KEY = 'asha_chat_history';
const SETTINGS_KEY = 'asha_settings';
const ONBOARDING_COMPLETED_KEY = 'asha_onboarding_completed';
const SAVED_JOBS_KEY = 'asha_saved_jobs';
const SAVED_EVENTS_KEY = 'asha_saved_events';
const SAVED_MENTORSHIPS_KEY = 'asha_saved_mentorships';

/**
 * Saves auth token securely
 * 
 * @param {string} token - Authentication token
 * @returns {Promise<void>}
 */
export const saveAuthToken = async (token) => {
  try {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Error saving auth token:', error);
    return false;
  }
};

/**
 * Retrieves auth token
 * 
 * @returns {Promise<string|null>} - Auth token or null
 */
export const getAuthToken = async () => {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Removes auth token
 * 
 * @returns {Promise<boolean>} - Success status
 */
export const removeAuthToken = async () => {
  try {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('Error removing auth token:', error);
    return false;
  }
};

/**
 * Saves user data securely (encrypted)
 * 
 * @param {Object} userData - User data object
 * @returns {Promise<boolean>} - Success status
 */
export const saveUserData = async (userData) => {
  try {
    const encryptedData = encryptData(JSON.stringify(userData));
    await SecureStore.setItemAsync(USER_DATA_KEY, encryptedData);
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

/**
 * Gets user data (decrypted)
 * 
 * @returns {Promise<Object|null>} - User data or null
 */
export const getUserData = async () => {
  try {
    const encryptedData = await SecureStore.getItemAsync(USER_DATA_KEY);
    if (!encryptedData) return null;
    
    const decryptedData = decryptData(encryptedData);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Checks if user is authenticated
 * 
 * @returns {Promise<boolean>} - Authentication status
 */
export const isAuthenticated = async () => {
  try {
    const token = await getAuthToken();
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Saves chat history
 * 
 * @param {Array} messages - Chat messages
 * @returns {Promise<boolean>} - Success status
 */
export const saveChat = async (messages) => {
  try {
    await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    return true;
  } catch (error) {
    console.error('Error saving chat history:', error);
    return false;
  }
};

/**
 * Loads chat history
 * 
 * @returns {Promise<Array|null>} - Chat messages or null
 */
export const loadChat = async () => {
  try {
    const chatData = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
    return chatData ? JSON.parse(chatData) : [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

/**
 * Clears chat history
 * 
 * @returns {Promise<boolean>} - Success status
 */
export const clearChat = async () => {
  try {
    await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return false;
  }
};

/**
 * Saves user settings
 * 
 * @param {Object} settings - User settings
 * @returns {Promise<boolean>} - Success status
 */
export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

/**
 * Loads user settings
 * 
 * @returns {Promise<Object|null>} - User settings or default settings
 */
export const loadSettings = async () => {
  try {
    const settingsData = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!settingsData) {
      // Default settings
      return {
        notifications: true,
        darkMode: false,
        language: 'en',
        fontSize: 'medium',
        analyticsEnabled: true,
      };
    }
    return JSON.parse(settingsData);
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      notifications: true,
      darkMode: false,
      language: 'en',
      fontSize: 'medium',
      analyticsEnabled: true,
    };
  }
};

/**
 * Sets onboarding completed status
 * 
 * @param {boolean} completed - Completion status
 * @returns {Promise<boolean>} - Success status
 */
export const setOnboardingCompleted = async (completed = true) => {
  try {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, JSON.stringify(completed));
    return true;
  } catch (error) {
    console.error('Error setting onboarding status:', error);
    return false;
  }
};

/**
 * Checks if onboarding is completed
 * 
 * @returns {Promise<boolean>} - Completion status
 */
export const isOnboardingCompleted = async () => {
  try {
    const status = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
    return status ? JSON.parse(status) : false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

/**
 * Saves an item to favorites
 * 
 * @param {string} itemType - Type of item ('job', 'event', 'mentorship')
 * @param {Object} item - Item to save
 * @returns {Promise<boolean>} - Success status
 */
export const saveToFavorites = async (itemType, item) => {
  try {
    let storageKey;
    
    switch (itemType) {
      case 'job':
        storageKey = SAVED_JOBS_KEY;
        break;
      case 'event':
        storageKey = SAVED_EVENTS_KEY;
        break;
      case 'mentorship':
        storageKey = SAVED_MENTORSHIPS_KEY;
        break;
      default:
        throw new Error('Invalid item type');
    }
    
    // Get existing saved items
    const existingDataJson = await AsyncStorage.getItem(storageKey);
    const existingData = existingDataJson ? JSON.parse(existingDataJson) : [];
    
    // Check if item already exists
    const itemExists = existingData.some(savedItem => savedItem.id === item.id);
    
    if (!itemExists) {
      // Add new item with timestamp
      const updatedData = [
        ...existingData,
        { ...item, savedAt: new Date().toISOString() }
      ];
      
      // Save updated data
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData));
    }
    
    return true;
  } catch (error) {
    console.error(`Error saving ${itemType} to favorites:`, error);
    return false;
  }
};

/**
 * Removes an item from favorites
 * 
 * @param {string} itemType - Type of item ('job', 'event', 'mentorship')
 * @param {string|number} itemId - ID of item to remove
 * @returns {Promise<boolean>} - Success status
 */
export const removeFromFavorites = async (itemType, itemId) => {
  try {
    let storageKey;
    
    switch (itemType) {
      case 'job':
        storageKey = SAVED_JOBS_KEY;
        break;
      case 'event':
        storageKey = SAVED_EVENTS_KEY;
        break;
      case 'mentorship':
        storageKey = SAVED_MENTORSHIPS_KEY;
        break;
      default:
        throw new Error('Invalid item type');
    }
    
    // Get existing saved items
    const existingDataJson = await AsyncStorage.getItem(storageKey);
    if (!existingDataJson) return true;
    
    const existingData = JSON.parse(existingDataJson);
    
    // Filter out the item to remove
    const updatedData = existingData.filter(item => item.id.toString() !== itemId.toString());
    
    // Save updated data
    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData));
    
    return true;
  } catch (error) {
    console.error(`Error removing ${itemType} from favorites:`, error);
    return false;
  }
};

/**
 * Gets all saved favorites of a specific type
 * 
 * @param {string} itemType - Type of item ('job', 'event', 'mentorship')
 * @returns {Promise<Array>} - Array of saved items
 */
export const getFavorites = async (itemType) => {
  try {
    let storageKey;
    
    switch (itemType) {
      case 'job':
        storageKey = SAVED_JOBS_KEY;
        break;
      case 'event':
        storageKey = SAVED_EVENTS_KEY;
        break;
      case 'mentorship':
        storageKey = SAVED_MENTORSHIPS_KEY;
        break;
      default:
        throw new Error('Invalid item type');
    }
    
    // Get saved items
    const dataJson = await AsyncStorage.getItem(storageKey);
    return dataJson ? JSON.parse(dataJson) : [];
  } catch (error) {
    console.error(`Error getting ${itemType} favorites:`, error);
    return [];
  }
};

/**
 * Checks if an item is saved in favorites
 * 
 * @param {string} itemType - Type of item ('job', 'event', 'mentorship')
 * @param {string|number} itemId - ID of item to check
 * @returns {Promise<boolean>} - True if item is saved
 */
export const isFavorite = async (itemType, itemId) => {
  try {
    const favorites = await getFavorites(itemType);
    return favorites.some(item => item.id.toString() === itemId.toString());
  } catch (error) {
    console.error(`Error checking if ${itemType} is favorite:`, error);
    return false;
  }
};

/**
 * Clears all storage (for logout or reset)
 * 
 * @returns {Promise<boolean>} - Success status
 */
export const clearAllStorage = async () => {
  try {
    // Clear secure storage
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
    
    // Clear regular storage
    await AsyncStorage.multiRemove([
      CHAT_HISTORY_KEY,
      SETTINGS_KEY,
      SAVED_JOBS_KEY,
      SAVED_EVENTS_KEY,
      SAVED_MENTORSHIPS_KEY
    ]);
    
    return true;
  } catch (error) {
    console.error('Error clearing all storage:', error);
    return false;
  }
};