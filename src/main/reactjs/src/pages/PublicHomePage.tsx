import { FC, useEffect } from 'react';
import { Box, Grid } from '@mui/material';

import { useAppDispatch, useAppSelector } from 'configs/redux';
import { UIStateSelector } from 'redux/selectors/navigation';
import { UIStates } from 'enums/app';
import { ContactRequestForm } from 'components/contactRequest/ContactRequestForm';
import { PublicTranslatorsGrid } from 'components/translator/PublicTranslatorsList';
import { loadPublicTranslators } from 'redux/actions/publicTranslator';

export const PublicHomePage: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadPublicTranslators);
  }, [dispatch]);

  const { state: currentUIState } = useAppSelector(UIStateSelector);

  return (
    <Box className="homepage">
      <Grid
        container
        rowSpacing={4}
        direction="column"
        className="homepage__grid-container"
      >
        {currentUIState == UIStates.ContactRequest ? (
          <ContactRequestForm />
        ) : (
          <PublicTranslatorsGrid />
        )}
      </Grid>
    </Box>
  );
};
