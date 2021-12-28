export enum APIEndpoints {
  I18nLanguages = '/api/v1/i18n/languages',
  PublicTranslator = '/api/v1/translator',
  ContactRequest = '/api/v1/translator/contact-request',
}

export enum APIResponseStatus {
  NotStarted = 'NOT_STARTED',
  InProgress = 'IN_PROGRESS',
  Success = 'SUCCESS',
  Error = 'ERROR',
}
