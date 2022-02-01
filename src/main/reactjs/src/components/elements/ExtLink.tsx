import { Button, ButtonProps, Link } from '@mui/material';
import { FC } from 'react';

import { ExtLinkProps } from 'interfaces/extLink';

export const ExtLink: FC<ButtonProps & ExtLinkProps> = ({
  text,
  href,
  endIcon,
}) => {
  return (
    <Button
      target="_blank"
      rel="noreferrer"
      component={Link}
      variant="text"
      color="inherit"
      href={href}
      endIcon={endIcon}
    >
      {text}
    </Button>
  );
};
