import { AxiosResponse } from 'axios';

import { PublicTranslatorResponse } from 'interfaces/translator';

export const createResponse = (
  response: PublicTranslatorResponse
): AxiosResponse<PublicTranslatorResponse> => {
  return {
    data: response,
    status: 200,
    statusText: 'ok',
    headers: {},
    config: {},
  };
};

export const expectedResponse: PublicTranslatorResponse = {
  translators: [
    {
      id: 1,
      firstName: 'Testi',
      lastName: 'Esimerkki',
      languagePairs: [{ from: 'fi', to: 'sv' }],
      town: 'Espoo',
      country: 'Suomi',
    },
    {
      id: 2,
      firstName: 'Testi 2',
      lastName: 'Esimerkki 2',
      languagePairs: [{ from: 'fi', to: 'fr' }],
      town: 'Paris',
      country: 'Ranska',
    },
  ],
  langs: { from: ['fi'], to: ['sv', 'fr'] },
  towns: ['Espoo', 'Paris'],
};
