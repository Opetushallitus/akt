import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

import { AuthorisationDetails } from 'components/clerkTranslator/clerkTranslatorDetails/AuthorisationDetails';
import { ContactDetails } from 'components/clerkTranslator/clerkTranslatorDetails/ContactDetails';
import { useAppTranslation } from 'configs/i18n';
import { AppRoutes, Variant } from 'enums/app';
import { ClerkTranslator } from 'interfaces/clerkTranslator';

const TopControls = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorDetails',
  });

  return (
    <div className="columns">
      <Button
        component={Link}
        to={AppRoutes.ClerkHomePage}
        className="clerk-translator-details-page__back-btn"
        variant={Variant.Text}
        startIcon={<ArrowBackIcon />}
      >
        {t('buttons.back')}
      </Button>
    </div>
  );
};

export const ClerkTranslatorDetails = ({
  translator,
}: {
  translator: ClerkTranslator;
}) => {
  return (
    <>
      <TopControls />
      <div className="rows gapped">
        <ContactDetails translator={translator} />
        <AuthorisationDetails translator={translator} />
      </div>
    </>
  );
};
