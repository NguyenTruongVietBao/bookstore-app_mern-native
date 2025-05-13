import { create } from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: any;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string | null }>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string | null }>;
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const ASYNC_USER_KEY = process.env.EXPO_PUBLIC_ASYNC_USER_KEY || '';
const ASYNC_TOKEN_KEY = process.env.EXPO_PUBLIC_ASYNC_TOKEN_KEY || '';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,

  register: async (username, email, password) => {
    console.log('register', username, email, password);
    set({ isLoading: true });

    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        username,
        email,
        password,
      });
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại';
      return { success: false, error: errorMessage };
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      if (response.data) {
        await AsyncStorage.setItem(
          ASYNC_USER_KEY,
          JSON.stringify(response.data.data.user)
        );
        await AsyncStorage.setItem(
          ASYNC_TOKEN_KEY,
          response.data.data.accessToken
        );
        set({
          accessToken: response.data.data.accessToken,
          user: response.data.data.user,
        });
        return { success: true };
      }
      return { success: false, error: 'Đăng nhập thất bại' };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Đăng nhập thất bại';
      return { success: false, error: errorMessage };
    } finally {
      set({ isLoading: false });
    }
  },

  loadUser: async () => {
    try {
      const userJson = await AsyncStorage.getItem(ASYNC_USER_KEY);
      const token = await AsyncStorage.getItem(ASYNC_TOKEN_KEY);

      if (userJson && token) {
        const user = JSON.parse(userJson);
        set({ user, accessToken: token });
      }
    } catch (error) {
      console.error('Lỗi khi tải thông tin người dùng:', error);
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem(ASYNC_USER_KEY);
      await AsyncStorage.removeItem(ASYNC_TOKEN_KEY);
      set({ user: null, accessToken: null });
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  },

  initialize: async () => {
    set({ isLoading: true });
    try {
      const userJson = await AsyncStorage.getItem(ASYNC_USER_KEY);
      const accessToken = await AsyncStorage.getItem(ASYNC_TOKEN_KEY);

      if (userJson && accessToken) {
        const user = JSON.parse(userJson);
        set({ user, accessToken });
      }
    } catch (error) {
      console.error('Lỗi khi khởi tạo:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
