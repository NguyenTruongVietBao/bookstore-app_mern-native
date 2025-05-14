import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/assets/styles/profile.styles';
import { router } from 'expo-router';
import COLORS from '@/constants/colors';
export default function LogoutButton() {
  const { logout } = useAuthStore();
  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.push('/login');
        },
      },
    ]);
  };
  return (
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <Ionicons name='log-out-outline' size={24} color={COLORS.white} />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
}
