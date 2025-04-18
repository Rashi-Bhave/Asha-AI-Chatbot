import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

// Services
import { getUserProfile, loginUser, registerUser, logoutUser } from '../api/index';
import { saveAuthToken, getAuthToken, removeAuthToken } from '../services/storageService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check for existing auth token on initial render
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await getAuthToken();
        
        if (token) {
          // Fetch user profile with token
          const userProfile = await getUserProfile();
          setUser(userProfile);
        }
      } catch (e) {
        console.error('Authentication error:', e);
        // Clear invalid token
        await removeAuthToken();
      } finally {
        setLoading(false);
      }
    };
    
    bootstrapAsync();
  }, []);
  
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await loginUser(email, password);
      
      // Save auth token securely
      await saveAuthToken(response.token);
      
      // Set user data
      setUser(response.user);
      
      return { success: true };
    } catch (e) {
      console.error('Login error:', e);
      setError(e.message || 'An error occurred during login.');
      return { success: false, error: e.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await registerUser(userData);
      
      // Save auth token securely
      await saveAuthToken(response.token);
      
      // Set user data
      setUser(response.user);
      
      return { success: true };
    } catch (e) {
      console.error('Registration error:', e);
      setError(e.message || 'An error occurred during registration.');
      return { success: false, error: e.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    setLoading(true);
    
    try {
      // Call logout API if needed
      await logoutUser();
      
      // Clear auth token and user data
      await removeAuthToken();
      setUser(null);
      
      return { success: true };
    } catch (e) {
      console.error('Logout error:', e);
      return { success: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };
  
  const updateUserProfile = async (updatedData) => {
    setLoading(true);
    
    try {
      // Would call API to update profile
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      
      return { success: true };
    } catch (e) {
      console.error('Profile update error:', e);
      setError(e.message || 'An error occurred while updating profile.');
      return { success: false, error: e.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Skip actual authentication for demo purposes
  const skipAuth = async () => {
    setLoading(true);
    
    // Create a demo user
    const demoUser = {
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@example.com',
      profilePicture: null,
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser(demoUser);
    setLoading(false);
    
    return { success: true };
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUserProfile,
        skipAuth,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};