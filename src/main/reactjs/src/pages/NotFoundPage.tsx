import { Button } from '@mui/material';
import { FC } from 'react';

import { H1, Text } from 'components/elements/Text';
import { useCommonTranslation } from 'configs/i18n';
import { AppRoutes } from 'enums/app';

export const NotFoundPage: FC = () => {
  const translateCommon = useCommonTranslation();

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
        {translateCommon('frontPage')}
      </Button>
    </div>
  );
};
