import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Appbar,
  Text,
  Searchbar,
  Chip,
  Divider,
  Button,
  Card,
  Avatar,
  Badge,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

// Components
import MentorshipCard from '../components/MentorshipCard';
import LoadingIndicator from '../components/LoadingIndicator';

// API
import { fetchMentorships } from '../api/mentorshipApi';

// Services
import { trackScreenView, trackEvent } from '../services/analyticsService';

// Constants
import { COLORS } from '../constants/colors';
import { SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const MentorshipScreen = ({ navigation }) => {
  const [mentorships, setMentorships] = useState([]);
  const [filteredMentorships, setFilteredMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    focusAreas: [],
    industries: [],
    duration: null,
  });
  
  // Available filter options
  const filterOptions = {
    focusAreas: [
      'Leadership', 
      'Technical', 
      'Career Growth', 
      'Entrepreneurship', 
      'Re-entry', 
      'Management'
    ],
    industries: [
      'Technology', 
      'Finance', 
      'Healthcare', 
      'Marketing', 
      'Cross-industry', 
      'Entrepreneurship'
    ],
    durations: [
      '1-3 months', 
      '3-6 months', 
      '6+ months'
    ],
  };
  
  useEffect(() => {
    trackScreenView('MentorshipScreen');
    loadMentorships();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, mentorships]);
  
  const loadMentorships = async () => {
    try {
      setLoading(true);
      const fetchedMentorships = await fetchMentorships();
      setMentorships(fetchedMentorships);
      setLoading(false);
    } catch (error) {
      console.error('Error loading mentorships:', error);
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMentorships();
    setRefreshing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  
  const applyFilters = () => {
    let result = [...mentorships];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((mentorship) => 
        mentorship.title.toLowerCase().includes(query) ||
        mentorship.description.toLowerCase().includes(query) ||
        mentorship.mentor.toLowerCase().includes(query) ||
        mentorship.focus.toLowerCase().includes(query)
      );
    }
    
    // Apply focus area filters
    if (filters.focusAreas.length > 0) {
      result = result.filter((mentorship) => 
        filters.focusAreas.some(focus => 
          mentorship.focus.toLowerCase().includes(focus.toLowerCase())
        )
      );
    }
    
    // Apply industry filters
    if (filters.industries.length > 0) {
      result = result.filter((mentorship) => 
        filters.industries.some(industry => 
          mentorship.industry.toLowerCase().includes(industry.toLowerCase())
        )
      );
    }
    
    // Apply duration filter
    if (filters.duration) {
      if (filters.duration === '1-3 months') {
        result = result.filter((mentorship) => 
          mentorship.duration.includes('1 month') || 
          mentorship.duration.includes('2 month') || 
          mentorship.duration.includes('3 month')
        );
      } else if (filters.duration === '3-6 months') {
        result = result.filter((mentorship) => 
          mentorship.duration.includes('4 month') || 
          mentorship.duration.includes('5 month') || 
          mentorship.duration.includes('6 month')
        );
      } else if (filters.duration === '6+ months') {
        result = result.filter((mentorship) => {
          const durationNumber = parseInt(mentorship.duration);
          return durationNumber >= 6;
        });
      }
    }
    
    setFilteredMentorships(result);
  };
  
  const toggleFocusAreaFilter = (focus) => {
    setFilters(prevFilters => {
      const updatedFocusAreas = [...prevFilters.focusAreas];
      
      if (updatedFocusAreas.includes(focus)) {
        // Remove the focus area
        const index = updatedFocusAreas.indexOf(focus);
        updatedFocusAreas.splice(index, 1);
      } else {
        // Add the focus area
        updatedFocusAreas.push(focus);
      }
      
      trackEvent('mentorship_filter_applied', { 
        type: 'focus_area', 
        value: focus, 
        active: !prevFilters.focusAreas.includes(focus) 
      });
      
      return {
        ...prevFilters,
        focusAreas: updatedFocusAreas,
      };
    });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const toggleIndustryFilter = (industry) => {
    setFilters(prevFilters => {
      const updatedIndustries = [...prevFilters.industries];
      
      if (updatedIndustries.includes(industry)) {
        // Remove the industry
        const index = updatedIndustries.indexOf(industry);
        updatedIndustries.splice(index, 1);
      } else {
        // Add the industry
        updatedIndustries.push(industry);
      }
      
      trackEvent('mentorship_filter_applied', { 
        type: 'industry', 
        value: industry, 
        active: !prevFilters.industries.includes(industry) 
      });
      
      return {
        ...prevFilters,
        industries: updatedIndustries,
      };
    });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const setDurationFilter = (duration) => {
    setFilters(prevFilters => {
      const newDuration = prevFilters.duration === duration ? null : duration;
      
      trackEvent('mentorship_filter_applied', { 
        type: 'duration', 
        value: duration, 
        active: newDuration !== null 
      });
      
      return {
        ...prevFilters,
        duration: newDuration,
      };
    });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const clearFilters = () => {
    setFilters({
      focusAreas: [],
      industries: [],
      duration: null,
    });
    setSearchQuery('');
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    trackEvent('mentorship_filters_cleared');
  };
  
  const renderFilterSection = () => {
    if (!filterVisible) return null;
    
    return (
      <View style={styles.filterSection}>
        <View style={styles.filterCategory}>
          <Text style={styles.filterTitle}>Focus Area</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScrollContainer}
          >
            {filterOptions.focusAreas.map((focus) => (
              <Chip
                key={focus}
                selected={filters.focusAreas.includes(focus)}
                onPress={() => toggleFocusAreaFilter(focus)}
                style={[
                  styles.filterChip,
                  filters.focusAreas.includes(focus) && styles.selectedChip
                ]}
                textStyle={[
                  styles.filterChipText,
                  filters.focusAreas.includes(focus) && styles.selectedChipText
                ]}
              >
                {focus}
              </Chip>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.filterCategory}>
          <Text style={styles.filterTitle}>Industry</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScrollContainer}
          >
            {filterOptions.industries.map((industry) => (
              <Chip
                key={industry}
                selected={filters.industries.includes(industry)}
                onPress={() => toggleIndustryFilter(industry)}
                style={[
                  styles.filterChip,
                  filters.industries.includes(industry) && styles.selectedChip
                ]}
                textStyle={[
                  styles.filterChipText,
                  filters.industries.includes(industry) && styles.selectedChipText
                ]}
              >
                {industry}
              </Chip>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.filterCategory}>
          <Text style={styles.filterTitle}>Duration</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScrollContainer}
          >
            {filterOptions.durations.map((duration) => (
              <Chip
                key={duration}
                selected={filters.duration === duration}
                onPress={() => setDurationFilter(duration)}
                style={[
                  styles.filterChip,
                  filters.duration === duration && styles.selectedChip
                ]}
                textStyle={[
                  styles.filterChipText,
                  filters.duration === duration && styles.selectedChipText
                ]}
              >
                {duration}
              </Chip>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.filterActions}>
          <Button
            mode="outlined"
            onPress={clearFilters}
            style={styles.clearButton}
          >
            Clear All
          </Button>
          <Button
            mode="contained"
            onPress={() => setFilterVisible(false)}
            style={styles.applyButton}
          >
            Apply Filters
          </Button>
        </View>
      </View>
    );
  };
  
  const renderEmptyState = () => {
    if (loading) {
      return <LoadingIndicator />;
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={64} color={COLORS.gray} />
        <Text style={styles.emptyTitle}>No mentorship programs found</Text>
        <Text style={styles.emptyText}>
          {searchQuery || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== null)
            ? "Try adjusting your filters or search query."
            : "There are no mentorship programs available at the moment. Please check back later."}
        </Text>
        {(searchQuery || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== null)) && (
          <Button
            mode="contained"
            onPress={clearFilters}
            style={styles.emptyButton}
          >
            Clear Filters
          </Button>
        )}
      </View>
    );
  };
  
  const renderListHeader = () => {
    if (filteredMentorships.length === 0) return null;
    
    return (
      <View style={styles.listHeader}>
        <Text style={styles.resultCount}>
          {filteredMentorships.length} {filteredMentorships.length === 1 ? 'program' : 'programs'} found
        </Text>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Mentorship Programs" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="account-group" color={COLORS.white} />
      </Appbar.Header>
      
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search mentors, programs, skills..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            iconColor={COLORS.primary}
            clearIcon="close-circle"
            onClearIconPress={() => setSearchQuery('')}
          />
          
          <Button
            mode={filterVisible ? "contained" : "outlined"}
            onPress={() => {
              setFilterVisible(!filterVisible);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={styles.filterButton}
            icon="filter-variant"
          >
            Filters
          </Button>
        </View>
        
        {renderFilterSection()}
        
        {filterVisible && <Divider style={styles.divider} />}
        
        <FlatList
          data={filteredMentorships}
          renderItem={({ item }) => <MentorshipCard mentorship={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        />
      </View>
    </SafeAreaView>
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
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  searchbar: {
    flex: 1,
    marginRight: SPACING.s,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  filterButton: {
    borderColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
  },
  filterSection: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.m,
    ...SHADOWS.small,
  },
  filterCategory: {
    marginTop: SPACING.m,
  },
  filterTitle: {
    ...TYPOGRAPHY.subtitle,
    marginBottom: SPACING.xs,
  },
  chipScrollContainer: {
    paddingVertical: SPACING.xs,
  },
  filterChip: {
    backgroundColor: COLORS.background,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    color: COLORS.text,
  },
  selectedChipText: {
    color: COLORS.white,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.m,
  },
  clearButton: {
    marginRight: SPACING.m,
    borderColor: COLORS.gray,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  listHeader: {
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.m,
    paddingBottom: SPACING.s,
  },
  resultCount: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkGray,
  },
  listContent: {
    padding: SPACING.m,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.l,
    marginTop: SPACING.xl,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginTop: SPACING.m,
    marginBottom: SPACING.m,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.l,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
  },
});

export default MentorshipScreen;