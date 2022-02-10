import {
  ArrowBackIosOutlined as BackIcon,
  LogoutOutlined as LogoutIcon,
} from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';

import { useAppTranslation } from 'configs/i18n';
import { AppRoutes, Variant } from 'enums/app';
import { ExternalRoutes } from 'enums/external';

export const ClerkHeaderButtons = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.header.clerk',
  });

  const generateLogoutURL = () => {
    return `/cas/logout?service=https://${window.location.host}${AppRoutes.ClerkLocalLogoutPage}`;
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
        <LogoutIcon />
        {t('logOut')}
      </IconButton>
    </>
  );
};
