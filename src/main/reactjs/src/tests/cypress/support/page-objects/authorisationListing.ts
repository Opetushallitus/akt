import { ClerkTranslatorResponse } from 'interfaces/clerkTranslator';

class AuthorisationDetails {
  elements = {
    permissionPublish: (id: number) =>
      cy
        .findByTestId(`authorisations-table__id-${id}-row`)
        .find('input[type=checkbox]'),
  };

  switchPermissionPublishById(id: number) {
    this.elements.permissionPublish(id).click();
  }

  expectPermissionPublish(id: number, publishPermission: boolean) {
    const value = publishPermission ? 'on' : 'off';
    this.elements.permissionPublish(id).should('be.have', value);
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
