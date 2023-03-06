import { ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useStore } from "../src/store";

const theme = {
  dark: false,
  colors: {
    primary: "#0079f3",
    background: "#0079f3",
    card: "#0079f3",
    text: "#333333",
    border: "rgb(199, 199, 204)",
    notification: "rgb(255, 69, 58)",
  },
};

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function useProtectedRoute(selectedLanguage: string | undefined) {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    if (!selectedLanguage) {
      router.replace("/select-language");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments, selectedLanguage]);
}

export default function RootLayout() {
  const { selectedLanguage } = useStore((state) => ({
    selectedLanguage: state.selectedLanguage,
  }));

  useProtectedRoute(selectedLanguage);

  return <BaseLayout />;
}

function BaseLayout() {
  return (
    <ThemeProvider value={theme}>
      <StatusBar style="light" translucent={false} backgroundColor="#0079f3" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="location" options={{ headerShown: false }} />
        <Stack.Screen
          name="select-language"
          options={{
            headerShown: false,
            title: "Select Language",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
