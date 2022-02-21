import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {
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
import { Color, Variant } from 'enums/app';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
import { AuthorisationUtils } from 'utils/authorisation';
import { DateUtils } from 'utils/date';

export const AuthorisationDetails = ({
  translator,
}: {
  translator: ClerkTranslator;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorOverview.authorisations',
  });
  const translateLanguage = useKoodistoLanguagesTranslation();
  const translateCommon = useCommonTranslation();
  const currentDate = new Date();

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
      <Table
        size="small"
        className="clerk-translator-overview__authorisations-table"
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
            <TableCell>{translateCommon('save')}</TableCell>
            <TableCell>{translateCommon('delete')}</TableCell>
            <TableCell>{translateCommon('edit')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {translator.authorisations.map((a, i) => (
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
                <Text>
                  {DateUtils.formatOptionalDate(a.effectiveTerm?.start)}
                </Text>
              </TableCell>
              <TableCell>
                <Text>
                  {DateUtils.formatOptionalDate(a.effectiveTerm?.end)}
                </Text>
              </TableCell>
              <TableCell>
                <Text>
                  {AuthorisationUtils.isAuthorisationValid(a, currentDate)
                    ? translateCommon('yes')
                    : translateCommon('no')}
                </Text>
              </TableCell>
              <TableCell>
                <Text>
                  {a.permissionToPublish
                    ? translateCommon('yes')
                    : translateCommon('no')}
                </Text>
              </TableCell>
              <TableCell>
                <Text>{a.diaryNumber}</Text>
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell className="clerk-translator-overview__authorisations-table__centered">
                <EditIcon />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
