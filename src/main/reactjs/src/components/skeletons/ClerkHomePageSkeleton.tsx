import { ClerkTranslatorAutocompleteFilters } from 'components/clerkTranslator/ClerkTranslatorAutocompleteFilters';
import { ClerkTranslatorListing } from 'components/clerkTranslator/ClerkTranslatorListing';
import { ClerkTranslatorToggleFilters } from 'components/clerkTranslator/ClerkTranslatorToggleFilters';
import { CustomSkeleton } from 'components/elements/CustomSkeleton';
import { H2 } from 'components/elements/Text';
import { useCommonTranslation } from 'configs/i18n';
import { SkeletonVariant } from 'enums/app';
import { ClerkHomePageControlButtons } from 'pages/ClerkHomePage';

export const ClerkHomePageSkeleton = () => {
  const translateCommon = useCommonTranslation();

  return (
    <>
      <CustomSkeleton
        className="full-max-width"
        variant={SkeletonVariant.Rectangular}
      >
        <H2>{translateCommon('register')}</H2>
      </CustomSkeleton>
      <CustomSkeleton variant={SkeletonVariant.Rectangular}>
        <ClerkTranslatorToggleFilters />
      </CustomSkeleton>
      <CustomSkeleton
        className="full-max-width"
        variant={SkeletonVariant.Rectangular}
      >
        <ClerkTranslatorAutocompleteFilters />
      </CustomSkeleton>
      <CustomSkeleton
        className="full-max-width"
        variant={SkeletonVariant.Rectangular}
      >
        <ClerkHomePageControlButtons />
      </CustomSkeleton>
      <CustomSkeleton
        className="full-max-width full-height"
        variant={SkeletonVariant.Rectangular}
      >
        <ClerkTranslatorListing />
      </CustomSkeleton>
    </>
  );
};
