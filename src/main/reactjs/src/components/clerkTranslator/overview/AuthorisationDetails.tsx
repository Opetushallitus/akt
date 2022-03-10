import { Add as AddIcon } from '@mui/icons-material';

import { AuthorisationListing } from 'components/clerkTranslator/overview/AuthorisationListing';
import { CustomButton } from 'components/elements/CustomButton';
import { H3, Text } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppSelector } from 'configs/redux';
import { Color, Variant } from 'enums/app';
import { clerkTranslatorOverviewSelector } from 'redux/selectors/clerkTranslatorOverview';

export const AuthorisationDetails = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorOverview.authorisations',
  });

  const { selectedTranslator } = useAppSelector(
    clerkTranslatorOverviewSelector
  );

  return (
    <>
      <div className="columns margin-top-xxl">
        <H3 className="grow">{t('header')}</H3>
        <CustomButton
          data-testid="clerk-translator-overview__authorisation-details__add-btn"
          variant={Variant.Contained}
          color={Color.Secondary}
          startIcon={<AddIcon />}
        >
          {t('buttons.add')}
        </CustomButton>
      </div>

      {selectedTranslator?.authorisations.length ? (
        <AuthorisationListing
          authorisations={selectedTranslator.authorisations}
        />
      ) : (
        <Text>{t('noAuthorisations')}</Text>
      )}
    </>
  );
};
