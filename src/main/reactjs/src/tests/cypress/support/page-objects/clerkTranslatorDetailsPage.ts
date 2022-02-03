import { AppRoutes } from 'enums/app';

class ClerkTranslatorDetailsPage {
  navigateById(id: number) {
    cy.visit(
      AppRoutes.ClerkTranslatorDetailsPage.replace(/:translatorId$/, `${id}`)
    );
  }

  contentContainer() {
    return cy.get('.clerk-translator-details-page__content-container');
  }

  backToRegisterBtn() {
    return cy.get('.clerk-translator-details-page__back-btn');
  }

  editTranslatorInfoBtn() {
    return cy.findByTestId(
      'clerk-translator-details__contact-details__edit-btn'
    );
  }

  addAuthorisationBtn() {
    return cy.findByTestId(
      'clerk-translator-details__authorisation-details__add-btn'
    );
  }

  contactDetailsField(field: string) {
    return cy
      .findByTestId(`clerk-translator-details__contact-details__field-${field}`)
      .find('div>input');
  }

  authorisationDetailsRow(id: number) {
    return cy.findByTestId(`authorisations-table__id-${id}-row`);
  }
}

export const onClerkTranslatorDetailsPage = new ClerkTranslatorDetailsPage();

export const existingClerkTranslatorDetails = {
  id: 3,
  contactDetails: {
    firstName: 'Jari',
    lastName: 'Hakala',
    email: 'translator3@example.invalid',
    phoneNumber: '+358401000003',
    identityNumber: 'id3',
    street: 'Veturitie 4',
    postalCode: '13500',
    town: 'Kuopio',
    country: 'Finland',
  },
  authorisations: [
    {
      id: 3,
      version: 0,
      languagePair: {
        from: 'SV',
        to: 'DA',
      },
      basis: 'AUT',
      diaryNumber: '3',
      autDate: '2022-01-20',
      assuranceDate: '2022-01-20',
      meetingDate: '2021-12-20',
      terms: [
        {
          id: 3,
          version: 0,
          beginDate: '2022-01-01',
          endDate: '2022-01-18',
        },
      ],
      permissionToPublish: true,
    },
    {
      id: 7267,
      version: 0,
      languagePair: {
        from: 'DA',
        to: 'SV',
      },
      basis: 'AUT',
      diaryNumber: '7267',
      autDate: '2022-01-20',
      assuranceDate: '2022-01-20',
      meetingDate: '2021-12-20',
      terms: [
        {
          id: 6919,
          version: 0,
          beginDate: '2022-01-01',
          endDate: '2022-01-18',
        },
      ],
      permissionToPublish: true,
    },
  ],
};
