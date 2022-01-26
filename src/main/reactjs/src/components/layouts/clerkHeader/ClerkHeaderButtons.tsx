import { Button, IconButton, Avatar } from '@mui/material';
import { ArrowBackOutlined as BackIcon } from '@mui/icons-material';

import { useAppTranslation } from 'configs/i18n';
import { useAppSelector } from 'configs/redux';
import { clerkUserSelector } from 'redux/selectors/clerkUser';
import { AppRoutes, Variant } from 'enums/app';
import { ExternalRoutes } from 'enums/external';

export const ClerkHeaderButtons = () => {
  const clerkUser = useAppSelector(clerkUserSelector);
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.header.clerk',
  });

  // Avatar Letters
  const fNameLetter = clerkUser?.firstName?.charAt(0).toUpperCase();
  const lNameLetter = clerkUser?.lastName?.charAt(0).toUpperCase();

  const generateLogoutURL = () => {
    const logoutURL = `/cas/logout?service=https://${window.location.host}${AppRoutes.ClerkLocalLogoutPage}`;

    return logoutURL;
  };

  return (
    <>
      <Button
        href={ExternalRoutes.ClerkOpintopolkuHomePage}
        variant={Variant.Outlined}
        startIcon={<BackIcon />}
      >
        {t('backToOph')}
      </Button>
      <IconButton href={generateLogoutURL()}>
        <Avatar className="header__right__avatar">{`${fNameLetter}${lNameLetter}`}</Avatar>
        {t('logOut')}
      </IconButton>
    </>
  );
};
