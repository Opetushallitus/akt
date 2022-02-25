import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';

export interface AddMeetingDateState {
  status: APIResponseStatus;
  date: Date;
}

export interface AddMeetingDateAction extends Action<string> {
  date: Date;
}
