import { Button } from '@mui/material';

import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { Color, PublicUIViews, Variant } from 'enums/app';
import { setPublicUIView } from 'redux/actions/publicUIView';
import { publicTranslatorsSelector } from 'redux/selectors/publicTranslator';

export const ContactRequestButton = () => {
  const { selectedTranslators } = useAppSelector(publicTranslatorsSelector);
  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.homepage' });
  const dispatch = useAppDispatch();

  return (
    <Button
      color={Color.Secondary}
      variant={Variant.Contained}
      onClick={() => dispatch(setPublicUIView(PublicUIViews.ContactRequest))}
      disabled={selectedTranslators.length == 0}
      data-testid="public-translators__contact-request-btn"
    >
      {t('requestContact')}
    </Button>
  );
};
