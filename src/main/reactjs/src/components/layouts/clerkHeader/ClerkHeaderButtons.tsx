import { Button, IconButton, Avatar } from '@mui/material';
import { ArrowBackOutlined as BackIcon } from '@mui/icons-material';

import { useAppTranslation } from 'configs/i18n';

export const ClerkHeaderButtons = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.header.clerk',
  });

  // FIXME: Fix Avatar letters
  return (
    <>
      <Button variant="outlined" startIcon={<BackIcon />}>
        {t('backToOph')}
      </Button>
      <IconButton>
        <Avatar className="header__right__avatar">TU</Avatar>
        {t('logOut')}
      </IconButton>
    </>
  );
};
