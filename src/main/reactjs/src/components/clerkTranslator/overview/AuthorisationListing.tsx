import {
  DeleteOutline as DeleteIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';

import { CustomIconButton } from 'components/elements/CustomIconButton';
import { CustomSwitch } from 'components/elements/CustomSwitch';
import { Text } from 'components/elements/Text';
import {
  useAppTranslation,
  useCommonTranslation,
  useKoodistoLanguagesTranslation,
} from 'configs/i18n';
import { Color } from 'enums/app';
import { AuthorisationBasisEnum } from 'enums/clerkTranslator';
import { Authorisation } from 'interfaces/authorisation';
import { AuthorisationUtils } from 'utils/authorisation';
import { DateUtils } from 'utils/date';

export const AuthorisationListing = ({
  authorisations,
}: {
  authorisations: Array<Authorisation>;
}) => {
  const translateLanguage = useKoodistoLanguagesTranslation();
  const translateCommon = useCommonTranslation();
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorOverview.authorisations',
  });
  const dayjs = DateUtils.dayjs();
  const currentDate = dayjs();

  return (
    <Table
      size="small"
      className="clerk-translator-details__authorisations-table"
      data-testid="clerk-translator-details__authorisations-table"
    >
      <TableHead>
        <TableRow>
          <TableCell>{t('fields.languagePair')}</TableCell>
          <TableCell>{t('fields.basis')}</TableCell>
          <TableCell>{t('fields.startDate')}</TableCell>
          <TableCell>{t('fields.endDate')}</TableCell>
          <TableCell>{t('fields.isEffective')}</TableCell>
          <TableCell>{t('fields.permissionToPublish')}</TableCell>
          <TableCell>{t('fields.diaryNumber')}</TableCell>
          <TableCell>{translateCommon('delete')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {authorisations.map((a, i) => (
          <TableRow
            key={a.id ?? i}
            data-testid={`authorisations-table__id-${
              a.id ?? `${i}-unsaved}`
            }-row`}
          >
            <TableCell>
              <Text>
                {`${translateLanguage(a.languagePair.from)}
             - ${translateLanguage(a.languagePair.to)}`}
              </Text>
            </TableCell>
            <TableCell>
              <div className="columns gapped-xs">
                <Text>{a.basis}</Text>
                {a.basis === AuthorisationBasisEnum.AUT && (
                  <Tooltip
                    title={`${t(
                      'fields.autDate'
                    )}: ${DateUtils.formatOptionalDate(a.autDate)}`}
                    arrow
                    placement="bottom"
                  >
                    <CustomIconButton>
                      <InfoIcon color={Color.Secondary} />
                    </CustomIconButton>
                  </Tooltip>
                )}
              </div>
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
              <CustomSwitch
                value={a.permissionToPublish}
                leftLabel={translateCommon('no')}
                rightLabel={translateCommon('yes')}
              />
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
