package fi.oph.akt.util;

import fi.oph.akt.model.MeetingDate;
import java.util.Comparator;

public class MeetingDateComparator implements Comparator<MeetingDate> {

  @Override
  public int compare(final MeetingDate meetingDate1, final MeetingDate meetingDate2) {
    return meetingDate1.getDate().compareTo(meetingDate2.getDate());
  }
}
