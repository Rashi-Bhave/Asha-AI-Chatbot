import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {
  Appbar,
  Text,
  List,
  Divider,
  Card,
  Button,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

// Services
import { trackScreenView, trackEvent } from '../services/analyticsService';

// Constants
import { COLORS } from '../constants/colors';
import { SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const AboutScreen = ({ navigation }) => {
  useEffect(() => {
    trackScreenView('AboutScreen');
  }, []);
  
  const handleLinkPress = (url, linkName) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url);
    trackEvent('external_link_clicked', { link: linkName });
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color={COLORS.white} />
        <Appbar.Content title="About Asha AI" titleStyle={styles.headerTitle} />
      </Appbar.Header>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/asha-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Asha AI Chatbot</Text>
          <Text style={styles.subtitle}>Your AI Companion for Career Growth</Text>
        </View>
        
        <Text style={styles.description}>
          Asha AI was developed by JobsForHer Foundation to empower women in their career journeys through accessible, personalized guidance and support.
        </Text>
        
        <Card style={styles.missionCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Our Mission</Text>
            <Text style={styles.cardText}>
              To enhance user engagement on the JobsForHer platform by offering seamless access to publicly available information about women's careers, job listings, community events, mentorship programs, and related resources.
            </Text>
          </Card.Content>
        </Card>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          
          <FeatureItem
            icon="chatbubble-ellipses-outline"
            title="Context-Aware Conversations"
            description="Engage in multi-turn conversations with logical, coherent, and relevant responses."
          />
          
          <FeatureItem
            icon="briefcase-outline"
            title="Real-Time Job Listings"
            description="Access up-to-date job opportunities tailored to your skills and interests."
          />
          
          <FeatureItem
            icon="calendar-outline"
            title="Community Events"
            description="Stay informed about workshops, webinars, and networking opportunities."
          />
          
          <FeatureItem
            icon="people-outline"
            title="Mentorship Programs"
            description="Discover mentorship opportunities to accelerate your professional growth."
          />
          
          <FeatureItem
            icon="shield-checkmark-outline"
            title="Ethical AI"
            description="Designed with bias prevention and inclusive, privacy-conscious interactions."
          />
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Technology</Text>
          <Text style={styles.technologyText}>
            Asha AI is built using advanced natural language processing technologies including:
          </Text>
          
          <View style={styles.techListContainer}>
            <TechItem title="Retrieval-Augmented Generation (RAG)" />
            <TechItem title="Semantic Search" />
            <TechItem title="Dynamic Knowledge Retrieval" />
            <TechItem title="NLP-based Bias Detection" />
            <TechItem title="Multi-turn Conversation Management" />
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Connect with JobsForHer</Text>
          
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => handleLinkPress('https://www.jobsforher.com', 'website')}
          >
            <Ionicons name="globe-outline" size={24} color={COLORS.primary} style={styles.linkIcon} />
            <Text style={styles.linkText}>Website</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => handleLinkPress('https://www.linkedin.com/company/jobsforher', 'linkedin')}
          >
            <Ionicons name="logo-linkedin" size={24} color={COLORS.primary} style={styles.linkIcon} />
            <Text style={styles.linkText}>LinkedIn</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => handleLinkPress('https://twitter.com/jobsforher', 'twitter')}
          >
            <Ionicons name="logo-twitter" size={24} color={COLORS.primary} style={styles.linkIcon} />
            <Text style={styles.linkText}>Twitter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => handleLinkPress('https://www.instagram.com/jobsforher', 'instagram')}
          >
            <Ionicons name="logo-instagram" size={24} color={COLORS.primary} style={styles.linkIcon} />
            <Text style={styles.linkText}>Instagram</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.contactContainer}>
          <Button
            mode="contained"
            icon="email-outline"
            style={styles.contactButton}
            onPress={() => handleLinkPress('mailto:support@jobsforher.com', 'email')}
          >
            Contact Support
          </Button>
        </View>
        
        <View style={styles.footerContainer}>
          <Image
            source={require('../../assets/images/jobsforher-logo.png')}
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={styles.footerText}>© 2025 JobsForHer Foundation</Text>
          <Text style={styles.footerText}>All rights reserved</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const FeatureItem = ({ icon, title, description }) => {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon} size={24} color={COLORS.primary} style={styles.featureIcon} />
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
};

const TechItem = ({ title }) => {
  return (
    <View style={styles.techItem}>
      <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} style={styles.techIcon} />
      <Text style={styles.techText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.l,
    paddingBottom: SPACING.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 100,
    height: 100,
    tintColor: COLORS.primary,
    marginBottom: SPACING.m,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.darkGray,
    textAlign: 'center',
  },
  description: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.l,
  },
  missionCard: {
    backgroundColor: COLORS.primaryLight,
    marginBottom: SPACING.l,
    ...SHADOWS.medium,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    marginBottom: SPACING.s,
  },
  cardText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  sectionContainer: {
    marginBottom: SPACING.l,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: SPACING.m,
    alignItems: 'flex-start',
  },
  featureIcon: {
    marginRight: SPACING.m,
    marginTop: 2,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
    marginBottom: 4,
  },
  featureDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkGray,
  },
  technologyText: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.m,
  },
  techListContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.m,
    ...SHADOWS.small,
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  techIcon: {
    marginRight: SPACING.s,
  },
  techText: {
    ...TYPOGRAPHY.body,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: 8,
    marginBottom: SPACING.s,
    ...SHADOWS.small,
  },
  linkIcon: {
    marginRight: SPACING.m,
  },
  linkText: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.text,
  },
  contactContainer: {
    alignItems: 'center',
    marginVertical: SPACING.l,
  },
  contactButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.l,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: SPACING.l,
  },
  footerLogo: {
    width: 120,
    height: 40,
    tintColor: COLORS.primary,
    marginBottom: SPACING.s,
  },
  footerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.darkGray,
    marginBottom: 2,
  },
});

export default AboutScreen;