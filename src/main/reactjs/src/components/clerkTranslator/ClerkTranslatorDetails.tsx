import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Link } from 'react-router-dom';

import { CustomTextField } from 'components/elements/CustomTextField';
import { H2, Text } from 'components/elements/Text';
import {
  useAppTranslation,
  useKoodistoLanguagesTranslation,
} from 'configs/i18n';
import { AppRoutes, Color, Variant } from 'enums/app';
import { Authorisation } from 'interfaces/authorisation';
import {
  ClerkTranslator,
  ClerkTranslatorContactDetails,
} from 'interfaces/clerkTranslator';
import { DateUtils } from 'utils/date';

const TopControls = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorDetails',
  });

  return (
    <div className="columns">
      <Button
        component={Link}
        to={AppRoutes.ClerkHomePage}
        className="clerk-translator-details-page__content-container__back-btn"
        variant={Variant.Text}
        startIcon={<ArrowBackIcon />}
      >
        {t('buttons.back')}
      </Button>
    </div>
  );
};

const ContactDetailsField = ({
  contactDetails,
  field,
  disabled,
}: {
  contactDetails: ClerkTranslatorContactDetails;
  field: keyof ClerkTranslatorContactDetails;
  disabled?: boolean;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorDetails.contactDetails',
  });

  return (
    <CustomTextField
      label={t(field)}
      value={contactDetails[field]}
      disabled={disabled}
    />
  );
};

const TranslatorDetailsSection = ({
  translator,
}: {
  translator: ClerkTranslator;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorDetails',
  });
  const contactDetailsField = (field: keyof ClerkTranslatorContactDetails) => (
    <ContactDetailsField
      contactDetails={translator.contactDetails}
      field={field}
      disabled
    />
  );

  return (
    <>
      <div className="columns">
        <H2 className="grow">{t('header.personalInformation')}</H2>
        <Button variant={Variant.Contained} color={Color.Secondary}>
          {t('buttons.edit')}
        </Button>
      </div>
      <div className="columns gapped">
        {contactDetailsField('lastName')}
        {contactDetailsField('firstName')}
        {contactDetailsField('identityNumber')}
      </div>
      <H2>{t('header.address')}</H2>
      <div className="columns gapped">
        {contactDetailsField('street')}
        {contactDetailsField('postalCode')}
        {contactDetailsField('town')}
        {contactDetailsField('country')}
      </div>
      <H2>{t('header.contactInformation')}</H2>
      <div className="columns gapped">
        {contactDetailsField('email')}
        {contactDetailsField('phoneNumber')}
      </div>
    </>
  );
};

// TODO Used also in selectors/clerkTranslator.ts - extract to utils?
const isAuthorisationValid = (
  { effectiveTerm }: Authorisation,
  currentDate: Date
) => {
  return !(
    effectiveTerm?.end &&
    DateUtils.isDatePartBeforeOrEqual(effectiveTerm.end, currentDate)
  );
};

const AuthorisationDetailsSection = ({
  translator,
}: {
  translator: ClerkTranslator;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorDetails',
  });
  const translateLanguage = useKoodistoLanguagesTranslation();
  const currentDate = new Date();

  return (
    <>
      <div className="columns">
        <H2 className="grow">{t('header.authorisations')}</H2>
        <Button
          variant={Variant.Contained}
          color={Color.Secondary}
          startIcon={<AddIcon />}
        >
          {t('buttons.addAuthorisation')}
        </Button>
      </div>
      <Table
        size="small"
        className="clerk-translator-details-page__content-container__authorisations-table"
      >
        <TableHead>
          <TableRow>
            <TableCell>{t('authorisation.languagePair')}</TableCell>
            <TableCell>{t('authorisation.startDate')}</TableCell>
            <TableCell>{t('authorisation.endDate')}</TableCell>
            <TableCell>{t('authorisation.basis')}</TableCell>
            <TableCell>{t('authorisation.isValid')}</TableCell>
            <TableCell>{t('authorisation.isPublished')}</TableCell>
            <TableCell>{t('authorisation.diaryNumber')}</TableCell>
            <TableCell>{t('authorisation.save')}</TableCell>
            <TableCell>{t('authorisation.delete')}</TableCell>
            <TableCell>{t('authorisation.edit')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {translator.authorisations.map((a, i) => (
            <TableRow key={i}>
              <TableCell>
                <Text>
                  {`${translateLanguage(a.languagePair.from)}
                 - ${translateLanguage(a.languagePair.to)}`}
                </Text>
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
                <Text>{a.basis}</Text>
              </TableCell>
              <TableCell>
                <Text>
                  {isAuthorisationValid(a, currentDate)
                    ? t('authorisation.yes')
                    : t('authorisation.no')}
                </Text>
              </TableCell>
              <TableCell>
                <Text>
                  {a.permissionToPublish
                    ? t('authorisation.yes')
                    : t('authorisation.no')}
                </Text>
              </TableCell>
              <TableCell>
                <Text>{a.diaryNumber}</Text>
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell className="clerk-translator-details-page__content-container__authorisations-table--centered">
                <EditIcon />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export const ClerkTranslatorDetails = ({
  translator,
}: {
  translator: ClerkTranslator;
}) => {
  return (
    <>
      <TopControls />
      <div className="rows gapped">
        <TranslatorDetailsSection translator={translator} />
        <AuthorisationDetailsSection translator={translator} />
      </div>
    </>
  );
};

export const ClerkTranslatorNotFoundView = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorDetails',
  });

  return <H2>{t('notFound')}</H2>;
};
