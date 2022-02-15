import ArrowBackIosOutlined from '@mui/icons-material/ArrowBackIosOutlined';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

import { AuthorisationDetails } from 'components/clerkTranslator/clerkTranslatorDetails/AuthorisationDetails';
import { ClerkTranslatorDetails } from 'components/clerkTranslator/clerkTranslatorDetails/ClerkTranslatorDetails';
import { useCommonTranslation } from 'configs/i18n';
import { AppRoutes, Variant } from 'enums/app';
import { ClerkTranslator } from 'interfaces/clerkTranslator';

export const TopControls = () => {
  const translateCommon = useCommonTranslation();

  return (
    <div className="columns">
      <Button
        component={Link}
        to={AppRoutes.ClerkHomePage}
        className="clerk-translator-overview-page__back-btn"
        variant={Variant.Text}
        startIcon={<ArrowBackIosOutlined />}
      >
        {translateCommon('back')}
      </Button>
    </div>
  );
};

export const ClerkTranslatorOverview = ({
  translator,
}: {
  translator: ClerkTranslator;
}) => {
  return (
    <>
      <TopControls />
      <div className="rows gapped">
        <ClerkTranslatorDetails translator={translator} />
        <AuthorisationDetails translator={translator} />
      </div>
    </>
  );
};
