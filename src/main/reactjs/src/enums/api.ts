export enum APIEndpoints {
  PublicTranslatorDetails = '/api/v1/translator',
  ContactRequest = '/api/v1/translator/contact-request',
}

export enum APIResponseStatus {
  NotStarted = 'NOT_STARTED',
  InProgress = 'IN_PROGRESS',
  Success = 'SUCCESS',
  Error = 'ERROR',
}
