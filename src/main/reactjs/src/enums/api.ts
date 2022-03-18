export enum APIEndpoints {
  PublicTranslator = '/akt/api/v1/translator',
  ClerkTranslator = '/akt/api/v1/clerk/translator',
  ContactRequest = '/akt/api/v1/translator/contact-request',
  Authorisation = '/akt/api/v1/clerk/translator/authorisation',
  InformalClerkTranslatorEmail = '/akt/api/v1/clerk/email/informal',
  ClerkUser = '/akt/api/v1/clerk/user',
  MeetingDate = '/akt/api/v1/clerk/meetingDate',
}

export enum APIResponseStatus {
  NotStarted = 'NOT_STARTED',
  InProgress = 'IN_PROGRESS',
  Success = 'SUCCESS',
  Error = 'ERROR',
  Cancelled = 'CANCELLED',
}

/**
 * Certain errors expected to be returned by the backend.
 * The respective backend enum is `APIExceptionType`.
 */
export enum APIError {
  MeetingDateCreateDuplicateDate = 'meetingDateCreateDuplicateDate',
  MeetingDateUpdateDuplicateDate = 'meetingDateUpdateDuplicateDate',
  MeetingDateUpdateHasAuthorisations = 'meetingDateUpdateHasAuthorisations',
  MeetingDateDeleteHasAuthorisations = 'meetingDateDeleteHasAuthorisations',
}
