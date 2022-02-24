export enum APIEndpoints {
  PublicTranslator = '/akt/api/v1/translator',
  ClerkTranslator = '/akt/api/v1/clerk/translator',
  ContactRequest = '/akt/api/v1/translator/contact-request',
  Authorisation = '/akt/api/v1/clerk/translator/authorisation',
  InformalClerkTranslatorEmail = '/akt/api/v1/clerk/email/informal',
  ClerkUser = '/akt/api/v1/clerk/user',
}

export enum APIResponseStatus {
  NotStarted = 'NOT_STARTED',
  InProgress = 'IN_PROGRESS',
  Success = 'SUCCESS',
  Error = 'ERROR',
  Cancelled = 'CANCELLED',
}
