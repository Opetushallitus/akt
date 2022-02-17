import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Divider, Paper } from '@mui/material';

import { ExtLink } from 'components/elements/ExtLink';
import { OPHLogoViewer } from 'components/elements/OPHLogoViewer';
import { Svg } from 'components/elements/Svg';
import { H3, Text } from 'components/elements/Text';
import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
import { Direction } from 'enums/app';
import { useAuthentication } from 'hooks/useAuthentication';
import AKTLogo from 'public/assets/svg/akt_logo.svg';
import FooterWave from 'public/assets/svg/footer_wave.svg';

const Footer = () => {
  const { t } = useAppTranslation({ keyPrefix: 'akt.component.footer' });
  const translateCommon = useCommonTranslation();
  const [isClerkUI] = useAuthentication();

  return (
    <footer>
      {!isClerkUI && (
        <>
          <Svg
            className="footer__wave"
            src={FooterWave}
            alt={t('accessibility.waveAriaLabel')}
          />
          <Paper className="footer" elevation={3}>
            <div className="footer__info-row">
              <div className="footer__container footer__container--links">
                <ExtLink
                  text={t('links.accessibility.text')}
                  href={t('links.accessibility.link')}
                  endIcon={<OpenInNewIcon />}
                  aria-label={translateCommon('newTab')}
                />
                <ExtLink
                  text={t('links.aktHomepage.text')}
                  href={t('links.aktHomepage.link')}
                  endIcon={<OpenInNewIcon />}
                  aria-label={translateCommon('newTab')}
                />
              </div>
              <div className="footer__container footer__container--contact-details">
                <H3>{t('address.name')}</H3>
                <br />
                <Text>{t('address.street')}</Text>
                <Text>{t('address.zipCity')}</Text>
                <br />
                <div>
                  <Text className="inline-text">
                    {t('address.phone.title')}
                  </Text>
                  <Text className="inline-text bold">
                    {t('address.phone.number')}
                  </Text>
                </div>
              </div>
              <div className="footer__container">
                <Svg
                  className={'footer__container__logo--akt'}
                  src={AKTLogo}
                  alt={translateCommon('aktLogo')}
                />
              </div>
            </div>

            <div className="footer__logo-row">
              <Divider className="footer__logo-row__divider">
                <OPHLogoViewer
                  className="footer__container__logo--oph"
                  direction={Direction.Vertical}
                />
              </Divider>
            </div>
          </Paper>
        </>
      )}
    </footer>
  );
};

export default Footer;
