import { put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';

import axiosInstance from 'configs/axios';
import { PublicTranslatorResponse } from 'interfaces/translator';
import {
  watchFetchTranslatorDetails,
  fetchTranslatorDetails,
  callFetchTranslatorDetails,
} from 'redux/sagas/translatorDetails';
import {
  TRANSLATOR_DETAILS_ERROR,
  TRANSLATOR_DETAILS_LOAD,
  TRANSLATOR_DETAILS_LOADING,
  TRANSLATOR_DETAILS_RECEIVED,
} from 'redux/actionTypes/translatorDetails';
import { DispatchAction, dispatchSaga } from 'tests/jest/__commons__/index';
import {
  createResponse,
  expectedResponse,
} from 'tests/jest/__fixtures__/translatorDetails';

describe('Saga:translatorDetails', () => {
  it('should invoke a LOADING action', () => {
    const genObject = watchFetchTranslatorDetails();
    const genTranslatorDetails = fetchTranslatorDetails();

    expect(genObject.next().value).toEqual(
      takeLatest(TRANSLATOR_DETAILS_LOAD, fetchTranslatorDetails)
    );

    expect(genTranslatorDetails.next().value).toEqual(
      put({ type: TRANSLATOR_DETAILS_LOADING })
    );
  });

  it('should invoke an ERROR action in case of API fails', async () => {
    const dispatched: DispatchAction[] = [];
    jest.spyOn(axiosInstance, 'get').mockImplementationOnce(() => {
      throw 'Error!';
    });

    await dispatchSaga(dispatched, callFetchTranslatorDetails);

    expect(dispatched).toEqual([
      { type: TRANSLATOR_DETAILS_LOADING },
      { type: TRANSLATOR_DETAILS_ERROR, error: 'Error!' },
    ]);
  });

  it('should transform and store API results', async () => {
    const dispatched: DispatchAction[] = [];
    const mockResponse = (
      _endpoint: string
    ): Promise<AxiosResponse<PublicTranslatorResponse>> => {
      return Promise.resolve(createResponse(expectedResponse));
    };
    jest.spyOn(axiosInstance, 'get').mockImplementationOnce(mockResponse);

    await dispatchSaga(dispatched, callFetchTranslatorDetails);

    expect(dispatched).toEqual([
      { type: TRANSLATOR_DETAILS_LOADING },
      {
        type: TRANSLATOR_DETAILS_RECEIVED,
        ...expectedResponse,
      },
    ]);
  });
});
