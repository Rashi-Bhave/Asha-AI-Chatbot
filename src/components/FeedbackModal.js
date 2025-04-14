import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Modal,
  Portal,
  Text,
  TextInput,
  Button,
  Checkbox,
  Divider,
} from 'react-native-paper';
import * as Haptics from 'expo-haptics';

// Services
import { submitFeedback } from '../services/analyticsService';

// Constants
import { COLORS } from '../constants/colors';
import { SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const FeedbackModal = ({ visible, onDismiss, messageId }) => {
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const feedbackOptions = [
    { id: 'inaccurate', label: 'Inaccurate information' },
    { id: 'biased', label: 'Contains gender bias' },
    { id: 'irrelevant', label: 'Irrelevant to my question' },
    { id: 'unhelpful', label: 'Not helpful' },
    { id: 'other', label: 'Other issue' },
  ];

  const handleSubmit = async () => {
    if (!feedbackType) return;
    
    setIsSubmitting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    try {
      await submitFeedback({
        messageId,
        feedbackType,
        feedbackText,
        timestamp: new Date().toISOString(),
      });
      
      setSubmitted(true);
      
      // Reset after 2 seconds and close
      setTimeout(() => {
        handleReset();
        onDismiss();
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFeedbackType('');
    setFeedbackText('');
    setSubmitted(false);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {!submitted ? (
              <>
                <Text style={styles.title}>Report an issue</Text>
                <Text style={styles.subtitle}>
                  Help us improve Asha AI by letting us know what went wrong with this response.
                </Text>
                
                <Divider style={styles.divider} />
                
                <Text style={styles.sectionTitle}>What's the issue?</Text>
                
                {feedbackOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.optionContainer}
                    onPress={() => {
                      setFeedbackType(option.id);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <Checkbox
                      status={feedbackType === option.id ? 'checked' : 'unchecked'}
                      color={COLORS.primary}
                    />
                    <Text style={styles.optionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
                
                <Text style={styles.sectionTitle}>Additional details (optional)</Text>
                <TextInput
                  style={styles.textInput}
                  value={feedbackText}
                  onChangeText={setFeedbackText}
                  placeholder="Please provide more details about the issue..."
                  multiline
                  numberOfLines={4}
                  mode="outlined"
                  outlineColor={COLORS.border}
                  activeOutlineColor={COLORS.primary}
                />
                
                <View style={styles.buttonContainer}>
                  <Button
                    mode="outlined"
                    onPress={onDismiss}
                    style={styles.cancelButton}
                    labelStyle={styles.cancelButtonText}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    labelStyle={styles.submitButtonText}
                    loading={isSubmitting}
                    disabled={!feedbackType || isSubmitting}
                  >
                    Submit
                  </Button>
                </View>
              </>
            ) : (
              <View style={styles.successContainer}>
                <Text style={styles.successTitle}>Thank you!</Text>
                <Text style={styles.successText}>
                  Your feedback has been submitted and will help us improve Asha AI.
                </Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: COLORS.white,
    margin: SPACING.m,
    borderRadius: 12,
    ...SHADOWS.medium,
    maxHeight: '80%',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.l,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkGray,
    marginTop: SPACING.s,
  },
  divider: {
    marginVertical: SPACING.m,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subtitle,
    marginVertical: SPACING.m,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  optionText: {
    ...TYPOGRAPHY.body,
    marginLeft: SPACING.s,
  },
  textInput: {
    backgroundColor: COLORS.white,
    marginTop: SPACING.s,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.l,
  },
  cancelButton: {
    borderColor: COLORS.gray,
    marginRight: SPACING.m,
  },
  cancelButtonText: {
    color: COLORS.darkGray,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
  submitButtonText: {
    color: COLORS.white,
  },
  successContainer: {
    padding: SPACING.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.success,
    marginBottom: SPACING.m,
  },
  successText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
  },
});

export default FeedbackModal;