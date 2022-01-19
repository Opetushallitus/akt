export enum APIEndpoints {
  PublicTranslator = '/api/v1/translator',
  ClerkTranslator = '/api/v1/clerk/translator',
  ContactRequest = '/api/v1/translator/contact-request',
  InformalClerkTranslatorEmail = '/api/v1/clerk/email/informal',
}

export enum APIResponseStatus {
  NotStarted = 'NOT_STARTED',
  InProgress = 'IN_PROGRESS',
  Success = 'SUCCESS',
  Error = 'ERROR',
  Cancelled = 'CANCELLED',
}
