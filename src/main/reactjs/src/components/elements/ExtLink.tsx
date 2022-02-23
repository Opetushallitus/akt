import { ButtonProps } from '@mui/material';
import { FC } from 'react';

import { CustomButton } from 'components/elements/CustomButton';
import { Color } from 'enums/app';
import { ExtLinkProps } from 'interfaces/link';

export const ExtLink: FC<ButtonProps & ExtLinkProps> = ({
  text,
  href,
  endIcon,
  className,
  'aria-label': ariaLabel,
}) => {
  return (
    <CustomButton
      className={className}
      target="_blank"
      rel="noreferrer"
      color={Color.Inherit}
      href={href}
      endIcon={endIcon}
      aria-label={ariaLabel}
    >
      {text}
    </CustomButton>
  );
};
