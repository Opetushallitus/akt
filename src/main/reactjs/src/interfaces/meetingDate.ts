import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';
import { MeetingStatus } from 'enums/meetingDate';
import { WithId } from 'interfaces/withId';
import { WithVersion } from 'interfaces/withVersion';

export interface MeetingDates {
  meetingDates: Array<MeetingDate>;
}
export interface MeetingDateFilter {
  meetingStatus: MeetingStatus;
}
export interface MeetingDateState extends MeetingDates {
  status: APIResponseStatus;
  filters: MeetingDateFilter;
  meetingDates: MeetingDate[];
}

export interface MeetingDateAction
  extends Action<string>,
    Partial<MeetingDates> {
  filters?: MeetingDateFilter;
}

export interface MeetingDate extends Omit<MeetingDateResponse, 'date'> {
  date: Date;
}

export interface MeetingDateResponse extends WithId, WithVersion {
  date: string;
}
