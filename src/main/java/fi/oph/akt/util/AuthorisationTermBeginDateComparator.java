package fi.oph.akt.util;

import fi.oph.akt.model.AuthorisationTerm;

import java.util.Comparator;

public class AuthorisationTermBeginDateComparator implements Comparator<AuthorisationTerm> {

	@Override
	public int compare(final AuthorisationTerm term1, final AuthorisationTerm term2) {
		return term1.getBeginDate().compareTo(term2.getBeginDate());
	}

}
