import { MMKV } from "react-native-mmkv";
import { Permission, PermissionStatus } from "react-native-permissions";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import {
  AppCacheType,
  LanguageAvailableType,
} from "./types";

export const storage = new MMKV();

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.delete(name);
  },
};

interface StoreType extends AppCacheType {
  setSelectedLanguage: (selectedLanguage: string) => void;
  setLanguagesAvailable: (languagesAvailable: LanguageAvailableType[]) => void;
  setPermissions: (
    permissions: Record<Permission[number], PermissionStatus>
  ) => void;
}

export const useStore = create<StoreType, [["zustand/persist", StoreType]]>(
  persist(
    (set, get) => ({
      setSelectedLanguage: (selectedLanguage: string) =>
        set({ selectedLanguage }),
      setLanguagesAvailable: (languagesAvailable: LanguageAvailableType[]) =>
        set({ languagesAvailable }),
      setPermissions: (
        permissions: Record<Permission[number], PermissionStatus>
      ) => {
        const oldPermissions = get().permissions;
        set({
          permissions: {
            ...oldPermissions,
            ...permissions,
          },
        });
      },
    }),
    {
      name: "localCache", // unique name
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
