import { APIEndpoints } from 'enums/api';
import { onClerkHomePage } from 'tests/cypress/support/page-objects/clerkHomePage';
import { runWithIntercept } from 'tests/cypress/support/utils/api';
import { useFixedDate } from 'tests/cypress/support/utils/date';
import {
  onClerkSendEmailPage,
  TEST_MESSAGE,
  TEST_SUBJECT,
} from 'tests/cypress/support/page-objects/clerkSendEmailPage';
import { onDialog } from 'tests/cypress/support/page-objects/dialog';

const fixedDateForTests = new Date('2022-01-17T12:35:00+0200');

const selectedTranslatorIds = ['3', '4', '5'];

const expectRegistryIsVisible = () => {
  onClerkHomePage.expectTotalTranslatorsCount(100);
};

const fillAndSendMessage = () => {
  onClerkSendEmailPage.writeSubject(TEST_SUBJECT);
  onClerkSendEmailPage.writeMessage(TEST_MESSAGE);
  onClerkSendEmailPage.send();
};

const confirmSend = () => {
  onDialog.expectText('Lähetä sähköposti');
  onDialog.clickButtonByText('Kyllä');
};

beforeEach(() => {
  useFixedDate(fixedDateForTests);
  runWithIntercept(
    APIEndpoints.ClerkTranslator,
    { fixture: 'clerk_translators_100.json' },
    () => cy.openClerkHomePage()
  );
  expectRegistryIsVisible();
  selectedTranslatorIds.forEach((id) =>
    onClerkHomePage.selectTranslatorById(id)
  );
  onClerkHomePage.sendEmail();
});

describe('ClerkSendEmailPage', () => {
  it('should redirect back to ClerkHomePage when the flow is canceled', () => {
    onClerkSendEmailPage.cancel();
    onDialog.expectText('Peruuta sähköpostin lähetys');
    onDialog.clickButtonByText('Kyllä');
    expectRegistryIsVisible();
  });

  it('should display success dialog and redirect to ClerkHomePage if email was sent', () => {
    fillAndSendMessage();

    runWithIntercept(
      APIEndpoints.InformalClerkTranslatorEmail,
      { statusCode: 201 },
      confirmSend
    );

    onDialog.expectText('Sähköposti lähetetty');
    onDialog.clickButtonByText('Takaisin');
    expectRegistryIsVisible();
  });

  it('should display an error dialog if there was an error when sending the email', () => {
    fillAndSendMessage();

    runWithIntercept(
      APIEndpoints.InformalClerkTranslatorEmail,
      { statusCode: 400 },
      confirmSend
    );

    onDialog.expectText('Virhe');
    onDialog.clickButtonByText('Takaisin');
  });
});
