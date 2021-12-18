import { jest } from '@jest/globals';

jest.mock('configs/i18n', () => ({
  getCurrentLang: () => 'fi-FI',
  getSupportedLangs: () => ['fi-FI', 'sv-SE', 'en-GB'],
  changeLang: (language: string) => language,
  useAppTranslation: () => ({ t: (str: string) => str }),
}));
