import { Box } from '@mui/system';

import { ProgressIndicator } from 'components/elements/ProgressIndicator';
import { H2, H3 } from 'components/elements/Text';
import { ContactRequestButton } from 'components/publicTranslator/listing/ContactRequestButton';
import { PublicTranslatorListingHeader } from 'components/publicTranslator/listing/PublicTranslatorListingHeader';
import { PublicTranslatorListingRow } from 'components/publicTranslator/listing/PublicTranslatorListingRow';
import { PaginatedTable } from 'components/tables/Table';
import { useAppTranslation } from 'configs/i18n';
import { useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { useWindowProperties } from 'hooks/useWindowProperties';
import { PublicTranslator } from 'interfaces/publicTranslator';
import {
  addSelectedTranslator,
  removeSelectedTranslator,
} from 'redux/actions/publicTranslator';
import { publicTranslatorsSelector } from 'redux/selectors/publicTranslator';

const getRowDetails = (
  translator: PublicTranslator,
  selected: boolean,
  toggleSelected: () => void
) => {
  return (
    <PublicTranslatorListingRow
      translator={translator}
      selected={selected}
      toggleSelected={toggleSelected}
    />
  );
};

export const PublicTranslatorListing = ({
  status,
  translators,
}: {
  status: APIResponseStatus;
  translators: Array<PublicTranslator>;
}) => {
  const { t } = useAppTranslation({ keyPrefix: 'akt' });
  const { isPhone } = useWindowProperties();
  const { selectedTranslators } = useAppSelector(publicTranslatorsSelector);
  const selected = selectedTranslators.length;

  switch (status) {
    case APIResponseStatus.NotStarted:
    case APIResponseStatus.InProgress:
      return <ProgressIndicator color="secondary" />;
    case APIResponseStatus.Cancelled:
    case APIResponseStatus.Error:
      return (
        <Box
          minHeight="10vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <H3>{t('errors.loadingFailed')}</H3>
        </Box>
      );
    case APIResponseStatus.Success:
      return (
        <>
          <div className="columns">
            <div className="grow">
              <H2 data-testid="public-translators__selected-count-heading">
                {selected > 0
                  ? `${selected} ${t('component.table.selectedItems')}`
                  : t('component.table.title')}
              </H2>
            </div>
            {!isPhone && <ContactRequestButton />}
          </div>
          <PaginatedTable
            className="translator-listing"
            selectedIndices={selectedTranslators}
            addSelectedIndex={addSelectedTranslator}
            removeSelectedIndex={removeSelectedTranslator}
            data={translators}
            header={<PublicTranslatorListingHeader />}
            getRowDetails={getRowDetails}
            initialRowsPerPage={10}
            rowsPerPageOptions={[10, 20, 50]}
          />
        </>
      );
  }
};
