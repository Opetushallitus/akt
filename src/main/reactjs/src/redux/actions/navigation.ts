import { PublicUIViews } from 'enums/app';
import { DISPLAY_PUBLIC_VIEW } from 'redux/actionTypes/navigation';

export const setPublicUIView = (view: PublicUIViews) => ({
  type: DISPLAY_PUBLIC_VIEW,
  view,
});
