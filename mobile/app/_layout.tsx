import COLORS from '@/constants/colors';
import { useAuthStore } from '@/stores/auth.store';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { initialize, user } = useAuthStore();

  const [loaded, error] = useFonts({
    'JetBrainsMono-Medium': require('../assets/fonts/JetBrainsMono-Medium.ttf'),
  });
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    const isSignedIn = !!user;
    if (inAuthGroup && isSignedIn) {
      router.replace('/(tabs)/home');
    } else if (!inAuthGroup && !isSignedIn) {
      router.replace('/(auth)/login');
    }
  }, [segments, user, router]);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='(auth)' options={{ headerShown: false }} />
        <Stack.Screen name='+not-found' options={{ headerShown: false }} />
      </Stack>
      <StatusBar backgroundColor={COLORS.background} barStyle={'default'} />
    </SafeAreaProvider>
  );
}
