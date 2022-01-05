import { TextField, Button } from '@mui/material';

import { H3 } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { AuthorisationStatus } from 'enums/clerkTranslator';
import {
  addClerkTranslatorFilter,
  resetClerkTranslatorFilters,
} from 'redux/actions/clerkTranslator';
import {
  clerkTranslatorsSelector,
  selectTranslatorsByAuthorisationStatus,
} from 'redux/selectors/clerkTranslator';

const AuthorisationStatusFilterButton = ({
  status,
  count,
}: {
  status: AuthorisationStatus;
  count: number;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorFilters.authorisationStatus',
  });
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector(clerkTranslatorsSelector);
  const filterByAuthorisationStatus = (status: AuthorisationStatus) => {
    dispatch(
      addClerkTranslatorFilter({ ...filters, authorisationStatus: status })
    );
  };

  return (
    <Button
      color="secondary"
      variant={
        filters.authorisationStatus === status ? 'contained' : 'outlined'
      }
      onClick={() => filterByAuthorisationStatus(status)}
    >
      <div className="columns gapped">
        <div className="grow">{t(status)}</div>
        <div>{`(${count})`}</div>
      </div>
    </Button>
  );
};

export const RegisterControls = () => {
  const { authorised, expiring, expired } = useAppSelector(
    selectTranslatorsByAuthorisationStatus
  );

  return (
    <>
      <AuthorisationStatusFilterButton
        status={AuthorisationStatus.Authorised}
        count={authorised.length}
      />
      <AuthorisationStatusFilterButton
        status={AuthorisationStatus.Expired}
        count={expired.length}
      />
      <AuthorisationStatusFilterButton
        status={AuthorisationStatus.Expiring}
        count={expiring.length}
      />
    </>
  );
};

export const ListingFilters = () => {
  const dispatch = useAppDispatch();
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorFilters',
  });

  return (
    <div className="columns gapped">
      <div className="rows">
        <H3>{t('languagePair.title')}</H3>
        <div className="columns gapped">
          <TextField placeholder={t('languagePair.fromPlaceholder')} />
          <TextField placeholder={t('languagePair.toPlaceholder')} />
        </div>
      </div>
      <div className="rows">
        <H3>{t('name.title')}</H3>
        <TextField placeholder={t('name.placeholder')} />
      </div>
      <div className="rows">
        <H3>{t('town.title')}</H3>
        <TextField placeholder={t('town.placeholder')} />
      </div>
      <div className="grow" />
      <div className="rows">
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => dispatch(resetClerkTranslatorFilters)}
        >
          {t('buttons.empty')}
        </Button>
      </div>
    </div>
  );
};
