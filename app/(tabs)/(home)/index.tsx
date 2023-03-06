import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import useLocation from "../../../src/hooks/useLocation";

export default function Home() {
  useLocation();

  return (
    <View>
      <Text>Home Screens in Tabs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
  },
});
