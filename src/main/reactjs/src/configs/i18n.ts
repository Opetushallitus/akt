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
import { APIEndpoints } from 'enums/api';
import axiosInstance from 'configs/axios';

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

// Rest API types
type I18nLanguagesResponse = {
  [langFI]: I18nLanguage[];
  [langSV]: I18nLanguage[];
  [langEN]: I18nLanguage[];
};
type I18nLanguage = {
  code: string;
  name: string;
};

export const initI18n = async () => {
  await initialize();
  await loadTranslationsFromServer();
};

const initialize = () => {
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

const loadTranslationsFromServer = () => {
  return axiosInstance
    .get<I18nLanguagesResponse>(APIEndpoints.I18nLanguages)
    .then((result) => {
      const addResource = (lng: string, i: I18nLanguage) =>
        i18n.addResource(
          lng,
          'translation',
          'akt.component.publicTranslatorFilters.languages.' + i.code,
          i.name
        );
      result.data[langFI].forEach((i) => addResource(langFI, i));
      result.data[langSV].forEach((i) => addResource(langSV, i));
      result.data[langEN].forEach((i) => addResource(langEN, i));
    });
};

export const useAppTranslation = (options: UseTranslationOptions<string>) =>
  useTranslation(undefined, options);

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
