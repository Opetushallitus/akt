import { put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import { runSaga } from '@redux-saga/core';

import axiosInstance from 'configs/axios';
import {
  PublicTranslatorListApiResponse,
  ApiTranslatorDetails,
  TranslatorDetails,
} from 'interfaces/translator';
import {
  watchTranslatorDetails,
  getTranslatorsFromApi,
  forceGetTranslatorsFromApi,
} from 'redux/sagas/TranslatorDetails';
import { TRANSLATOR_DETAILS_ERROR, TRANSLATOR_DETAILS_LOAD, TRANSLATOR_DETAILS_LOADING, TRANSLATOR_DETAILS_RECEIVED } from 'redux/actionTypes/translatorDetails';

const toApiResponse = (apiResponse: Array<ApiTranslatorDetails>) => {
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

const expectedApiTranslatorDetails: Array<ApiTranslatorDetails> = [
  {
    id: 1,
    firstName: 'Testi',
    lastName: 'Esimerkki',
    languagePairs: [
      { fromLang: 'fi', toLang: 'sv', permissionToPublish: true },
    ],
    town: 'Espoo',
    country: 'Suomi',
  },
];
const expectedStoredTranslatorDetails: Array<TranslatorDetails> = [
  {
    id: 1,
    name: 'Testi Esimerkki',
    town: 'Espoo',
    country: 'Suomi',
    languagePairs: [{ from: 'fi', to: 'sv' }],
  },
];

describe('Saga:TranslatorDetails', () => {
  it('starting the translator details saga should first invoke a LOADING action', () => {
    const genObject = watchTranslatorDetails();
    expect(genObject.next().value).toEqual(
      takeLatest(TRANSLATOR_DETAILS_LOAD, getTranslatorsFromApi)
    );
    const genTranslatorDetails = getTranslatorsFromApi();
    expect(genTranslatorDetails.next().value).toEqual(
      put({ type: TRANSLATOR_DETAILS_LOADING })
    );
  });

  it('if API call returns an error, an ERROR action should be invoked', async () => {
    jest.spyOn(axiosInstance, 'get').mockImplementationOnce(() => {
      throw 'Error!';
    });
    type dispatchAction = { type: string; error?: string };
    const dispatched = [] as Array<dispatchAction>;
    await runSaga(
      {
        dispatch: (action: dispatchAction) => dispatched.push(action),
      },
      forceGetTranslatorsFromApi
    );

    expect(dispatched).toEqual([
      { type: TRANSLATOR_DETAILS_LOADING },
      { type: TRANSLATOR_DETAILS_ERROR, error: 'Error!' },
    ]);
  });

  it('if API returns results, they are transformed and then stored', async () => {
    const returnMockResponse = (
      _endpoint: string // eslint-disable-line @typescript-eslint/no-unused-vars
    ): Promise<AxiosResponse<PublicTranslatorListApiResponse>> => {
      return Promise.resolve(toApiResponse(expectedApiTranslatorDetails));
    };

    jest.spyOn(axiosInstance, 'get').mockImplementationOnce(returnMockResponse);

    type dispatchAction = { type: string; error?: string };
    const dispatched = [] as Array<dispatchAction>;
    await runSaga(
      {
        dispatch: (action: dispatchAction) => dispatched.push(action),
      },
      forceGetTranslatorsFromApi
    );

    expect(dispatched).toEqual([
      { type: TRANSLATOR_DETAILS_LOADING },
      {
        type: TRANSLATOR_DETAILS_RECEIVED,
        translatorDetails: expectedStoredTranslatorDetails,
      },
    ]);
  });
});
