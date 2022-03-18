import { Add as AddIcon } from '@mui/icons-material';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

import { AddAuthorisation } from 'components/clerkTranslator/add/AddAuthorisation';
import { AuthorisationListing } from 'components/clerkTranslator/overview/AuthorisationListing';
import { CustomButton } from 'components/elements/CustomButton';
import { CustomModal } from 'components/elements/CustomModal';
import { H3, Text } from 'components/elements/Text';
import { ToggleFilterGroup } from 'components/elements/ToggleFilterGroup';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { Color, Variant } from 'enums/app';
import { AuthorisationStatus } from 'enums/clerkTranslator';
import { AddAuthorisation as AddAuthorisationI } from 'interfaces/authorisation';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
import { addAuthorisation } from 'redux/actions/authorisation';
import { authorisationSelector } from 'redux/selectors/authorisation';
import { clerkTranslatorOverviewSelector } from 'redux/selectors/clerkTranslatorOverview';
import { selectMeetingDatesByMeetingStatus } from 'redux/selectors/meetingDate';
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
  const { upcoming } = useAppSelector(selectMeetingDatesByMeetingStatus);
  const { status } = useAppSelector(authorisationSelector);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [
    addAuthorisationOutsideComponent,
    setAddAuthorisationOutsideComponent,
  ] = useState(false);
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const handleAddAuthorisation = (authorisation: AddAuthorisationI) => {
    selectedTranslator?.id &&
      dispatch(
        addAuthorisation({
          ...authorisation,
          translatorId: selectedTranslator.id,
        })
      );
  };

  // I18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorOverview.authorisations',
  });

  useEffect(() => {
    if (status === APIResponseStatus.Success) {
      handleCloseModal();
    }
  }, [status]);

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
      <CustomModal open={open} handleCloseModal={handleCloseModal}>
        <>
          <AddAuthorisation
            meetingDates={upcoming}
            onNewAuthorisationAdd={handleAddAuthorisation}
            addAuthorisationOutsideComponent={addAuthorisationOutsideComponent}
            setAddAuthorisationOutsideComponent={
              setAddAuthorisationOutsideComponent
            }
          />

          <Box
            sx={{
              mt: '4rem',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <CustomButton
              onClick={handleCloseModal}
              variant={Variant.Text}
              color={Color.Secondary}
            >
              Peruuta
            </CustomButton>
            <CustomButton
              variant={Variant.Contained}
              color={Color.Secondary}
              onClick={() => {
                setAddAuthorisationOutsideComponent(true);
              }}
              disabled={status === APIResponseStatus.InProgress}
            >
              Tallenna
            </CustomButton>
          </Box>
        </>
      </CustomModal>
      <div className="rows gapped-xs">
        <div className="columns margin-top-sm">
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
