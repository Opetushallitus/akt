import { Button, IconButton, Avatar } from '@mui/material';
import { ArrowBackOutlined as BackIcon } from '@mui/icons-material';

import { useAppTranslation } from 'configs/i18n';
import { useAppSelector } from 'configs/redux';
import { clerkMeSelector } from 'redux/selectors/clerkMe';
import { AppRoutes, Variant } from 'enums/app';
import { ExternalRoutes } from 'enums/external';

export const ClerkHeaderButtons = () => {
  const clerkMe = useAppSelector(clerkMeSelector);
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.header.clerk',
  });

  // Avatar Letters
  const fNameLetter = clerkMe?.firstName?.charAt(0).toUpperCase();
  const lNameLetter = clerkMe?.lastName?.charAt(0).toUpperCase();

  return (
    <>
      <Button
        href={ExternalRoutes.ClerkOpintopolkuHomePage}
        variant={Variant.Outlined}
        startIcon={<BackIcon />}
      >
        {t('backToOph')}
      </Button>
      <IconButton href={AppRoutes.ClerkLocalLogoutPage}>
        <Avatar className="header__right__avatar">{`${fNameLetter}${lNameLetter}`}</Avatar>
        {t('logOut')}
      </IconButton>
    </>
  );
};
