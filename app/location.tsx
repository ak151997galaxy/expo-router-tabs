import React from "react";
import { Alert, Linking, View, StyleSheet, Text, Button } from "react-native";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";
import useLocation from "../src/hooks/useLocation";
import { useStore } from "../src/store";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityAction, startActivityAsync } from "expo-intent-launcher";
import { useNavigation, useRouter } from "expo-router";

const preventBackListener = (e: any) => {
  e.preventDefault();
};

export default function Location() {
  const navigation = useNavigation();

  const router = useRouter();

  const [isCheckingForPermissions, setIsCheckingForPermissions] =
    React.useState(false);

  const { setPermissions, backgroundLocationPermission } = useStore(
    (state) => ({
      setPermissions: state.setPermissions,
      backgroundLocationPermission:
        state.permissions?.[PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION],
    })
  );

  const { locationPermission } = useLocation(false);

  React.useEffect(() => {
    navigation.addListener("beforeRemove", preventBackListener);

    return () => navigation.removeListener("beforeRemove", preventBackListener);
  }, [navigation]);

  const handleLocationPermission = React.useCallback(() => {
    if (locationPermission) {
      navigation.removeListener("beforeRemove", preventBackListener);
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        router.push("/");
      }
    }
  }, [locationPermission, navigation, router]);

  useFocusEffect(
    React.useCallback(handleLocationPermission, [handleLocationPermission])
  );

  const ensureFineLocationPermission = React.useCallback(() => {
    return request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((status) => {
      setPermissions({
        [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]: status,
      });
      if (status === RESULTS.BLOCKED || status === RESULTS.DENIED) {
        Alert.alert(
          "Location Permission Denied",
          "needs the permission to fetch your location",
          [
            {
              text: "Cancel",
            },
            {
              text: "Ok",
              onPress:
                status === RESULTS.BLOCKED ? Linking.openSettings : undefined,
            },
          ],
          {
            cancelable: false,
          }
        );
        return false;
      } else {
        return true;
      }
    });
  }, [setPermissions]);

  const makeBackgroundLocationRequest = React.useCallback(() => {
    return request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION).then(
      (status) => {
        setPermissions({
          [PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION]: status,
        });
        if (status === RESULTS.BLOCKED || status === RESULTS.DENIED) {
          Alert.alert(
            "Location Permission Denied",
            "needs the permission to fetch your location",
            [
              {
                text: "Cancel",
              },
              {
                text: status === RESULTS.BLOCKED ? "Ok" : "Retry",
                onPress:
                  status === RESULTS.BLOCKED
                    ? Linking.openSettings
                    : makeBackgroundLocationRequest,
              },
            ],
            {
              cancelable: false,
            }
          );
        } else {
          return status === RESULTS.GRANTED;
        }
      }
    );
  }, [setPermissions]);

  const ensureBackgroundLocationPermission = React.useCallback(() => {
    if (
      backgroundLocationPermission === RESULTS.UNAVAILABLE ||
      backgroundLocationPermission === RESULTS.GRANTED
    ) {
      return true;
    } else {
      Alert.alert(
        "Enable All Time Location Access",
        "needs your location to provide you the best possible experience",
        [
          {
            text: "Ok",
            onPress: makeBackgroundLocationRequest,
          },
        ]
      );
    }
  }, [backgroundLocationPermission, makeBackgroundLocationRequest]);

  const requestLocationProviders = React.useCallback(
    () => startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS),
    []
  );

  const ensureLocationIsEnabled = React.useCallback((): boolean | void => {
    Alert.alert(
      "Location Permission Denied",
      "needs the permission to fetch your location",
      [
        {
          text: "Cancel",
        },
        {
          text: "Ok",
          onPress: requestLocationProviders,
        },
      ],
      {
        cancelable: false,
      }
    );
  }, [requestLocationProviders]);

  const handleSubmit = React.useCallback(() => {
    setIsCheckingForPermissions(true);
    if (ensureLocationIsEnabled()) {
      ensureFineLocationPermission()
        .then((result) => {
          if (result) {
            return ensureBackgroundLocationPermission();
          }
        })
        .finally(() => setIsCheckingForPermissions(false));
    }
  }, [
    ensureBackgroundLocationPermission,
    ensureFineLocationPermission,
    ensureLocationIsEnabled,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text>Location</Text>
      </View>
      <Button
        title="Allow"
        onPress={handleSubmit}
        disabled={isCheckingForPermissions}
      />
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
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
