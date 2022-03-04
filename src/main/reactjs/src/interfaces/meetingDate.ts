import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';
import { MeetingStatus } from 'enums/meetingDate';
import { WithId } from 'interfaces/withId';
import { WithVersion } from 'interfaces/withVersion';
import {
  MEETING_DATE_ADD,
  MEETING_DATE_REMOVE,
} from 'redux/actionTypes/meetingDate';

export interface MeetingDates {
  meetingDates: Array<MeetingDate>;
}

export interface MeetingDateFilter {
  meetingStatus: MeetingStatus;
}
export interface MeetingDatesState {
  status: APIResponseStatus;
  filters: MeetingDateFilter;
  meetingDates: MeetingDate[];
}

export interface AddMeetingDateState {
  status: APIResponseStatus;
  date: Date;
}

export interface MeetingDateState {
  meetingDates: MeetingDatesState;
  addMeetingDate: AddMeetingDateState;
  removeMeetingDate: RemoveMeetingDateState;
}

export interface MeetingDateAction
  extends Action<string>,
    Partial<MeetingDates> {
  filters?: MeetingDateFilter;
  meetingDateId?: number;
  status?: APIResponseStatus;
  date?: Date;
}

export interface MeetingDate extends Omit<MeetingDateResponse, 'date'> {
  date: Date;
}
export interface MeetingDateResponse extends WithId, WithVersion {
  date: string;
}
export interface RemoveMeetingDateState {
  status: APIResponseStatus;
  meetingDateId: number | undefined;
}

export interface RemoveMeetingDateAction extends Action<string> {
  meetingDateId: number;
}

export interface AddMeetingDateAction extends Action<string> {
  date: Date;
}

export type AddMeetingDateActionType = {
  type: typeof MEETING_DATE_ADD;
  date: Date;
};

export type RemoveMeetingDateActionType = {
  type: typeof MEETING_DATE_REMOVE;
  meetingDateId: number;
};
