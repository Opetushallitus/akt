import { WithId } from 'interfaces/withId';

export interface MeetingDate extends WithId {
  date: Date;
}

export interface APIMeetingDate extends WithId {
  date: string;
}
