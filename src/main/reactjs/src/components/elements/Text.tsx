import { Typography, TypographyVariant } from '@mui/material';
import React, { FC } from 'react';

const variantInDiv = (
  variant: TypographyVariant,
  children: React.ReactNode
) => (
  <Typography variant={variant} component="div">
    {children}
  </Typography>
);

export const H1: FC = ({ children }) => variantInDiv('h1', children);
export const H2: FC = ({ children }) => variantInDiv('h2', children);
export const H3: FC = ({ children }) => variantInDiv('h3', children);
export const H4: FC = ({ children }) => variantInDiv('h4', children);
export const H5: FC = ({ children }) => variantInDiv('h5', children);
export const H6: FC = ({ children }) => variantInDiv('h6', children);

export const Text: FC = ({ children }) => variantInDiv('body1', children);
