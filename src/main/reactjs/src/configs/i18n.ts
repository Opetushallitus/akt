import i18n, { use, changeLanguage } from 'i18next';
import {
  initReactI18next,
  useTranslation,
  UseTranslationOptions,
} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import transFI from 'public/i18n/fi-FI.json';
import transSV from 'public/i18n/sv-SE.json';
import transEN from 'public/i18n/en-GB.json';

// Defaults and resources
const langFI = 'fi-FI';
const langSV = 'sv-SE';
const langEN = 'en-GB';

const detectionOptions = {
  order: ['localStorage', 'htmlTag'],
  caches: ['localStorage'],
};

const supportedLangs = [langFI, langSV, langEN];

const resources = {
  [langFI]: {
    translation: transFI,
  },
  [langSV]: {
    translation: transSV,
  },
  [langEN]: {
    translation: transEN,
  },
};

// Check types
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof langFI;
    resources: {
      [langFI]: typeof transFI;
      [langSV]: typeof transSV;
      [langEN]: typeof transEN;
    };
  }
}

export const initI18n = () => {
  return use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources,
      detection: detectionOptions,
      fallbackLng: langFI,
      load: 'currentOnly',
      debug: process.env.NODE_ENV === 'development',
    });
};

export const useAppTranslation = (options: UseTranslationOptions<string>) => {
  // @ts-expect-error ts import fail
  return useTranslation(undefined, options);
};

export const getCurrentLang = (): string => {
  return i18n.language;
};

export const getSupportedLangs = (): string[] => {
  return supportedLangs;
};

export const changeLang = (language: string) => {
  return changeLanguage(language);
};

export const onLangChanged = (callback: (language: string) => void) => {
  return i18n.on('languageChanged', callback);
};
