import { Action } from 'redux';

import { AppRoutes, PublicUIViews } from 'enums/app';

export const DISPLAY_PUBLIC_VIEW = 'UI_STATE/DISPLAY_PUBLIC_VIEW';
export const NAVIGATE_TO_ROUTE = 'UI_STATE/NAVIGATE_TO_ROUTE';

export type SetPublicUIViewActionType = {
  type: typeof DISPLAY_PUBLIC_VIEW;
  view: PublicUIViews;
};

export function isSetPublicUIViewActionType(
  action: Action
): action is SetPublicUIViewActionType {
  return action.type == DISPLAY_PUBLIC_VIEW;
}

export type NavigateToRouteActionType = {
  type: typeof NAVIGATE_TO_ROUTE;
  route: AppRoutes;
};

export function isNavigateToRouteActionType(
  action: Action
): action is NavigateToRouteActionType {
  return action.type == NAVIGATE_TO_ROUTE;
}
