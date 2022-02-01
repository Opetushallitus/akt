import { Button } from '@mui/material';
import { FC } from 'react';

import { H1, Text } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { AppRoutes } from 'enums/app';

export const NotFoundPage: FC = () => {
  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.notFoundPage' });

  return (
    <div className="not-found-page">
      <H1>{t('title')}</H1>
      <Text>{t('description')}</Text>
      <Button
        className="not-found-page__btn"
        color="secondary"
        variant="contained"
        href={AppRoutes.PublicHomePage}
      >
        {t('homePageBtn')}
      </Button>
    </div>
  );
};
