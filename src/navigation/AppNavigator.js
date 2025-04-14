import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import ChatScreen from '../screens/ChatScreen';
import JobListingsScreen from '../screens/JobListingsScreen';
import EventsScreen from '../screens/EventsScreen';
import MentorshipScreen from '../screens/MentorshipScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';

// Constants
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/theme';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigators for each tab
const ChatStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="ChatHome" component={ChatScreen} />
  </Stack.Navigator>
);

const JobsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="JobListings" component={JobListingsScreen} />
  </Stack.Navigator>
);

const EventsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="EventsHome" component={EventsScreen} />
  </Stack.Navigator>
);

const MentorshipStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="MentorshipHome" component={MentorshipScreen} />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="SettingsHome" component={SettingsScreen} />
    <Stack.Screen name="About" component={AboutScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Jobs') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Events') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Mentorship') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          ...TYPOGRAPHY.caption,
          marginBottom: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="Jobs" component={JobsStack} />
      <Tab.Screen name="Events" component={EventsStack} />
      <Tab.Screen name="Mentorship" component={MentorshipStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};

export default AppNavigator;