import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Keyboard,
  Platform,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

// Constants
import { COLORS } from '../constants/colors';
import { SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

const MessageInput = ({ value, onChangeText, onSend, disabled }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const animatedHeight = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsFocused(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsFocused(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    // Animate input height based on content
    if (value.length > 50 || value.includes('\n')) {
      Animated.timing(animatedHeight, {
        toValue: 100,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: 50,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [value, animatedHeight]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSend = () => {
    if (disabled) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend();
    
    // Reset input height after sending
    Animated.timing(animatedHeight, {
      toValue: 50,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          { height: animatedHeight },
        ]}
      >
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Message Asha AI..."
          placeholderTextColor={COLORS.gray}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline
          maxLength={500}
          editable={!disabled}
        />
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!value.trim() || disabled) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!value.trim() || disabled}
        >
          <IconButton
            icon="send"
            size={20}
            iconColor={COLORS.white}
          />
        </TouchableOpacity>
      </Animated.View>
      
      {Platform.OS === 'ios' && (
        <View style={styles.iosBottomPadding} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: SPACING.m,
    ...SHADOWS.small,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    maxHeight: 100,
    paddingTop: Platform.OS === 'ios' ? 12 : 8,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    marginLeft: SPACING.xs,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  iosBottomPadding: {
    height: 5,
  },
});

export default MessageInput;