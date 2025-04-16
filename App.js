import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Context Providers
import { AuthProvider } from './src/context/AuthContext';
import { ChatProvider } from './src/context/ChatContext';

// Navigation
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';

// Theme
import { theme } from './src/constants/theme';

// Services
import { isAuthenticated } from './src/services/storageService';

// Prevent native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          ...MaterialIcons.font,
          'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
          'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
          'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
        });
        
        // Check if user is authenticated
        const authStatus = await isAuthenticated();
        setUserAuthenticated(authStatus);
        
        // Artificial delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <ChatProvider>
            <NavigationContainer theme={theme}>
              {userAuthenticated ? <AppNavigator /> : <AuthNavigator />}
              <StatusBar style="auto" />
            </NavigationContainer>
          </ChatProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}