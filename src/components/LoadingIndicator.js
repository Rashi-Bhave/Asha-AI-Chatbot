import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';

// Constants
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY, SPACING } from '../constants/theme';

const LoadingIndicator = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  message: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkGray,
    marginTop: SPACING.m,
    textAlign: 'center',
  },
});

export default LoadingIndicator;