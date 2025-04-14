import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  Appbar,
  Searchbar,
  Text,
  Chip,
  Button,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

// Components
import JobCard from '../components/JobCard';
import LoadingIndicator from '../components/LoadingIndicator';

// Services
import { fetchJobs } from '../api/jobsApi';
import { trackScreenView, trackEvent } from '../services/analyticsService';

// Constants
import { COLORS } from '../constants/colors';
import { SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const JobListingsScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    location: [],
    type: [],
    experience: [],
  });

  // Available filter options
  const filterOptions = {
    location: ['Remote', 'Hybrid', 'On-site'],
    type: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    experience: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
  };

  useEffect(() => {
    trackScreenView('JobListingsScreen');
    loadJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, jobs]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const fetchedJobs = await fetchJobs();
      setJobs(fetchedJobs);
      setLoading(false);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const applyFilters = () => {
    let result = [...jobs];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((job) => 
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    }
    
    // Apply location filters
    if (filters.location.length > 0) {
      result = result.filter((job) => 
        filters.location.some(loc => 
          job.location.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }
    
    // Apply job type filters
    if (filters.type.length > 0) {
      result = result.filter((job) => 
        filters.type.some(type => 
          job.type.toLowerCase().includes(type.toLowerCase())
        )
      );
    }
    
    // Apply experience level filters
    if (filters.experience.length > 0) {
      result = result.filter((job) => 
        filters.experience.some(exp => 
          job.experienceLevel && job.experienceLevel.toLowerCase().includes(exp.toLowerCase())
        )
      );
    }
    
    setFilteredJobs(result);
  };

  const toggleFilter = (category, value) => {
    setFilters(prevFilters => {
      const updated = { ...prevFilters };
      
      if (updated[category].includes(value)) {
        // Remove the filter if already applied
        updated[category] = updated[category].filter(v => v !== value);
      } else {
        // Add the filter
        updated[category] = [...updated[category], value];
      }
      
      trackEvent('job_filter_applied', { 
        category, 
        value, 
        active: !prevFilters[category].includes(value) 
      });
      
      return updated;
    });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const clearFilters = () => {
    setFilters({
      location: [],
      type: [],
      experience: [],
    });
    setSearchQuery('');
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    trackEvent('job_filters_cleared');
  };

  const renderFilterCategory = (category, title) => {
    return (
      <View style={styles.filterCategory}>
        <Text style={styles.filterTitle}>{title}</Text>
        <View style={styles.chipContainer}>
          {filterOptions[category].map((option) => (
            <Chip
              key={option}
              selected={filters[category].includes(option)}
              onPress={() => toggleFilter(category, option)}
              style={[
                styles.filterChip,
                filters[category].includes(option) && styles.selectedChip
              ]}
              textStyle={[
                styles.filterChipText,
                filters[category].includes(option) && styles.selectedChipText
              ]}
            >
              {option}
            </Chip>
          ))}
        </View>
      </View>
    );
  };

  const renderFilterSection = () => {
    if (!filterVisible) return null;
    
    return (
      <View style={styles.filterSection}>
        {renderFilterCategory('location', 'Location')}
        {renderFilterCategory('type', 'Job Type')}
        {renderFilterCategory('experience', 'Experience Level')}
        
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
        <Text style={styles.emptyTitle}>No jobs found</Text>
        <Text style={styles.emptyText}>
          {searchQuery || Object.values(filters).some(f => f.length > 0)
            ? "Try adjusting your filters or search query."
            : "There are no job listings available at the moment. Please check back later."}
        </Text>
        {(searchQuery || Object.values(filters).some(f => f.length > 0)) && (
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color={COLORS.white} />
        <Appbar.Content title="Job Listings" titleStyle={styles.headerTitle} />
      </Appbar.Header>
      
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search jobs, companies, skills..."
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
        
        {!loading && filteredJobs.length > 0 && (
          <Text style={styles.resultCount}>
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </Text>
        )}
        
        <FlatList
          data={filteredJobs}
          renderItem={({ item }) => <JobCard job={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={renderEmptyState}
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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  resultCount: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkGray,
    marginHorizontal: SPACING.m,
    marginTop: SPACING.m,
  },
  listContent: {
    padding: SPACING.m,
    paddingTop: SPACING.s,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.l,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
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

export default JobListingsScreen;