import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import {
  Appbar,
  Text,
  Searchbar,
  Chip,
  Divider,
  Button,
  IconButton,
  Card,
  Menu,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

// Components
import EventCard from '../components/EventCard';
import LoadingIndicator from '../components/LoadingIndicator';

// API
import { fetchEvents } from '../api/eventsApi';

// Services
import { trackScreenView, trackEvent } from '../services/analyticsService';

// Constants
import { COLORS } from '../constants/colors';
import { SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

// Utility
import { formatDate } from '../utils/dateUtils';

const EventsScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    timeframe: null,
    format: null,
  });
  
  // Available filter options
  const filterOptions = {
    categories: ['Workshop', 'Webinar', 'Conference', 'Networking', 'Career Fair', 'Panel Discussion'],
    timeframes: ['This Week', 'This Month', 'Upcoming'],
    formats: ['In-Person', 'Virtual'],
  };
  
  useEffect(() => {
    trackScreenView('EventsScreen');
    loadEvents();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, events]);
  
  const loadEvents = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents);
      setLoading(false);
    } catch (error) {
      console.error('Error loading events:', error);
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  
  const applyFilters = () => {
    let result = [...events];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((event) => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query)
      );
    }
    
    // Apply category filters
    if (filters.categories.length > 0) {
      result = result.filter((event) => 
        filters.categories.some(category => 
          event.category.toLowerCase().includes(category.toLowerCase())
        )
      );
    }
    
    // Apply timeframe filter
    if (filters.timeframe) {
      const now = new Date();
      
      if (filters.timeframe === 'This Week') {
        // Events in the next 7 days
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        result = result.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= now && eventDate <= nextWeek;
        });
      } else if (filters.timeframe === 'This Month') {
        // Events in the next 30 days
        const nextMonth = new Date(now);
        nextMonth.setDate(nextMonth.getDate() + 30);
        
        result = result.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= now && eventDate <= nextMonth;
        });
      } else if (filters.timeframe === 'Upcoming') {
        // All future events
        result = result.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= now;
        });
      }
    }
    
    // Apply format filter
    if (filters.format) {
      if (filters.format === 'Virtual') {
        result = result.filter((event) => event.virtual);
      } else if (filters.format === 'In-Person') {
        result = result.filter((event) => !event.virtual);
      }
    }
    
    // Sort by date (closest first)
    result.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setFilteredEvents(result);
  };
  
  const toggleCategoryFilter = (category) => {
    setFilters(prevFilters => {
      const updatedCategories = [...prevFilters.categories];
      
      if (updatedCategories.includes(category)) {
        // Remove the category
        const index = updatedCategories.indexOf(category);
        updatedCategories.splice(index, 1);
      } else {
        // Add the category
        updatedCategories.push(category);
      }
      
      trackEvent('event_filter_applied', { 
        type: 'category', 
        value: category, 
        active: !prevFilters.categories.includes(category) 
      });
      
      return {
        ...prevFilters,
        categories: updatedCategories,
      };
    });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const setTimeframeFilter = (timeframe) => {
    setFilters(prevFilters => {
      const newTimeframe = prevFilters.timeframe === timeframe ? null : timeframe;
      
      trackEvent('event_filter_applied', { 
        type: 'timeframe', 
        value: timeframe, 
        active: newTimeframe !== null 
      });
      
      return {
        ...prevFilters,
        timeframe: newTimeframe,
      };
    });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const setFormatFilter = (format) => {
    setFilters(prevFilters => {
      const newFormat = prevFilters.format === format ? null : format;
      
      trackEvent('event_filter_applied', { 
        type: 'format', 
        value: format, 
        active: newFormat !== null 
      });
      
      return {
        ...prevFilters,
        format: newFormat,
      };
    });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const clearFilters = () => {
    setFilters({
      categories: [],
      timeframe: null,
      format: null,
    });
    setSearchQuery('');
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    trackEvent('event_filters_cleared');
  };
  
  const renderFilterSection = () => {
    if (!filterVisible) return null;
    
    return (
      <View style={styles.filterSection}>
        <View style={styles.filterCategory}>
          <Text style={styles.filterTitle}>Event Type</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScrollContainer}
          >
            {filterOptions.categories.map((category) => (
              <Chip
                key={category}
                selected={filters.categories.includes(category)}
                onPress={() => toggleCategoryFilter(category)}
                style={[
                  styles.filterChip,
                  filters.categories.includes(category) && styles.selectedChip
                ]}
                textStyle={[
                  styles.filterChipText,
                  filters.categories.includes(category) && styles.selectedChipText
                ]}
              >
                {category}
              </Chip>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.filterCategory}>
          <Text style={styles.filterTitle}>When</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScrollContainer}
          >
            {filterOptions.timeframes.map((timeframe) => (
              <Chip
                key={timeframe}
                selected={filters.timeframe === timeframe}
                onPress={() => setTimeframeFilter(timeframe)}
                style={[
                  styles.filterChip,
                  filters.timeframe === timeframe && styles.selectedChip
                ]}
                textStyle={[
                  styles.filterChipText,
                  filters.timeframe === timeframe && styles.selectedChipText
                ]}
              >
                {timeframe}
              </Chip>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.filterCategory}>
          <Text style={styles.filterTitle}>Format</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScrollContainer}
          >
            {filterOptions.formats.map((format) => (
              <Chip
                key={format}
                selected={filters.format === format}
                onPress={() => setFormatFilter(format)}
                style={[
                  styles.filterChip,
                  filters.format === format && styles.selectedChip
                ]}
                textStyle={[
                  styles.filterChipText,
                  filters.format === format && styles.selectedChipText
                ]}
              >
                {format}
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
        <Ionicons name="calendar-outline" size={64} color={COLORS.gray} />
        <Text style={styles.emptyTitle}>No events found</Text>
        <Text style={styles.emptyText}>
          {searchQuery || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== null)
            ? "Try adjusting your filters or search query."
            : "There are no events available at the moment. Please check back later."}
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
    if (filteredEvents.length === 0) return null;
    
    return (
      <View style={styles.listHeader}>
        <Text style={styles.resultCount}>
          {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
        </Text>
        <Text style={styles.sortedByText}>Sorted by date (soonest first)</Text>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Events & Workshops" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="calendar-month" color={COLORS.white} />
      </Appbar.Header>
      
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search events, workshops, webinars..."
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
          data={filteredEvents}
          renderItem={({ item }) => <EventCard event={item} />}
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
  sortedByText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.gray,
    marginTop: 2,
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

export default EventsScreen;