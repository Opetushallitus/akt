import { jest } from '@jest/globals';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
}));

jest.mock('configs/i18n', () => ({
  getCurrentLang: () => 'fi-FI',
  getSupportedLangs: () => ['fi-FI', 'sv-SE', 'en-GB'],
  changeLang: (language: string) => language,
}));
