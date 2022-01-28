import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { H1, H2, Text } from 'components/elements/Text';
import { TextBox } from 'components/elements/TextBox';
import { ProgressIndicator } from 'components/elements/ProgressIndicator';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import {
  useAppTranslation,
  useKoodistoLanguagesTranslation,
} from 'configs/i18n';
import { APIResponseStatus } from 'enums/api';
import { AppRoutes, Color, Severity, Variant } from 'enums/app';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
import { clerkTranslatorsSelector } from 'redux/selectors/clerkTranslator';
import { loadClerkTranslators } from 'redux/actions/clerkTranslator';
import { showNotifierToast } from 'redux/actions/notifier';
import { Utils } from 'utils';
import { DateUtils } from 'utils/date';
import { Authorisation } from 'interfaces/authorisation';

const paramAsNum = (param: string | undefined) => {
  if (param) {
    return parseInt(param);
  }
};

const TranslatorNotFoundView = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.pages.clerkTranslatorDetailsPage.translatorNotFoundView',
  });

  return (
    <Paper
      elevation={3}
      className="clerk-translator-details-page__content-container"
    >
      <H2>{t('title')}</H2>
    </Paper>
  );
};

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
            <TableCell>{t('authorisation.caseId')}</TableCell>
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
                <Text>{i}</Text>
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

const TranslatorDetailsView = ({
  translator,
}: {
  translator: ClerkTranslator;
}) => {
  return (
    <Paper
      elevation={3}
      className="clerk-translator-details-page__content-container"
    >
      <TopControls />
      <div className="rows gapped">
        <TranslatorDetailsSection translator={translator} />
        <AuthorisationDetailsSection translator={translator} />
      </div>
    </Paper>
  );
};

const TranslatorViewDispatcher = () => {
  const params = useParams();
  const translatorId = paramAsNum(params.translatorId);

  const { status, translators } = useAppSelector(clerkTranslatorsSelector);
  // TODO Instead of looking up translator here and passing it along to child components,
  // we might wish to instead maintain the selected (or added / updated) translator details
  // as its own entity in redux. This decision could ideally be done when implementing the views
  // for adding new / updating existing translator.
  // When making this decision, plan for easy reusability of UI code!
  const translator = translatorId
    ? translators.find(({ id }) => translatorId == id)
    : undefined;

  switch (status) {
    case APIResponseStatus.NotStarted:
    case APIResponseStatus.InProgress:
      return <ProgressIndicator color={Color.Secondary} />;
    case APIResponseStatus.Cancelled:
    case APIResponseStatus.Error:
      return <div />;
    case APIResponseStatus.Success:
      if (translator) {
        return <TranslatorDetailsView translator={translator} />;
      } else {
        return <TranslatorNotFoundView />;
      }
  }
};

export const ClerkTranslatorDetailsPage = () => {
  // i18n
  const { t } = useAppTranslation({ keyPrefix: 'akt' });
  // Redux
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(clerkTranslatorsSelector);

  useEffect(() => {
    if (status == APIResponseStatus.NotStarted) {
      dispatch(loadClerkTranslators);
    } else if (status == APIResponseStatus.Error) {
      dispatch(
        showNotifierToast(
          Utils.createNotifierToast(Severity.Error, t('errors.loadingFailed'))
        )
      );
    }
  }, [dispatch, status, t]);

  return (
    <Box className="clerk-send-email-page">
      <H1>{t('pages.clerkTranslatorDetailsPage.title')}</H1>
      <TranslatorViewDispatcher />
    </Box>
  );
};
