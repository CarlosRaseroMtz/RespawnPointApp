// app/(tabs)/_layout.tsx
import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BottomTabBar from "../../src/components/bottom-tab-bar";

export default function TabsLayout() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
        <BottomTabBar />
      </View>
    </SafeAreaProvider>
  );
}
