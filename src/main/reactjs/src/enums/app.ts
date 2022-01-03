export enum AppConstants {
  CallerID = '1.2.246.562.10.00000000001.akt',
}

export enum AppRoutes {
  PublicHomePage = '/',
  ContactRequestPage = '/yhteydenotto',
  ClerkHomePage = '/akt-virkailija',
  NotFoundPage = '*',
}

export enum UIStates {
  PublicTranslatorListing = 'PublicTranslatorListing',
  ContactRequest = 'ContactRequest',
}

export enum TextBoxTypes {
  Text = 'text',
  Email = 'email',
  PhoneNumber = 'tel',
  Textarea = 'textarea',
}

export enum TextBoxErrors {
  Required = 'errors.textBox.required',
  MaxLength = 'errors.textBox.maxLength',
  EmailFormat = 'errors.textBox.emailFormat',
  TelFormat = 'errors.textBox.telFormat',
}

export enum NotifierTypes {
  Dialog = 'dialog',
  Toast = 'toast',
}

export enum NotifierSeverity {
  Info = 'info',
  Success = 'success',
  Error = 'error',
}

export enum NotifierButtonVariant {
  Text = 'text',
  Outlined = 'outlined',
  Contained = 'contained',
}
