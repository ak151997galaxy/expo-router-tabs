import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export const unstable_settings = {
  initialRouteName: "(home)",
};

export default function TabLayout() {
  const SCREEN_OPTIONS = React.useMemo(
    () => ({
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: "#ff9500",
    }),
    []
  );

  return (
    <Tabs backBehavior="history" screenOptions={SCREEN_OPTIONS}>
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          tabBarTestID: "HomeTab",
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarTestID: "ProfileTab",
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
  },
});
