import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import styles from '@/assets/styles/login.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';

const RegisterScreen = () => {
  const { register, isLoading, user } = useAuthStore();
  const [email, setEmail] = useState('bao@gmail.com');
  const [username, setUsername] = useState('vietbao');
  const [password, setPassword] = useState('123123');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    const result = await register(username, email, password);
    if (!result.success) {
      Alert.alert(
        'Registration Failed',
        result.error || 'Something went wrong'
      );
      return;
    }
    Alert.alert('Register Success', 'You can now log in now !');
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Bookworm</Text>
          <Text style={styles.subtitle}>Share your favorites books</Text>
        </View>
        <View style={styles.formContainer}>
          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name='people-outline'
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Enter your username'
                placeholderTextColor={COLORS.placeholderText}
                value={username}
                onChangeText={setUsername}
                autoCapitalize='none'
              />
            </View>
          </View>
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
            onPress={handleRegister}
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={'#fff'} />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>
          {/* Don't have account */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already an account? </Text>
            <Link href='/(auth)/login' asChild>
              <TouchableOpacity>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;
