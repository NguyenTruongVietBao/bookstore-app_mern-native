import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import styles from '@/assets/styles/create.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors';
import * as FileSystem from 'expo-file-system';
import { useAuthStore } from '@/stores/auth.store';

export default function CreateScreen() {
  const { accessToken } = useAuthStore();
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<string | null>('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [rating, setRating] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleImage = async () => {
    try {
      // Request permission
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission not granted to access media library');
          return;
        }
      }
      // Pick image
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
        base64: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64);
        } else {
          const base64 = await FileSystem.readAsStringAsync(
            result.assets[0].uri,
            {
              encoding: FileSystem.EncodingType.Base64,
            }
          );
          setImageBase64(base64);
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const handleCreate = async () => {
    setIsLoading(true);
    if (!title || !caption || !imageBase64) {
      Alert.alert('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    try {
      // Get file extension from image uri
      const fileExtension = image?.split('.');
      const fileType = fileExtension
        ? fileExtension[fileExtension.length - 1]
        : '';
      const imageType = fileType
        ? `image/${fileType.toLowerCase()}`
        : 'image/jpeg';
      const fullImageUri = `data:${imageType};base64,${imageBase64}`;
      // Upload image to server
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/books`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            caption,
            image: fullImageUri,
            rating: rating.toString(),
          }),
        }
      );
      console.log(response);

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      const data = await response.json();
      console.log(data);
      Alert.alert('Success', 'Post created successfully');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setIsLoading(false);
      setTitle('');
      setCaption('');
      setImage(null);
      setImageBase64(null);
      router.push('/profile');
    }
  };

  const renderRatingPicker = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={32}
            color={i <= rating ? '#FFD700' : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create a new post</Text>
            <Text style={styles.subtitle}>
              Share your thoughts with the world
            </Text>
          </View>
          {/* Form */}
          <View style={styles.form}>
            {/* Title */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name='book-outline'
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder='Enter your title'
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>
            {/* Rating */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Rating</Text>
              {renderRatingPicker()}
            </View>
            {/* Image */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Image</Text>
              <TouchableOpacity
                style={styles.imagePicker}
                onPress={handleImage}
              >
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons
                      name='image-outline'
                      size={40}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.placeholderText}>
                      Tap to upload image
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            {/* Caption */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
              <TextInput
                style={styles.textArea}
                placeholder='Enter your caption'
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>
            {/* Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleCreate}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size='large' color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name='paper-plane-outline'
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Create</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
