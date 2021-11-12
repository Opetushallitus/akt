import { ChangeEvent, FC, useState } from 'react';
import {
  Box,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Checkbox,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StyledTableRow } from 'components/tables/Table';
import { H1, H3, Text } from 'components/elements/Text';

interface LanguagePair {
  from: string;
  to: string;
}

interface InterpreterDetails {
  name: string;
  languagePairs: Array<LanguagePair>;
  areasOfOperation: Array<string>;
}

const testData: Array<InterpreterDetails> = [
  {
    name: 'Essi Esimerkki',
    languagePairs: [
      { from: 'suomi', to: 'englanti' },
      { from: 'suomi', to: 'espanja' },
    ],
    areasOfOperation: ['Uusimaa', 'Pirkanmaa'],
  },
  {
    name: 'Teuvo Testitapaus',
    languagePairs: [{ from: 'suomi', to: 'englanti' }],
    areasOfOperation: ['Koko Suomi'],
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
    areasOfOperation: ['Koko Suomi'],
  },
];

const InterpreterListing = ({
  interpreters,
}: {
  interpreters: Array<InterpreterDetails>;
}) => {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleRowClick = (rowIdx: number) => {
    if (selected.has(rowIdx)) {
      setSelected((prev) => {
        return new Set(Array.from(prev).filter((x) => x != rowIdx));
      });
    } else {
      setSelected((prev) => new Set(prev.add(rowIdx)));
    }
  };

  const interpreterDetailsRow = (
    { name, languagePairs, areasOfOperation }: InterpreterDetails,
    idx: number
  ) => {
    const isRowSelected = selected.has(idx);

    return (
      <StyledTableRow
        key={page * rowsPerPage + idx}
        selected={isRowSelected}
        onClick={() => handleRowClick(idx)}
      >
        <TableCell padding="checkbox">
          <Checkbox checked={isRowSelected} />
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
          {areasOfOperation.map((area, j) => (
            <Text key={j}>{area}</Text>
          ))}
        </TableCell>
      </StyledTableRow>
    );
  };
  return (
    <Paper elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selected.size == interpreters.length}
                indeterminate={
                  selected.size > 0 && selected.size < interpreters.length
                }
                onChange={(event) => {
                  if (event.target.checked) {
                    setSelected(
                      new Set(Array.from(new Array(interpreters.length).keys()))
                    );
                  } else {
                    setSelected(new Set());
                  }
                }}
              ></Checkbox>
            </TableCell>
            <TableCell>
              <H3>{t('interpreter.name')}</H3>
            </TableCell>
            <TableCell>
              <H3>{t('interpreter.language_pairs')}</H3>
            </TableCell>
            <TableCell>
              <H3>{t('interpreter.area_of_operation')}</H3>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {interpreters
            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
            .map((value, idx) =>
              interpreterDetailsRow(value, page * rowsPerPage + idx)
            )}
        </TableBody>
      </Table>
      <TablePagination
        count={interpreters.length}
        component="div"
        onPageChange={(_event, newPage) => setPage(newPage)}
        page={page}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 20, 50]}
        labelRowsPerPage={t('component.table.pagination.rows_per_page')}
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
        <InterpreterListing
          interpreters={[
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
