import '@/global.css';
import { NavigationBar } from '@/components/NavigationBar';
import { store } from '@/store';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider value={DefaultTheme}>
        <View style={styles.root}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="explore" />
            <Stack.Screen name="catalog/index" />
            <Stack.Screen name="catalog/[id]" />
            <Stack.Screen name="settings" />
            <Stack.Screen
              name="auth/index"
              options={{ presentation: 'modal' }}
            />
            <Stack.Screen name="profile/index" />
          </Stack>
          <NavigationBar />
        </View>
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'relative',
  },
});
