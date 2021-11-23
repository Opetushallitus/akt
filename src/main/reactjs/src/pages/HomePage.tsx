import { Box, Grid, Paper } from '@mui/material';
import { FC } from 'react';

import { H1, Text } from 'components/elements/Text';
import { TranslatorDetails } from 'interfaces/translator';
import { TranslatorListing } from 'components/translators/TranslatorListing';

const testData: Array<TranslatorDetails> = [
  {
    name: 'Essi Esimerkki',
    languagePairs: [
      { from: 'suomi', to: 'englanti' },
      { from: 'suomi', to: 'espanja' },
    ],
    hometown: 'Helsinki',
  },
  {
    name: 'Teuvo Testitapaus',
    languagePairs: [{ from: 'suomi', to: 'englanti' }],
    hometown: 'Kittilä',
  },
  {
    name: 'Maisa Moniosaaja',
    languagePairs: [
      { from: 'suomi', to: 'englanti' },
      { from: 'suomi', to: 'portugali' },
      { from: 'suomi', to: 'ranska' },
      { from: 'ranska', to: 'suomi' },
      { from: 'englanti', to: 'suomi' },
    ],
    hometown: 'Espoo',
  },
];

export const HomePage: FC = () => (
  <Box>
    <Grid container rowSpacing={4} direction="column">
      <Grid item>
        <Box>
          <H1>Auktorisoitujen kääntäjien rekisteri</H1>
          <Text>
            Auktorisoitujen kääntäjien tutkintolautakunta ylläpitää rekisteriä
            auktorisoiduista kääntäjistä. Hakukoneella voit hakea kääntäjiä joko
            nimen tai käännöskielen mukaan. Hakutuloksista saat esiin tiedot
            auktorisoidun kääntäjän nimestä, asuinkunnasta sekä siitä, mistä
            kielestä mihin kieleen hänellä on oikeus toimia auktorisoituna
            kääntäjänä. Tutkintolautakunta ei valitettavasti voi julkaista
            kääntäjien yhteystietoja. Yhteystiedot voi pyytää sähköpostilla
            osoitteesta <b>auktoris.lautakunta@oph.fi</b>
          </Text>
        </Box>
      </Grid>
      <Grid item>
        <Paper elevation={3}>
          <TranslatorListing
            translators={[
              ...testData,
              ...testData,
              ...testData,
              ...testData,
              ...testData,
            ]}
          />
        </Paper>
      </Grid>
    </Grid>
  </Box>
);
