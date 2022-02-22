import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';
import { MeetingStatus } from 'enums/meetingDate';
import { WithId } from 'interfaces/withId';
import { WithVersion } from 'interfaces/withVersion';
export interface MeetingDateResponse {
  meetingDates: Array<MeetingDate>;
}
export interface MeetingDateFilter {
  meetingStatus: MeetingStatus;
}
export interface MeetingDateState extends MeetingDateResponse {
  status: APIResponseStatus;
  filters: MeetingDateFilter;
  meetingDates: MeetingDate[];
}

export interface MeetingDateAction
  extends Action<string>,
    Partial<MeetingDateResponse> {
  filters?: MeetingDateFilter;
}

export interface MeetingDate extends Omit<APIMeetingDate, 'date'> {
  date: Date;
}

export interface APIMeetingDate extends WithId, WithVersion {
  date: string;
}
