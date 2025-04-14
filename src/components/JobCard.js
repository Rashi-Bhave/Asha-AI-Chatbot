import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Card, Text, Chip, Button, IconButton } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

// Services
import { trackEvent } from '../services/analyticsService';

// Utils
import { formatDate } from '../utils/dateUtils';

// Constants
import { COLORS } from '../constants/colors';
import { SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const JobCard = ({ job }) => {
  const handleApply = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (job.applyUrl) {
      Linking.openURL(job.applyUrl);
      trackEvent('job_apply_clicked', { 
        jobId: job.id,
        jobTitle: job.title,
        company: job.company 
      });
    }
  };
  
  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    trackEvent('job_saved', { 
      jobId: job.id,
      jobTitle: job.title,
      company: job.company 
    });
    // Save job implementation would go here
  };
  
  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Share job implementation would go here
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {job.title}
            </Text>
            <Text style={styles.company}>{job.company}</Text>
          </View>
          
          {job.logo && (
            <View style={styles.logoContainer}>
              <Card.Cover
                source={{ uri: job.logo }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <IconButton
              icon="map-marker-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.detailText}>
              {job.location || 'Remote'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <IconButton
              icon="briefcase-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.detailText}>
              {job.type || 'Full-time'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <IconButton
              icon="calendar-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.detailText}>
              Posted {formatDate(job.postedDate) || 'Recently'}
            </Text>
          </View>
        </View>
        
        {job.salary && (
          <Text style={styles.salary}>
            {job.salary}
          </Text>
        )}
        
        <View style={styles.tagsContainer}>
          {job.skills && job.skills.map((skill, index) => (
            <Chip
              key={index}
              style={styles.chip}
              textStyle={styles.chipText}
              mode="outlined"
            >
              {skill}
            </Chip>
          ))}
        </View>
        
        <Text style={styles.description} numberOfLines={3}>
          {job.description}
        </Text>
      </Card.Content>
      
      <Card.Actions style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={handleSave}
        >
          <IconButton
            icon="bookmark-outline"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.iconText}>Save</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={handleShare}
        >
          <IconButton
            icon="share-outline"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.iconText}>Share</Text>
        </TouchableOpacity>
        
        <Button
          mode="contained"
          style={styles.applyButton}
          labelStyle={styles.applyButtonText}
          onPress={handleApply}
        >
          Apply Now
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: SPACING.m,
    marginBottom: SPACING.s,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.s,
  },
  titleContainer: {
    flex: 1,
    marginRight: SPACING.s,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    marginBottom: 2,
  },
  company: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.darkGray,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: SPACING.xs,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.m,
    marginBottom: SPACING.xs,
  },
  detailText: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkGray,
  },
  salary: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.secondary,
    marginVertical: SPACING.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
    marginBottom: SPACING.s,
  },
  chip: {
    backgroundColor: 'transparent',
    borderColor: COLORS.primary,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  chipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
  },
  description: {
    ...TYPOGRAPHY.body,
    marginVertical: SPACING.s,
  },
  actionsContainer: {
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.s,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.m,
  },
  applyButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.white,
  },
});

export default JobCard;