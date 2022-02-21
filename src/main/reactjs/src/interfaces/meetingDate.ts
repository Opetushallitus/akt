import { WithId } from 'interfaces/withId';
import { WithVersion } from 'interfaces/withVersion';

export interface MeetingDate extends Omit<APIMeetingDate, 'date'> {
  date: Date;
}

export interface APIMeetingDate extends WithId, WithVersion {
  date: string;
}
