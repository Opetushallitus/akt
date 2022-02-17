import { Button, ButtonProps, Link } from '@mui/material';
import { FC } from 'react';

import { ExtLinkProps } from 'interfaces/link';

export const ExtLink: FC<ButtonProps & ExtLinkProps> = ({
  text,
  href,
  endIcon,
  'aria-label': ariaLabel,
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
      aria-label={ariaLabel}
    >
      {text}
    </Button>
  );
};
