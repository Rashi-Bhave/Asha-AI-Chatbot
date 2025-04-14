import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Snackbar,
  ActivityIndicator,
  HelperText,
} from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

// Context
import { AuthContext } from '../context/AuthContext';

// Services
import { trackScreenView, trackEvent } from '../services/analyticsService';

// Utils
import { sanitizeInput } from '../services/encryptionService';

// Constants
import { COLORS } from '../constants/colors';
import { SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const LoginScreen = ({ navigation }) => {
  const { login, register, skipAuth, loading } = useContext(AuthContext);
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  
  useEffect(() => {
    trackScreenView('LoginScreen', { mode: isLogin ? 'login' : 'register' });
  }, [isLogin]);
  
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Name validation (only for register)
    if (!isLogin && !name) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isLogin) {
        // Login
        const result = await login(sanitizeInput(email), password);
        if (!result.success) {
          setSnackbar({ visible: true, message: result.error || 'Login failed' });
          trackEvent('login_error', { error: result.error });
        } else {
          trackEvent('login_success');
        }
      } else {
        // Register
        const userData = {
          name: sanitizeInput(name),
          email: sanitizeInput(email),
          password,
        };
        
        const result = await register(userData);
        if (!result.success) {
          setSnackbar({ visible: true, message: result.error || 'Registration failed' });
          trackEvent('register_error', { error: result.error });
        } else {
          trackEvent('register_success');
        }
      }
    } catch (error) {
      setSnackbar({ visible: true, message: error.message || 'An error occurred' });
      trackEvent(isLogin ? 'login_error' : 'register_error', { error: error.message });
    }
  };
  
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const handleSkip = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    trackEvent('auth_skipped');
    await skipAuth();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/asha-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.title}>
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </Text>
          
          <Text style={styles.subtitle}>
            {isLogin 
              ? 'Sign in to access your personalized AI assistant'
              : 'Join Asha AI and start your career growth journey'}
          </Text>
          
          <View style={styles.formContainer}>
            {!isLogin && (
              <View style={styles.inputContainer}>
                <TextInput
                  label="Full Name"
                  value={name}
                  onChangeText={setName}
                  mode="outlined"
                  style={styles.input}
                  outlineColor={COLORS.border}
                  activeOutlineColor={COLORS.primary}
                  left={<TextInput.Icon icon="account-outline" color={COLORS.gray} />}
                  error={!!errors.name}
                  disabled={loading}
                />
                {errors.name && (
                  <HelperText type="error" visible={!!errors.name}>
                    {errors.name}
                  </HelperText>
                )}
              </View>
            )}
            
            <View style={styles.inputContainer}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.primary}
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email-outline" color={COLORS.gray} />}
                error={!!errors.email}
                disabled={loading}
              />
              {errors.email && (
                <HelperText type="error" visible={!!errors.email}>
                  {errors.email}
                </HelperText>
              )}
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                mode="outlined"
                style={styles.input}
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.primary}
                left={<TextInput.Icon icon="lock-outline" color={COLORS.gray} />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off-outline" : "eye-outline"}
                    color={COLORS.gray}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                error={!!errors.password}
                disabled={loading}
              />
              {errors.password && (
                <HelperText type="error" visible={!!errors.password}>
                  {errors.password}
                </HelperText>
              )}
            </View>
            
            {isLogin && (
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
            
            <Button
              mode="contained"
              style={styles.submitButton}
              labelStyle={styles.submitButtonText}
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
            
            <TouchableOpacity style={styles.toggleContainer} onPress={toggleMode}>
              <Text style={styles.toggleText}>
                {isLogin 
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.skipContainer} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbar.message}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.xl,
  },
  backButton: {
    marginTop: SPACING.m,
    marginLeft: -SPACING.s,
    padding: SPACING.s,
    alignSelf: 'flex-start',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.l,
    marginBottom: SPACING.l,
  },
  logo: {
    width: 80,
    height: 80,
    tintColor: COLORS.primary,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.s,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  formContainer: {
    marginTop: SPACING.m,
  },
  inputContainer: {
    marginBottom: SPACING.m,
  },
  input: {
    backgroundColor: COLORS.white,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.l,
  },
  forgotPasswordText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.s,
    borderRadius: 8,
    ...SHADOWS.medium,
    marginBottom: SPACING.l,
  },
  submitButtonText: {
    ...TYPOGRAPHY.button,
    fontSize: 16,
  },
  toggleContainer: {
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  toggleText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
  },
  skipContainer: {
    alignItems: 'center',
  },
  skipText: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkGray,
    textDecorationLine: 'underline',
  },
  snackbar: {
    backgroundColor: COLORS.error,
  },
});

export default LoginScreen;