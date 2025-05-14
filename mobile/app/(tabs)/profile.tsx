import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useAuthStore } from '../../stores/auth.store';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/assets/styles/profile.styles';
import ProfileHeader from '@/components/profile-header';
import LogoutButton from '@/components/logout-button';
import COLORS from '@/constants/colors';

export default function ProfileScreen() {
  const { accessToken } = useAuthStore();
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={18}
          color={i <= rating ? 'gold' : 'gray'}
        />
      );
    }
    return stars;
  };

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/books/my`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setBooks(data.books);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDeleteConfirm = async (bookId: string) => {
    try {
      Alert.alert('Delete', 'Are you sure you want to delete this book?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await handleDeleteAction(bookId);
          },
        },
      ]);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleDeleteAction = async (bookId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/books/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      fetchBooks();
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await sleep(1000);
    await fetchBooks();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.bookItem}>
        <Image source={{ uri: item.image }} style={styles.bookImage} />

        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            {renderRatingStars(item.rating)}
          </View>
          <Text style={styles.bookCaption} numberOfLines={2}>
            {item.caption}
          </Text>
          <Text style={styles.bookDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteConfirm(item._id)}
        >
          <Ionicons name='trash-outline' size={24} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

      <View style={styles.booksHeader}>
        <Text style={styles.bookTitle}>My Books ({books.length})</Text>
        <TouchableOpacity>
          <Ionicons name='add' size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      {isDeleting && (
        <View className='my-2'>
          <ActivityIndicator size='large' color={COLORS.primary} />
        </View>
      )}
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.booksList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name='search-outline'
              size={24}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No books found</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            progressBackgroundColor={COLORS.background}
            colors={[COLORS.primary]}
          />
        }
      />
    </View>
  );
}
