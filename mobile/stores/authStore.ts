import { create } from "zustand";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  username: string;
  email: string;
  password: string;
}

interface AuthState {
  user: User;
  token: string;
  isLoading: boolean;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean }>;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const ASYNC_USER_KEY = process.env.EXPO_PUBLIC_ASYNC_USER_KEY;
const ASYNC_TOKEN_KEY = process.env.EXPO_PUBLIC_ASYNC_TOKEN_KEY;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async (username, email, password) => {
    console.log("register", username, email, password);
    set({ isLoading: true });
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        username,
        email,
        password,
      });
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      console.error("Error registering user:", error);
    }
  },
}));
