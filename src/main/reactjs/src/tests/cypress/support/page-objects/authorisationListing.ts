import { AuthorisationStatus } from 'enums/clerkTranslator';
import { ClerkTranslatorResponse } from 'interfaces/clerkTranslator';
import { APIUtils } from 'utils/api';
import { AuthorisationUtils } from 'utils/authorisation';

class AuthorisationDetails {
  elements = {
    authorisedToggleBtn: () =>
      cy.findByTestId(
        'clerk-translator-overview__authorisation-details__toggle-btn--authorised'
      ),
    expiredToggleBtn: () =>
      cy.findByTestId(
        'clerk-translator-overview__authorisation-details__toggle-btn--expired'
      ),
    formerVIRToggleBtn: () =>
      cy.findByTestId(
        'clerk-translator-overview__authorisation-details__toggle-btn--formerVIR'
      ),
    row: (id: number) => cy.findByTestId(`authorisations-table__id-${id}-row`),
    deleteBtn: (id: number) =>
      cy.findByTestId(`authorisations-table__id-${id}-row__delete-btn`),
    publishPermissionSwitch: (id: number) =>
      cy
        .findByTestId(`authorisations-table__id-${id}-row`)
        .find('input[type=checkbox]'),
  };

  clickAuthorisedToggleBtn() {
    this.elements.authorisedToggleBtn().click();
  }

  clickExpiredToggleBtn() {
    this.elements.expiredToggleBtn().click();
  }

  clickformerVIRToggleBtn() {
    this.elements.formerVIRToggleBtn().click();
  }

  expectRowToHaveText(id: number, text: string) {
    this.elements.row(id).should('contain.text', text);
  }

  switchPublishPermission(id: number) {
    this.elements.publishPermissionSwitch(id).click();
  }

  expectPublishPermission(id: number, publishPermission: boolean) {
    const value = publishPermission ? 'on' : 'off';
    this.elements.publishPermissionSwitch(id).should('be.have', value);
  }

  clickDeleteButton(id: number) {
    this.elements.deleteBtn(id).click();
  }

  expectAuthorisations(
    translator: ClerkTranslatorResponse,
    status: AuthorisationStatus
  ) {
    const convertedTranslator =
      APIUtils.convertClerkTranslatorResponse(translator);
    const authorisations =
      AuthorisationUtils.groupClerkTranslatorAuthorisationsByStatus(
        convertedTranslator
      );

    authorisations[status].forEach((a) => {
      onAuthorisationDetails.expectRowToHaveText(a.id, a.diaryNumber);
    });
  }
}

export const changePublishPermission = (
  translatorResponse: ClerkTranslatorResponse,
  authorisationId: number,
  newPublishPermissionValue: boolean
) => {
  const updatedAuthorisations = translatorResponse.authorisations.map((a) =>
    a.id === authorisationId
      ? { ...a, permissionToPublish: newPublishPermissionValue }
      : a
  );

  return {
    ...translatorResponse,
    authorisations: updatedAuthorisations,
  };
};

export const onAuthorisationDetails = new AuthorisationDetails();
