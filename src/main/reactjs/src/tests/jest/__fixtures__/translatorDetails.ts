import { TranslatorDetails } from 'interfaces/translator';

export const createApiResponse = (publicTranslators: Array<TranslatorDetails>) => {
  return {
    data: publicTranslators,
    status: 200,
    statusText: 'ok',
    headers: {},
    config: {},
  };
};

export const expectedPublicTranslators: Array<TranslatorDetails> = [
  {
    id: 1,
    firstName: 'Testi',
    lastName: 'Esimerkki',
    languagePairs: [{ from: 'fi', to: 'sv' }],
    town: 'Espoo',
    country: 'Suomi',
  },
];
