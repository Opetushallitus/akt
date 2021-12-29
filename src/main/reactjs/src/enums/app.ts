export enum AppConstants {
  CallerID = '1.2.246.562.10.00000000001.akt',
}

export enum AppRoutes {
  PublicHomePage = '/',
  ContactRequestPage = '/contact-request',
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
