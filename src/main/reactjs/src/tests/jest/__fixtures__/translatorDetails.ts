import { TranslatorDetails } from 'interfaces/translator';

export const createApiResponse = (apiResponse: Array<TranslatorDetails>) => {
  const response = {
    data: {
      content: apiResponse,
      numberOfElements: 1,
      totalElements: 1,
    },
    status: 200,
    statusText: 'ok',
    headers: {},
    config: {},
  };
  return response;
};

export const expectedTranslatorDetails: Array<TranslatorDetails> = [
  {
    id: 1,
    firstName: 'Testi',
    lastName: 'Esimerkki',
    languagePairs: [{ from: 'fi', to: 'sv' }],
    town: 'Espoo',
    country: 'Suomi',
  },
];
