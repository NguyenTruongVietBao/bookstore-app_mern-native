import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      initialRouteName='home'
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        headerTitleStyle: {
          color: Colors.textPrimary,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingTop: 5,
          paddingBottom: insets.bottom,
        },
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='create'
        options={{
          headerShown: false,
          tabBarLabel: 'Tạo mới',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='add-circle-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          headerShown: false,
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='person-outline' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
