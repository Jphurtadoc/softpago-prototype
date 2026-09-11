import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import {
  dictionaryNamespaces,
  dictionaryResources,
  supportedLocales,
  type AppLocale,
} from '@/dictionaries'

export const defaultLocale: AppLocale = 'es'
export { supportedLocales }
export type { AppLocale }

const LOCALE_STORAGE_KEY = 'softpago.locale'

function readStoredLocale(): AppLocale {
  if (typeof window === 'undefined') return defaultLocale
  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  if (
    storedLocale === 'es' ||
    storedLocale === 'en' ||
    storedLocale === 'pt'
  ) {
    return storedLocale
  }
  return defaultLocale
}

/**
 * Maps an i18next language code to a supported app locale.
 */
export function resolveAppLocale(language: string | undefined): AppLocale {
  const baseLanguage = (language ?? defaultLocale).split('-')[0]
  if (
    baseLanguage === 'es' ||
    baseLanguage === 'en' ||
    baseLanguage === 'pt'
  ) {
    return baseLanguage
  }
  return defaultLocale
}

/**
 * Changes the active locale and persists the preference.
 */
export async function persistAppLocale(locale: AppLocale): Promise<void> {
  await i18n.changeLanguage(locale)
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}

void i18n.use(initReactI18next).init({
  resources: dictionaryResources,
  lng: readStoredLocale(),
  fallbackLng: defaultLocale,
  supportedLngs: [...supportedLocales],
  ns: [...dictionaryNamespaces],
  defaultNS: 'auth/login',
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
})

export default i18n
