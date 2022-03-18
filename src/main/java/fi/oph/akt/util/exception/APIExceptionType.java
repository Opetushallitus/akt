package fi.oph.akt.util.exception;

public enum APIExceptionType {
  CREATE_MEETING_DATE_DUPLICATE_DATE,
  UPDATE_MEETING_DATE_DUPLICATE_DATE,
  UPDATE_MEETING_DATE_HAS_AUTHORISATIONS,
  DELETE_MEETING_DATE_HAS_AUTHORISATIONS;

  public int getId() {
    return this.ordinal();
  }
}
