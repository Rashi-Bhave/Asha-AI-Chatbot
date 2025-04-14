import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import {
  Appbar,
  List,
  Divider,
  Text,
  Button,
  RadioButton,
  Dialog,
  Portal,
  Snackbar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

// Context
import { AuthContext } from '../context/AuthContext';

// Services
import { loadSettings, saveSettings, clearChat, clearAllStorage } from '../services/storageService';
import { trackScreenView, trackEvent } from '../services/analyticsService';

// Constants
import { COLORS } from '../constants/colors';
import { SPACING, TYPOGRAPHY } from '../constants/theme';

const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'en',
    fontSize: 'medium',
    analyticsEnabled: true,
  });
  
  const [loading, setLoading] = useState(true);
  const [fontSizeDialogVisible, setFontSizeDialogVisible] = useState(false);
  const [languageDialogVisible, setLanguageDialogVisible] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  
  useEffect(() => {
    trackScreenView('SettingsScreen');
    loadUserSettings();
  }, []);
  
  const loadUserSettings = async () => {
    try {
      const savedSettings = await loadSettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      setLoading(false);
    }
  };
  
  const updateSetting = async (key, value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    
    try {
      await saveSettings(updatedSettings);
      trackEvent('setting_updated', { setting: key, value });
    } catch (error) {
      console.error(`Error saving ${key} setting:`, error);
    }
  };
  
  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to clear all chat history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            try {
              await clearChat();
              setSnackbar({ visible: true, message: 'Chat history cleared' });
              trackEvent('chat_history_cleared');
            } catch (error) {
              console.error('Error clearing chat history:', error);
              setSnackbar({ visible: true, message: 'Failed to clear chat history' });
            }
          },
        },
      ]
    );
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            try {
              await logout();
              trackEvent('user_logged_out');
            } catch (error) {
              console.error('Error logging out:', error);
              setSnackbar({ visible: true, message: 'Failed to logout' });
            }
          },
        },
      ]
    );
  };
  
  const renderFontSizeDialog = () => {
    const fontSizeOptions = [
      { label: 'Small', value: 'small' },
      { label: 'Medium', value: 'medium' },
      { label: 'Large', value: 'large' },
    ];
    
    return (
      <Portal>
        <Dialog
          visible={fontSizeDialogVisible}
          onDismiss={() => setFontSizeDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Text Size</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={value => {
                updateSetting('fontSize', value);
                setFontSizeDialogVisible(false);
              }}
              value={settings.fontSize}
            >
              {fontSizeOptions.map(option => (
                <RadioButton.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  color={COLORS.primary}
                />
              ))}
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setFontSizeDialogVisible(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };
  
  const renderLanguageDialog = () => {
    const languageOptions = [
      { label: 'English', value: 'en' },
      { label: 'Hindi', value: 'hi' },
      { label: 'Tamil', value: 'ta' },
      { label: 'Telugu', value: 'te' },
      { label: 'Kannada', value: 'kn' },
    ];
    
    return (
      <Portal>
        <Dialog
          visible={languageDialogVisible}
          onDismiss={() => setLanguageDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Language</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={value => {
                updateSetting('language', value);
                setLanguageDialogVisible(false);
              }}
              value={settings.language}
            >
              {languageOptions.map(option => (
                <RadioButton.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  color={COLORS.primary}
                />
              ))}
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLanguageDialogVisible(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Settings" titleStyle={styles.headerTitle} />
      </Appbar.Header>
      
      <ScrollView style={styles.container}>
        {user && (
          <View style={styles.profileSection}>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
            <Button
              mode="contained"
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              Logout
            </Button>
          </View>
        )}
        
        <List.Section>
          <List.Subheader>Preferences</List.Subheader>
          
          <List.Item
            title="Notifications"
            description="Receive push notifications"
            left={props => <List.Icon {...props} icon="bell-outline" />}
            right={props => (
              <Switch
                value={settings.notifications}
                onValueChange={value => updateSetting('notifications', value)}
                color={COLORS.primary}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Dark Mode"
            description="Use dark theme"
            left={props => <List.Icon {...props} icon="moon-outline" />}
            right={props => (
              <Switch
                value={settings.darkMode}
                onValueChange={value => updateSetting('darkMode', value)}
                color={COLORS.primary}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Text Size"
            description={`${settings.fontSize.charAt(0).toUpperCase() + settings.fontSize.slice(1)}`}
            left={props => <List.Icon {...props} icon="text" />}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFontSizeDialogVisible(true);
            }}
          />
          
          <Divider />
          
          <List.Item
            title="Language"
            description={settings.language === 'en' ? 'English' : 
              settings.language === 'hi' ? 'Hindi' : 
              settings.language === 'ta' ? 'Tamil' : 
              settings.language === 'te' ? 'Telugu' : 
              settings.language === 'kn' ? 'Kannada' : 'English'}
            left={props => <List.Icon {...props} icon="translate" />}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setLanguageDialogVisible(true);
            }}
          />
        </List.Section>
        
        <List.Section>
          <List.Subheader>Privacy & Data</List.Subheader>
          
          <List.Item
            title="Analytics"
            description="Help improve the app by sharing usage data"
            left={props => <List.Icon {...props} icon="chart-line" />}
            right={props => (
              <Switch
                value={settings.analyticsEnabled}
                onValueChange={value => updateSetting('analyticsEnabled', value)}
                color={COLORS.primary}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Clear Chat History"
            description="Delete all conversations"
            left={props => <List.Icon {...props} icon="trash-outline" color={COLORS.error} />}
            onPress={handleClearChat}
          />
        </List.Section>
        
        <List.Section>
          <List.Subheader>About</List.Subheader>
          
          <List.Item
            title="About Asha AI"
            description="Learn more about Asha AI"
            left={props => <List.Icon {...props} icon="information-outline" />}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate('About');
            }}
          />
          
          <Divider />
          
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="shield-outline" />}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Linking.openURL('https://jobsforher.org/privacy-policy');
            }}
          />
          
          <Divider />
          
          <List.Item
            title="Terms of Service"
            left={props => <List.Icon {...props} icon="file-document-outline" />}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Linking.openURL('https://jobsforher.org/terms-of-service');
            }}
          />
        </List.Section>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
      
      {renderFontSizeDialog()}
      {renderLanguageDialog()}
      
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
      >
        {snackbar.message}
      </Snackbar>
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
  },
  profileSection: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.l,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    ...TYPOGRAPHY.body,
    color: COLORS.darkGray,
  },
  logoutButton: {
    backgroundColor: COLORS.primary,
  },
  dialog: {
    backgroundColor: COLORS.white,
  },
  versionContainer: {
    padding: SPACING.l,
    alignItems: 'center',
  },
  versionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.gray,
  },
});

export default SettingsScreen;