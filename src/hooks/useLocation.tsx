import { useFocusEffect } from "@react-navigation/core";
import { useRouter } from "expo-router";
import * as React from "react";
import { PERMISSIONS } from "react-native-permissions";
import { useStore } from "../store";

export default function useLocation(required = true) {
  const router = useRouter();

  const { finePermission, backgroundPermission } = useStore((state) => ({
    finePermission:
      state.permissions?.[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
    backgroundPermission:
      state.permissions?.[PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION],
  }));

  const locationPermission = React.useRef<boolean | void>();

  useFocusEffect(
    React.useCallback(() => {
      console.log("times render use focus effect");
      router.push("/location");
    }, [])
  );

  return {
    finePermission,
    backgroundPermission,
    locationPermission: locationPermission.current,
  };
}
