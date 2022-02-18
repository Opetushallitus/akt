import { Link } from '@mui/material';
import { FC } from 'react';

import { Text } from 'components/elements/Text';
import { Color } from 'enums/app';
import { SkipLinkProps } from 'interfaces/link';

export const SkipLink: FC<SkipLinkProps> = ({ text, href }) => {
  return (
    <Link className="skip-link" href={href} color={Color.Secondary}>
      <Text>{text}</Text>
    </Link>
  );
};
