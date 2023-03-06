import { Permission, PermissionStatus } from "react-native-permissions";

export type AllOrNone<T> = Required<T> | Partial<Record<keyof T, undefined>>;

export interface LanguageAvailableType {
  code: string;
  name: string;
  letter: string;
}

export interface AppCacheType {
  selectedLanguage?: string;
  languagesAvailable?: LanguageAvailableType[];
  permissions?: Record<Permission[number], PermissionStatus>;
}
