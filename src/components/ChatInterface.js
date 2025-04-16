import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

// Components
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import FeedbackModal from './FeedbackModal';

// Context
import { ChatContext } from '../context/ChatContext';

// Constants
import { COLORS } from '../constants/colors';
import { SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const ChatInterface = ({ navigation }) => {
  const { messages, sendMessage, typing, clearChat } = useContext(ChatContext);
  const [inputText, setInputText] = useState('');
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0 && !typing) {
      scrollToBottom();
    }
  }, [messages, typing]);

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sendMessage(inputText);
    setInputText('');
    
    // Focus back on input after sending
    Keyboard.dismiss();
  };

  const handleFeedback = (messageId) => {
    setSelectedMessageId(messageId);
    setFeedbackVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleScroll = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    
    // Show scroll button if user has scrolled up a bit
    if (contentHeight - yOffset - scrollViewHeight > 200) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  const renderTypingIndicator = () => {
    if (!typing) return null;
    
    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <ActivityIndicator size="small" color={COLORS.white} />
          <Text style={styles.typingText}>Asha is typing...</Text>
        </View>
      </View>
    );
  };

  const renderEmptyChat = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Welcome to Asha AI!</Text>
        <Text style={styles.emptyText}>
          I'm here to help you explore job listings, community events, 
          mentorship programs, and more. How can I assist you today?
        </Text>
        <View style={styles.suggestionContainer}>
          <TouchableOpacity 
            style={styles.suggestionButton}
            onPress={() => {
              sendMessage("Show me recent job listings");
            }}
          >
            <Text style={styles.suggestionText}>Show job listings</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.suggestionButton}
            onPress={() => {
              sendMessage("What events are happening soon?");
            }}
          >
            <Text style={styles.suggestionText}>Upcoming events</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.suggestionButton}
            onPress={() => {
              sendMessage("Tell me about mentorship programs");
            }}
          >
            <Text style={styles.suggestionText}>Mentorship programs</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.chatContainer}>
          {messages.length === 0 ? (
            renderEmptyChat()
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <ChatBubble
                  message={item}
                  onLongPress={() => handleFeedback(item.id)}
                />
              )}
              contentContainerStyle={styles.messagesContainer}
              onScroll={handleScroll}
              scrollEventThrottle={400}
              ListFooterComponent={renderTypingIndicator}
            />
          )}
          
          {showScrollButton && (
            <TouchableOpacity
              style={styles.scrollButton}
              onPress={scrollToBottom}
            >
              <IconButton
                icon="chevron-down"
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.inputContainer}>
          <MessageInput
            value={inputText}
            onChangeText={setInputText}
            onSend={handleSend}
            disabled={typing}
          />
        </View>
        
        <FeedbackModal
          visible={feedbackVisible}
          onDismiss={() => setFeedbackVisible(false)}
          messageId={selectedMessageId}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    position: 'relative',
  },
  messagesContainer: {
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.m,
    paddingBottom: SPACING.xl,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.s,
    paddingBottom: Platform.OS === 'ios' ? SPACING.m : SPACING.s,
    backgroundColor: COLORS.white,
  },
  typingContainer: {
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.m,
    alignItems: 'flex-start',
  },
  typingBubble: {
    backgroundColor: COLORS.botBubble,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    maxWidth: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  typingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    marginLeft: SPACING.s,
  },
  scrollButton: {
    position: 'absolute',
    bottom: SPACING.m,
    right: SPACING.m,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  suggestionContainer: {
    width: '100%',
    gap: SPACING.m,
  },
  suggestionButton: {
    backgroundColor: COLORS.userBubble,
    borderRadius: 20,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.l,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  suggestionText: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.primary,
  },
});

export default ChatInterface;