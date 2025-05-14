import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

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
          height: 65 + insets.bottom,
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
        name='search'
        options={{
          headerShown: false,
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='search-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='create'
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarItemStyle: {
            height: 60,
          },
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                position: 'absolute',
                top: -8,
                left: '50%',
                transform: [{ translateX: -20 }],
                width: 50,
                height: 50,
                borderRadius: 20,
                backgroundColor: focused ? '#e6f7ee' : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 2, height: 5 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                zIndex: 1,
              }}
            >
              <Ionicons
                name='add-circle'
                size={50}
                color={focused ? Colors.primary : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name='favorites'
        options={{
          headerShown: false,
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='heart-outline' size={size} color={color} />
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
