import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import styles from '@/assets/styles/login.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';
const LoginScreen = () => {
  const [email, setEmail] = useState('bao@gmail.com');
  const [password, setPassword] = useState('123123');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return null;
  }

  const handleLogin = async () => {
    const result = await login(email, password);
    console.log('result', result);

    if (!result.success) {
      Alert.alert('Login Failed', result.error || 'Something went wrong');
      return;
    }
    router.push('/(tabs)/profile');
  };
  return (
    <View style={styles.container}>
      <View style={styles.topIllustration}>
        <Image
          source={require('@/assets/images/i.png')}
          style={styles.illustrationImage}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.formContainer}>
          {/* Mail */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name='mail-outline'
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Enter your email'
                placeholderTextColor={COLORS.placeholderText}
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
              />
            </View>
          </View>
          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name='lock-closed-outline'
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Enter your password'
                placeholderTextColor={COLORS.placeholderText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize='none'
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* Login buton */}
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={'#fff'} />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
          {/* Don't have account */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href={'/(auth)/register'} asChild>
              <TouchableOpacity>
                <Text style={styles.link}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
