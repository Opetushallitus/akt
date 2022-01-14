import { AppRoutes, PublicUIViews } from 'enums/app';

export interface PublicUIState {
  currentView: PublicUIViews;
}

export interface RouteState {
  currentRoute: AppRoutes | undefined;
}
