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

import { H2, Text } from 'components/elements/Text';
import { TextBox } from 'components/elements/TextBox';
import {
  useAppTranslation,
  useKoodistoLanguagesTranslation,
} from 'configs/i18n';
import { AppRoutes, Color, Variant } from 'enums/app';
import { Authorisation } from 'interfaces/authorisation';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
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
        id="back-btn"
        variant={Variant.Text}
        startIcon={<ArrowBackIcon />}
      >
        {t('buttons.back')}
      </Button>
    </div>
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

  return (
    <>
      <div className="columns">
        <H2 className="grow">{t('header.personalInformation')}</H2>
        <Button variant={Variant.Contained} color={Color.Secondary}>
          {t('buttons.edit')}
        </Button>
      </div>
      <div className="columns gapped">
        <TextBox
          label={t('labels.lastName')}
          value={translator.contactDetails.lastName}
          disabled
        />
        <TextBox
          label={t('labels.firstNames')}
          value={translator.contactDetails.firstName}
          disabled
        />
        <TextBox
          label={t('labels.ssn')}
          value={translator.contactDetails.identityNumber}
          disabled
        />
      </div>
      <H2>{t('header.address')}</H2>
      <div className="columns gapped">
        <TextBox
          label={t('labels.streetAddress')}
          value={translator.contactDetails.street}
          disabled
        />
        <TextBox
          label={t('labels.zipCode')}
          value={translator.contactDetails.postalCode}
          disabled
        />
        <TextBox
          label={t('labels.postOffice')}
          value={translator.contactDetails.town}
          disabled
        />
        <TextBox
          label={t('labels.country')}
          value={translator.contactDetails.country}
          disabled
        />
      </div>
      <H2>{t('header.contactInformation')}</H2>
      <div className="columns gapped">
        <TextBox
          label={t('labels.email')}
          value={translator.contactDetails.email}
          disabled
        />
        <TextBox
          label={t('labels.phoneNumber')}
          value={translator.contactDetails.phoneNumber}
          disabled
        />
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

const CenteredIconCell = ({ icon }: { icon?: JSX.Element }) => {
  // Centering icon with inline styles since class selectors get overriden by MUIs classes
  // and more specific selectors (IDs) can't be used as there will be multiple instances
  // of these components in the DOM.
  return <TableCell sx={{ textAlign: 'center' }}>{icon}</TableCell>;
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
        className="clerk-translator-details-page__content-container--authorisations-table"
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
              <CenteredIconCell />
              <CenteredIconCell />
              <CenteredIconCell icon={<EditIcon />} />
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
