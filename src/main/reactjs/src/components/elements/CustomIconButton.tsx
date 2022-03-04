import { QuestionMark } from '@mui/icons-material';
import { IconButton, IconButtonProps } from '@mui/material';
import { FC } from 'react';

export const CustomIconButton: FC<IconButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <IconButton {...props} aria-disabled={props.disabled}>
      {children ?? <QuestionMark />}
    </IconButton>
  );
};
