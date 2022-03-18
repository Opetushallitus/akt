package fi.oph.akt.util.exception;

import lombok.Getter;
import lombok.NonNull;

@Getter
public class APIException extends RuntimeException {

  private final APIExceptionType exceptionType;

  public APIException(@NonNull APIExceptionType exceptionType, @NonNull String msg) {
    super(msg);
    this.exceptionType = exceptionType;
  }
}
