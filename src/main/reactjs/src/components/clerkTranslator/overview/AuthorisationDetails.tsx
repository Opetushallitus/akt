import {
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import {
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import { CustomButton } from 'components/elements/CustomButton';
import { H3, Text } from 'components/elements/Text';
import {
  useAppTranslation,
  useCommonTranslation,
  useKoodistoLanguagesTranslation,
} from 'configs/i18n';
import { useAppSelector } from 'configs/redux';
import { Color, Variant } from 'enums/app';
import { Authorisation } from 'interfaces/authorisation';
import { clerkTranslatorOverviewSelector } from 'redux/selectors/clerkTranslatorOverview';
import { AuthorisationUtils } from 'utils/authorisation';
import { DateUtils } from 'utils/date';

const AuthorisationsListing = ({
  authorisations,
}: {
  authorisations: Array<Authorisation>;
}) => {
  const translateLanguage = useKoodistoLanguagesTranslation();
  const translateCommon = useCommonTranslation();
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorOverview.authorisations',
  });
  const currentDate = new Date();

  return (
    <Table
      size="small"
      className="clerk-translator-details__authorisations-table"
    >
      <TableHead>
        <TableRow>
          <TableCell>{t('fields.languagePair')}</TableCell>
          <TableCell>{t('fields.basis')}</TableCell>
          <TableCell>{t('fields.startDate')}</TableCell>
          <TableCell>{t('fields.endDate')}</TableCell>
          <TableCell>{t('fields.isValid')}</TableCell>
          <TableCell>{t('fields.isPublished')}</TableCell>
          <TableCell>{t('fields.diaryNumber')}</TableCell>
          <TableCell>{translateCommon('delete')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {authorisations.map((a, i) => (
          <TableRow
            key={i}
            data-testid={`authorisations-table__id-${a.id}-row`}
          >
            <TableCell>
              <Text>
                {`${translateLanguage(a.languagePair.from)}
             - ${translateLanguage(a.languagePair.to)}`}
              </Text>
            </TableCell>
            <TableCell>
              <Text>{a.basis}</Text>
            </TableCell>
            <TableCell>
              <Text>{DateUtils.formatOptionalDate(a.termBeginDate)}</Text>
            </TableCell>
            <TableCell>
              <Text>{DateUtils.formatOptionalDate(a.termEndDate)}</Text>
            </TableCell>
            <TableCell>
              <Text>
                {AuthorisationUtils.isAuthorisationEffective(a, currentDate)
                  ? translateCommon('yes')
                  : translateCommon('no')}
              </Text>
            </TableCell>
            <TableCell>
              <Switch checked={a.permissionToPublish} color={Color.Secondary} />
            </TableCell>
            <TableCell>
              <Text>{a.diaryNumber}</Text>
            </TableCell>
            <TableCell className="centered">
              <DeleteIcon className="color-red-500" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const AuthorisationDetails = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorOverview.authorisations',
  });

  const { selectedTranslator } = useAppSelector(
    clerkTranslatorOverviewSelector
  );

  return (
    <>
      <div className="columns margin-top-xxl">
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
      <AuthorisationsListing
        authorisations={
          selectedTranslator ? selectedTranslator.authorisations : []
        }
      />
    </>
  );
};
