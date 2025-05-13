import SafeScreen from "@/components/SafeScreen";
import COLORS from "@/constants/colors";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar backgroundColor={"#e8f5e9"} barStyle={"default"} />
    </SafeAreaProvider>
  );
}
