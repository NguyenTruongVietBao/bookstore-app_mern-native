import { View, Text } from 'react-native';
import React from 'react';
import { useAuthStore } from '@/stores/auth.store';
import styles from '@/assets/styles/profile.styles';
import { Image } from 'expo-image';

export default function ProfileHeader() {
  const { user } = useAuthStore();
  if (!user) return null;

  return (
    <View style={styles.profileHeader}>
      <Image source={{ uri: user?.profileImage }} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.memberSince}>
          Joined: {new Date(user.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}
