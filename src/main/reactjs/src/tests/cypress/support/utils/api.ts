import { RouteHandler } from 'cypress/types/net-stubbing';

import { APIEndpoints } from 'enums/api';

export const runWithIntercept = (
  endpoint: APIEndpoints,
  response: RouteHandler,
  effect: () => void
) => {
  const alias = `intercepted-${endpoint}`;
  cy.intercept(endpoint, response).as(alias);
  effect();
  cy.wait(`@${alias}`);
};

export const createAPIErrorResponse = (code: number) => {
  return {
    statusCode: 400,
    body: {
      errorCode: code,
    },
  };
};
