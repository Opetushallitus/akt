import { FC, useEffect } from 'react';
import { Box, Grid } from '@mui/material';

import { useAppDispatch, useAppSelector } from 'configs/redux';
import { publicUIViewSelector } from 'redux/selectors/publicUIView';
import { PublicUIViews } from 'enums/app';
import { ContactRequestPage } from 'pages/ContactRequestPage';
import { PublicTranslatorsGrid } from 'components/publicTranslator/PublicTranslatorsGrid';
import { loadPublicTranslators } from 'redux/actions/publicTranslator';

export const PublicHomePage: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadPublicTranslators);
  }, [dispatch]);

  const { currentView } = useAppSelector(publicUIViewSelector);

  return (
    <Box className="homepage">
      <Grid
        container
        rowSpacing={4}
        direction="column"
        className="homepage__grid-container"
      >
        {currentView == PublicUIViews.ContactRequest ? (
          <ContactRequestPage />
        ) : (
          <PublicTranslatorsGrid />
        )}
      </Grid>
    </Box>
  );
};
