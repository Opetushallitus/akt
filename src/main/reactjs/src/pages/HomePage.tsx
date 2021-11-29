import { Box, Grid, Paper } from '@mui/material';
import { FC, useEffect } from 'react';

import { H1, Text } from 'components/elements/Text';
import { TranslatorListing } from 'components/translators/TranslatorListing';
import { useAppDispatch, useAppSelector } from 'configs/redux';

export const HomePage: FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch({ type: 'TRANSLATOR_DETAILS/LOAD' });
  }, [dispatch]);
  const storedTranslators = useAppSelector((state) => state.translatorDetails);
  return (
    <Box>
      <Grid container rowSpacing={4} direction="column">
        <Grid item>
          <Box>
            <H1>Auktorisoitujen kääntäjien rekisteri</H1>
            <Text>
              Auktorisoitujen kääntäjien tutkintolautakunta ylläpitää rekisteriä
              auktorisoiduista kääntäjistä. Hakukoneella voit hakea kääntäjiä
              joko nimen tai käännöskielen mukaan. Hakutuloksista saat esiin
              tiedot auktorisoidun kääntäjän nimestä, asuinkunnasta sekä siitä,
              mistä kielestä mihin kieleen hänellä on oikeus toimia
              auktorisoituna kääntäjänä. Tutkintolautakunta ei valitettavasti
              voi julkaista kääntäjien yhteystietoja. Yhteystiedot voi pyytää
              sähköpostilla osoitteesta <b>auktoris.lautakunta@oph.fi</b>
            </Text>
          </Box>
        </Grid>
        <Grid item>
          <Paper elevation={3}>
            <TranslatorListing
              status={storedTranslators.status}
              translators={storedTranslators.allTranslators}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
