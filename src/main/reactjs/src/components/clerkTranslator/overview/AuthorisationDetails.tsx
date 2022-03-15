import { Add as AddIcon } from '@mui/icons-material';
import { useState } from 'react';

import { AuthorisationListing } from 'components/clerkTranslator/overview/AuthorisationListing';
import { CustomButton } from 'components/elements/CustomButton';
import { H2, Text } from 'components/elements/Text';
import { ToggleFilterGroup } from 'components/elements/ToggleFilterGroup';
import { useAppTranslation } from 'configs/i18n';
import { useAppSelector } from 'configs/redux';
import { Color, Variant } from 'enums/app';
import { AuthorisationStatus } from 'enums/clerkTranslator';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
import { clerkTranslatorOverviewSelector } from 'redux/selectors/clerkTranslatorOverview';
import { AuthorisationUtils } from 'utils/authorisation';

export const AuthorisationDetails = () => {
  // State
  const [selectedToggleFilter, setSelectedToggleFilter] = useState(
    AuthorisationStatus.Authorised
  );

  // Redux
  const { selectedTranslator } = useAppSelector(
    clerkTranslatorOverviewSelector
  );

  // I18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorOverview.authorisations',
  });

  if (!selectedTranslator) {
    return null;
  }

  const { authorised, expiring, expired, formerVIR } =
    AuthorisationUtils.groupClerkTranslatorAuthorisationsByStatus(
      selectedTranslator as ClerkTranslator
    );

  // Authorisations with status "Expiring" are shown under Authorised
  const groupedAuthorisations = {
    [AuthorisationStatus.Authorised]: [...authorised, ...expiring],
    [AuthorisationStatus.Expired]: expired,
    [AuthorisationStatus.FormerVIR]: formerVIR,
    [AuthorisationStatus.Expiring]: [],
  };

  const activeAuthorisations = groupedAuthorisations[selectedToggleFilter];
  const toggleFilters = [
    {
      status: AuthorisationStatus.Authorised,
      count: groupedAuthorisations.authorised.length,
      testId: `clerk-translator-overview__authorisation-details__toggle-btn--${AuthorisationStatus.Authorised}`,
      label: t('toggleFilters.effectives'),
    },
    {
      status: AuthorisationStatus.Expired,
      count: groupedAuthorisations.expired.length,
      testId: `clerk-translator-overview__authorisation-details__toggle-btn--${AuthorisationStatus.Expired}`,
      label: t('toggleFilters.expired'),
    },
    {
      status: AuthorisationStatus.FormerVIR,
      count: groupedAuthorisations.formerVIR.length,
      testId: `clerk-translator-overview__authorisation-details__toggle-btn--${AuthorisationStatus.FormerVIR}`,
      label: t('toggleFilters.formerVIR'),
    },
  ];

  const filterByAuthorisationStatus = (status: AuthorisationStatus) => {
    setSelectedToggleFilter(status);
  };

  return (
    <>
      <div className="rows gapped-xs">
        <div className="columns margin-top-sm">
          <H2 className="grow">{t('header')}</H2>
          <CustomButton
            data-testid="clerk-translator-overview__authorisation-details__add-btn"
            variant={Variant.Contained}
            color={Color.Secondary}
            startIcon={<AddIcon />}
          >
            {t('buttons.add')}
          </CustomButton>
        </div>
        <ToggleFilterGroup
          filters={toggleFilters}
          activeStatus={selectedToggleFilter}
          onButtonClick={filterByAuthorisationStatus}
        />
        {activeAuthorisations.length ? (
          <AuthorisationListing authorisations={activeAuthorisations} />
        ) : (
          <Text className="centered bold margin-top-lg">
            {t('noAuthorisations')}
          </Text>
        )}
      </div>
    </>
  );
};
