import { Skeleton } from '@mui/material';

import { ClerkTranslatorAutocompleteFilters } from 'components/clerkTranslator/ClerkTranslatorAutocompleteFilters';
import { ClerkTranslatorListing } from 'components/clerkTranslator/ClerkTranslatorListing';
import { ClerkTranslatorToggleFilters } from 'components/clerkTranslator/ClerkTranslatorToggleFilters';
import { H2 } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { SkeletonVariant } from 'enums/app';
import { ClerkHomePageControlButtons } from 'pages/ClerkHomePage';

export const ClerkHomePageSkeleton = () => {
  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.clerkHomepage' });

  return (
    <>
      <Skeleton
        className="full-max-width"
        variant={SkeletonVariant.Rectangular}
      >
        <H2>{t('register')}</H2>
      </Skeleton>
      <Skeleton variant={SkeletonVariant.Rectangular}>
        <ClerkTranslatorToggleFilters />
      </Skeleton>
      <Skeleton
        className="full-max-width"
        variant={SkeletonVariant.Rectangular}
      >
        <ClerkTranslatorAutocompleteFilters />
      </Skeleton>
      <Skeleton
        className="full-max-width"
        variant={SkeletonVariant.Rectangular}
      >
        <ClerkHomePageControlButtons />
      </Skeleton>
      <Skeleton
        className="full-max-width full-height"
        variant={SkeletonVariant.Rectangular}
      >
        <ClerkTranslatorListing />
      </Skeleton>
    </>
  );
};
