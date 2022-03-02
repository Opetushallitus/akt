import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';

export interface RemoveMeetingDateState {
  status: APIResponseStatus;
  meetingDateId: number | undefined;
}

export interface RemoveMeetingDateAction extends Action<string> {
  meetingDateId: number;
}
