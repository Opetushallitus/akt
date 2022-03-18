import { AppRoutes } from 'enums/app';

declare global {
  namespace Cypress {
    interface Chainable {
      openPublicHomePage(): void;
      openClerkHomePage(): void;
      openClerkNewTranslatorPage(): void;
      usePhoneViewport(): void;
      openMeetingDatesPage(): void;
      goBack(): void;
      goForward(): void;
      isOnPage(page: AppRoutes): Chainable<Element>;
    }
  }
}
