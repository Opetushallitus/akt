import { Button } from '@mui/material';

import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { Color, Variant } from 'enums/app';
import { AuthorisationStatus } from 'enums/clerkTranslator';
import { setClerkTranslatorFilters } from 'redux/actions/clerkTranslator';
import {
  clerkTranslatorsSelector,
  selectTranslatorsByAuthorisationStatus,
} from 'redux/selectors/clerkTranslator';

export const ClerkTranslatorToggleFilters = () => {
  const { authorised, expiring, expired } = useAppSelector(
    selectTranslatorsByAuthorisationStatus
  );
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorFilters.authorisationStatus',
  });
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector(clerkTranslatorsSelector);
  const filterByAuthorisationStatus = (status: AuthorisationStatus) => {
    dispatch(setClerkTranslatorFilters({ authorisationStatus: status }));
  };
  const variantForStatus = (status: AuthorisationStatus) => {
    return status === filters.authorisationStatus
      ? Variant.Contained
      : Variant.Outlined;
  };

  const countsForStatuses = [
    { status: AuthorisationStatus.Authorised, count: authorised.length },
    { status: AuthorisationStatus.Expiring, count: expiring.length },
    { status: AuthorisationStatus.Expired, count: expired.length },
  ];

  return (
    <>
      {countsForStatuses.map(({ count, status }, i) => (
        <Button
          key={i}
          data-testid={`clerk-translator-filters__btn--${status}`}
          color={Color.Secondary}
          variant={variantForStatus(status)}
          onClick={() => filterByAuthorisationStatus(status)}
        >
          <div className="columns gapped">
            <div className="grow">{t(status)}</div>
            <div>{`(${count})`}</div>
          </div>
        </Button>
      ))}
    </>
  );
};
