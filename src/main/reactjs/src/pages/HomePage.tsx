import {
  Box,
  Grid,
  TableCell,
  Checkbox,
  Paper,
  TableHead,
  TableRow,
} from '@mui/material';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  StyledTableRow,
  PaginatedTable,
  Selectable,
} from 'components/tables/Table';
import { H1, H3, Text } from 'components/elements/Text';
import { TranslatorDetails } from 'interfaces/translator';

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

const ListingHeader = ({
  selectedItems,
  totalItems,
  toggleAllSelected,
}: {
  selectedItems: number;
  totalItems: number;
  toggleAllSelected(selected: boolean): void;
}) => {
  const { t } = useTranslation();

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectedItems == totalItems}
            indeterminate={selectedItems > 0 && selectedItems < totalItems}
            onChange={(event) => toggleAllSelected(event.target.checked)}
          ></Checkbox>
        </TableCell>
        <TableCell>
          <H3>{t('akt.translator.name')}</H3>
        </TableCell>
        <TableCell>
          <H3>{t('akt.translator.languagePairs')}</H3>
        </TableCell>
        <TableCell>
          <H3>{t('akt.translator.hometown')}</H3>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

const TranslatorListing = ({
  translators,
}: {
  translators: Array<TranslatorDetails>;
}) => {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const translatorDetailsRow = (
    { name, languagePairs, hometown }: TranslatorDetails,
    { selected, toggleSelected }: Selectable
  ) => {
    return (
      <StyledTableRow selected={selected} onClick={toggleSelected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} />
        </TableCell>
        <TableCell>
          <Text>{name}</Text>
        </TableCell>
        <TableCell>
          {languagePairs.map(({ from, to }, j) => (
            <Text key={j}>
              {from} - {to}
            </Text>
          ))}
        </TableCell>
        <TableCell>
          <Text>{hometown}</Text>
        </TableCell>
      </StyledTableRow>
    );
  };

  const toggleAllSelected = (allSelected: boolean) => {
    if (allSelected) {
      setSelected(new Set(Array.from(new Array(translators.length).keys())));
    } else {
      setSelected(new Set());
    }
  };
  return (
    <Paper elevation={3}>
      <PaginatedTable
        selectedIndices={selected}
        setSelectedIndices={setSelected}
        data={translators}
        getRowDetails={translatorDetailsRow}
        header={
          <ListingHeader
            selectedItems={selected.size}
            totalItems={translators.length}
            toggleAllSelected={toggleAllSelected}
          />
        }
        initialRowsPerPage={10}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </Paper>
  );
};

export const HomePage: FC = () => (
  <Box sx={{ width: 800, padding: '2em' }}>
    <Grid container rowSpacing={2} direction="column">
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
        <TranslatorListing
          translators={[
            ...testData,
            ...testData,
            ...testData,
            ...testData,
            ...testData,
          ]}
        />
      </Grid>
    </Grid>
  </Box>
);
