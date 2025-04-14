import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { IconButton, Card } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

// Components
import JobCard from './JobCard';
import EventCard from './EventCard';
import MentorshipCard from './MentorshipCard';

// Services
import { trackEvent } from '../services/analyticsService';

// Constants
import { COLORS } from '../constants/colors';
import { SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const ChatBubble = ({ message, onLongPress }) => {
  const [showActions, setShowActions] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  
  const isUser = message.sender === 'user';
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const animateIn = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (showActions) {
      setShowActions(false);
      animateOut();
    } else {
      setShowActions(true);
      animateIn();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(message.text);
    setShowActions(false);
    animateOut();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    trackEvent('message_copied', { isUserMessage: isUser });
  };

  const renderAttachment = () => {
    if (!message.attachment) return null;

    switch (message.attachment.type) {
      case 'job':
        return <JobCard job={message.attachment.data} />;
      case 'event':
        return <EventCard event={message.attachment.data} />;
      case 'mentorship':
        return <MentorshipCard mentorship={message.attachment.data} />;
      case 'image':
        return (
          <Image
            source={{ uri: message.attachment.data.url }}
            style={styles.attachmentImage}
            resizeMode="cover"
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.botContainer
    ]}>
      <Pressable
        onPress={handlePress}
        onLongPress={() => {
          if (!isUser) {
            onLongPress();
          }
        }}
        style={({ pressed }) => [
          { opacity: pressed ? 0.9 : 1 }
        ]}
      >
        <View style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.botBubble
        ]}>
          {!isUser && message.thinking && (
            <Text style={[styles.thinkingText, styles.italicText]}>
              Thinking about this...
            </Text>
          )}
          
          <Text style={[
            styles.text,
            isUser ? styles.userText : styles.botText
          ]}>
            {message.text}
          </Text>
          
          {renderAttachment()}
          
          <Text style={[
            styles.timestamp,
            isUser ? styles.userTimestamp : styles.botTimestamp
          ]}>
            {timestamp}
          </Text>
        </View>
      </Pressable>
      
      {showActions && (
        <Animated.View
          style={[
            styles.actionsContainer,
            isUser ? styles.userActionsContainer : styles.botActionsContainer,
            {
              opacity: animatedValue,
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCopy}
          >
            <IconButton
              icon="content-copy"
              size={16}
              iconColor={COLORS.white}
            />
            <Text style={styles.actionText}>Copy</Text>
          </TouchableOpacity>
          
          {!isUser && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                onLongPress();
                setShowActions(false);
                animateOut();
              }}
            >
              <IconButton
                icon="flag-outline"
                size={16}
                iconColor={COLORS.white}
              />
              <Text style={styles.actionText}>Report</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.s,
    maxWidth: '85%',
    position: 'relative',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  botContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
    ...SHADOWS.small,
  },
  userBubble: {
    backgroundColor: COLORS.userBubble,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: COLORS.botBubble,
    borderBottomLeftRadius: 4,
  },
  text: {
    ...TYPOGRAPHY.body,
  },
  userText: {
    color: COLORS.text,
  },
  botText: {
    color: COLORS.white,
  },
  timestamp: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.xs,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: COLORS.gray,
  },
  botTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  thinkingText: {
    marginBottom: SPACING.s,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  italicText: {
    fontStyle: 'italic',
  },
  attachmentImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginTop: SPACING.s,
  },
  actionsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    borderRadius: 8,
    ...SHADOWS.medium,
    backgroundColor: COLORS.darkGray,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.s,
  },
  userActionsContainer: {
    right: 0,
    bottom: -50,
  },
  botActionsContainer: {
    left: 0,
    bottom: -50,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.s,
  },
  actionText: {
    color: COLORS.white,
    ...TYPOGRAPHY.caption,
  },
});

export default ChatBubble;