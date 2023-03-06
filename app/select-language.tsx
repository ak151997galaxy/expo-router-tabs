import { useNavigation, useRouter } from "expo-router";
import * as React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { useStore } from "../src/store";
import { LanguageAvailableType } from "../src/types";

const DEFAULT_LANGUAGES = [
  {
    code: "en",
    name: "English",
    letter: "A",
  },
  {
    code: "hi",
    name: "हिंदी",
    letter: "अ",
  },
  {
    code: "te",
    name: "తెలుగు",
    letter: "అ",
  },
  {
    code: "pa",
    name: "ਪੰਜਾਬੀ",
    letter: "ਏ",
  },
  {
    code: "mr",
    name: "मराठी",
    letter: "ए",
  },
];

export default function SelectLanguage() {
  const router = useRouter();

  const navigation = useNavigation();

  const { languagesAvailable, setSelectedLanguage } = useStore((state) => ({
    languagesAvailable: state.languagesAvailable,
    setSelectedLanguage: state.setSelectedLanguage,
  }));

  const [selected, setSelected] = React.useState(false);

  React.useEffect(() => {
    if (selected) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        router.replace("/");
      }
    }
  }, [navigation, router, selected]);

  const handleLanguageSelection = React.useCallback(() => {
    setSelectedLanguage("en");
    setSelected(true);
  }, [setSelectedLanguage]);

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text>Select Language</Text>
      </View>
      <Button title="Continue" onPress={handleLanguageSelection} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 36,
  },
  center: {
    justifyContent: "center",
    flex: 1,
  },
  gridRow: {
    justifyContent: "center",
  },
});
