export enum AppConstants {
  CallerID = '1.2.246.562.10.00000000001.akt',
}

export enum AppRoutes {
  PublicHomePage = '/akt/etusivu',
  ClerkHomePage = '/akt/virkailija',
  ClerkSendEmailPage = '/akt/virkailija/laheta-sahkoposti',
  ClerkLocalLogoutPage = '/akt/cas/localLogout',
  ClerkTranslatorOverviewPage = '/akt/virkailija/kaantaja/:translatorId',
  NotFoundPage = '*',
}

export enum Duration {
  Short = 3000,
  Medium = 6000,
  MediumExtra = 9000,
  Long = 12000,
}

export enum SearchFilter {
  FromLang = 'fromLang',
  ToLang = 'toLang',
  Name = 'name',
  Town = 'town',
}

export enum KeyboardKey {
  Enter = 'Enter',
}

export enum PublicUIViews {
  PublicTranslatorListing = 'PublicTranslatorListing',
  ContactRequest = 'ContactRequest',
}

export enum TextFieldTypes {
  Text = 'text',
  Email = 'email',
  PhoneNumber = 'tel',
  Textarea = 'textarea',
}

export enum CustomTextFieldErrors {
  Required = 'errors.customTextField.required',
  MaxLength = 'errors.customTextField.maxLength',
  EmailFormat = 'errors.customTextField.emailFormat',
  TelFormat = 'errors.customTextField.telFormat',
}

export enum NotifierTypes {
  Dialog = 'dialog',
  Toast = 'toast',
}

export enum Severity {
  Info = 'info',
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
}

export enum Variant {
  Text = 'text',
  Outlined = 'outlined',
  Contained = 'contained',
}

export enum TextFieldVariant {
  Filled = 'filled',
  Outlined = 'outlined',
  Standard = 'standard',
}

export enum SkeletonVariant {
  Text = 'text',
  Rectangular = 'rectangular',
  Circular = 'circular',
}

export enum I18nNamespace {
  Global = 'global',
  Translation = 'translation',
  KoodistoLanguages = 'koodistoLanguages',
}

export enum Color {
  Primary = 'primary',
  Secondary = 'secondary',
  Inherit = 'inherit',
}

export enum HTTPStatusCode {
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,
  MovedPermanently = 301,
  Found = 302,
  NotModified = 304,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
}

export enum Screenwidth {
  Phone = 480,
  Tablet = 800,
  Desktop = 1024,
}

export enum PermissionToPublish {
  Yes = 'Kyllä',
  No = 'Ei',
}
