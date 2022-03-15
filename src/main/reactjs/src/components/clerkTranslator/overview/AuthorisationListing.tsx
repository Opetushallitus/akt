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
import { useAppDispatch } from 'configs/redux';
import { Color, Severity, Variant } from 'enums/app';
import { AuthorisationBasisEnum } from 'enums/clerkTranslator';
import { Authorisation } from 'interfaces/authorisation';
import {
  deleteAuthorisation,
  updateAuthorisationPublishPermission,
} from 'redux/actions/clerkTranslatorOverview';
import { showNotifierDialog } from 'redux/actions/notifier';
import { NOTIFIER_ACTION_DO_NOTHING } from 'redux/actionTypes/notifier';
import { Utils } from 'utils';
import { AuthorisationUtils } from 'utils/authorisation';
import { DateUtils } from 'utils/date';

export const AuthorisationListing = ({
  authorisations,
}: {
  authorisations: Array<Authorisation>;
}) => {
  const dispatch = useAppDispatch();
  const translateLanguage = useKoodistoLanguagesTranslation();
  const translateCommon = useCommonTranslation();
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorOverview.authorisations',
  });
  const dayjs = DateUtils.dayjs();
  const currentDate = dayjs();

  const confirmAuthorisationPublishPermissionChange = (
    authorisation: Authorisation
  ) => {
    const notifier = Utils.createNotifierDialog(
      t('actions.changePermissionToPublish.dialog.header'),
      Severity.Info,
      t('actions.changePermissionToPublish.dialog.description'),
      [
        {
          title: translateCommon('back'),
          variant: Variant.Outlined,
          action: NOTIFIER_ACTION_DO_NOTHING,
        },
        {
          title: translateCommon('yes'),
          variant: Variant.Contained,
          action: () =>
            dispatch(updateAuthorisationPublishPermission(authorisation)),
        },
      ]
    );

    dispatch(showNotifierDialog(notifier));
  };

  const confirmAuthorisationRemoval = (authorisation: Authorisation) => {
    const notifier = Utils.createNotifierDialog(
      t('actions.removal.dialog.header'),
      Severity.Info,
      t('actions.removal.dialog.description'),
      [
        {
          title: translateCommon('back'),
          variant: Variant.Outlined,
          action: NOTIFIER_ACTION_DO_NOTHING,
        },
        {
          title: t('actions.removal.dialog.confirmButton'),
          variant: Variant.Contained,
          action: () => dispatch(deleteAuthorisation(authorisation.id)),
        },
      ]
    );

    dispatch(showNotifierDialog(notifier));
  };

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
                onChange={() => confirmAuthorisationPublishPermissionChange(a)}
                leftLabel={translateCommon('no')}
                rightLabel={translateCommon('yes')}
                aria-label={t('actions.changePermissionToPublish.ariaLabel')}
              />
            </TableCell>
            <TableCell>
              <Text>{a.diaryNumber}</Text>
            </TableCell>
            <TableCell className="centered">
              <CustomIconButton
                onClick={() => confirmAuthorisationRemoval(a)}
                aria-label={t('actions.removal.ariaLabel')}
              >
                <DeleteIcon className="color-red-500" />
              </CustomIconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
