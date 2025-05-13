// app/+not-found.tsx

import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '@/assets/styles/create.styles';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>This screen doesn't exist.</Text>
      <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
        <Text>Go to home!</Text>
      </TouchableOpacity>
    </View>
  );
}
