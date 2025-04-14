import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Appbar, Menu, Divider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Components
import ChatInterface from '../components/ChatInterface';

// Context
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';

// Services
import { trackScreenView } from '../services/analyticsService';

// Constants
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/theme';

const ChatScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { clearChat } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const [menuVisible, setMenuVisible] = React.useState(false);

  useEffect(() => {
    trackScreenView('ChatScreen');
  }, []);

  const handleClearChat = () => {
    clearChat();
    setMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header
        statusBarHeight={Platform.OS === 'ios' ? insets.top : 0}
        style={styles.header}
      >
        <Appbar.Content title="Asha AI Chatbot" titleStyle={styles.title} />
        
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action 
              icon="dots-vertical" 
              color={COLORS.white} 
              onPress={() => setMenuVisible(true)}
            />
          }
          contentStyle={styles.menuContent}
        >
          <Menu.Item 
            onPress={handleClearChat} 
            title="Clear Chat" 
            leadingIcon="trash-can-outline" 
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('JobListings');
            }}
            title="Browse Jobs"
            leadingIcon="briefcase-outline"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('Events');
            }}
            title="View Events"
            leadingIcon="calendar-outline"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('Mentorship');
            }}
            title="Find Mentors"
            leadingIcon="account-group-outline"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('Settings');
            }}
            title="Settings"
            leadingIcon="cog-outline"
          />
        </Menu>
      </Appbar.Header>
      
      <ChatInterface navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { height: 2, width: 0 },
  },
  title: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  menuContent: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginTop: SPACING.s,
  },
});

export default ChatScreen;