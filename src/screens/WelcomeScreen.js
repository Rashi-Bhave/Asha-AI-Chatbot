import React, { useContext } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

// Context
import { AuthContext } from '../context/AuthContext';

// Constants
import { COLORS } from '../constants/colors';
import { SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const { skipAuth } = useContext(AuthContext);
  
  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Login');
  };
  
  const handleSkip = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await skipAuth();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/asha-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Welcome to Asha AI</Text>
          
          <Text style={styles.subtitle}>
            Your AI Companion for Career Growth
          </Text>
          
          <View style={styles.featureContainer}>
            <FeatureItem
              icon="briefcase-outline"
              title="Job Opportunities"
              description="Discover personalized job listings that match your skills and career goals."
            />
            
            <FeatureItem
              icon="calendar-outline"
              title="Community Events"
              description="Stay updated with events, workshops, and networking opportunities."
            />
            
            <FeatureItem
              icon="people-outline"
              title="Mentorship Programs"
              description="Connect with experienced mentors who can guide your professional journey."
            />
            
            <FeatureItem
              icon="chatbubble-ellipses-outline"
              title="Smart Conversations"
              description="Engage with Asha AI for career advice and information tailored to your needs."
            />
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.loginButton}
            labelStyle={styles.loginButtonText}
            onPress={handleLogin}
          >
            Sign In / Create Account
          </Button>
          
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Image
            source={require('../../assets/images/jobsforher-logo.png')}
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={styles.footerText}>
            Powered by JobsForHer Foundation
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const FeatureItem = ({ icon, title, description }) => {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIconContainer}>
        <Image
          source={{ uri: `https://img.icons8.com/ios/${icon}` }}
          style={styles.featureIcon}
        />
      </View>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
    marginBottom: SPACING.l,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    tintColor: COLORS.white,
  },
  contentContainer: {
    paddingHorizontal: SPACING.l,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: SPACING.s,
  },
  subtitle: {
    ...TYPOGRAPHY.subtitle,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  featureContainer: {
    marginVertical: SPACING.l,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: SPACING.l,
    alignItems: 'flex-start',
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  featureIcon: {
    width: 28,
    height: 28,
    tintColor: COLORS.white,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.white,
    marginBottom: 4,
  },
  featureDescription: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  buttonContainer: {
    paddingHorizontal: SPACING.l,
    marginTop: SPACING.l,
    marginBottom: SPACING.xl,
  },
  loginButton: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.s,
    borderRadius: 30,
    ...SHADOWS.medium,
  },
  loginButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary,
    fontSize: 16,
  },
  skipText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: SPACING.m,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.l,
  },
  footerLogo: {
    width: 120,
    height: 40,
    tintColor: 'rgba(255, 255, 255, 0.9)',
  },
  footerText: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: SPACING.xs,
  },
});

export default WelcomeScreen;