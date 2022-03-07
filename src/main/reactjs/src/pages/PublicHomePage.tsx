import { Box, Grid } from '@mui/material';
import { FC, useEffect } from 'react';

import { AddAuthorisation } from 'components/clerkTranslator/new/AddAuthorisation';
import { PublicTranslatorGrid } from 'components/publicTranslator/PublicTranslatorGrid';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { PublicUIViews } from 'enums/app';
import { ContactRequestPage } from 'pages/ContactRequestPage';
import { loadPublicTranslators } from 'redux/actions/publicTranslator';
import { publicUIViewSelector } from 'redux/selectors/publicUIView';

export const PublicHomePage: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadPublicTranslators);
  }, [dispatch]);

  const { currentView } = useAppSelector(publicUIViewSelector);

  return (
    <Box className="public-homepage">
      <Grid
        container
        rowSpacing={4}
        direction="column"
        className="public-homepage__grid-container"
      >
        <AddAuthorisation />
        {currentView == PublicUIViews.ContactRequest ? (
          <ContactRequestPage />
        ) : (
          <PublicTranslatorGrid />
        )}
      </Grid>
    </Box>
  );
};
