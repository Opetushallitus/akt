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

  return (
    <div className="columns gapped">
      <div className="rows">
        <H3 className="">Haku kielittäin</H3>
        <div className="columns gapped">
          <TextField />
          <TextField />
        </div>
      </div>
      <div className="rows">
        <H3>Haku nimellä</H3>
        <TextField />
      </div>
      <div className="rows">
        <H3>Haku asuinkunnalla</H3>
        <TextField />
      </div>
      <div className="grow" />
      <div className="rows">
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => dispatch(resetClerkTranslatorFilters)}
        >
          Tyhjennä valinnat
        </Button>
      </div>
    </div>
  );
};
