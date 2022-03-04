import { all } from 'redux-saga/effects';

import { watchFetchClerkTranslators } from 'redux/sagas/clerkTranslator';
import { watchClerkTranslatorOverview } from 'redux/sagas/clerkTranslatorOverview';
import { watchFetchClerkUser } from 'redux/sagas/clerkUser';
import { watchContactRequest } from 'redux/sagas/contactRequest';
import { watchMeetingDates } from 'redux/sagas/meetingDate';
import { watchClerkTranslatorEmailNotifier } from 'redux/sagas/notifier/clerkTranslatorEmail';
import { watchContactRequestNotifier } from 'redux/sagas/notifier/contactRequest';
import { watchFetchPublicTranslators } from 'redux/sagas/publicTranslator';

export default function* rootSaga() {
  yield all([
    watchFetchClerkTranslators(),
    watchFetchPublicTranslators(),
    watchContactRequest(),
    watchContactRequestNotifier(),
    watchClerkTranslatorEmailNotifier(),
    watchClerkTranslatorOverview(),
    watchFetchClerkUser(),
    watchMeetingDates(),
  ]);
}
