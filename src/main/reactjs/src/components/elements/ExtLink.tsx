import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Link, ButtonProps } from '@mui/material';

import { ExtLinkProps } from 'interfaces/extLink';

export const ExtLink: FC<ButtonProps & ExtLinkProps> = ({
  text,
  href,
  endIcon,
}) => {
  const { t } = useTranslation();

  return (
    <Button
      target="_blank"
      rel="noreferrer"
      component={Link}
      variant="text"
      color="secondary"
      href={t(href)}
      endIcon={endIcon}
    >
      {t(text)}
    </Button>
  );
};
