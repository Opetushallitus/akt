package fi.oph.akt.util;

import fi.oph.akt.repository.MeetingDateProjection;

import java.util.Comparator;

public class MeetingDateProjectionComparator implements Comparator<MeetingDateProjection> {

	@Override
	public int compare(final MeetingDateProjection proj1, final MeetingDateProjection proj2) {
		return proj1.date().compareTo(proj2.date());
	}

}
