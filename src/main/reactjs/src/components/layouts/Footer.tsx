import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Paper } from '@mui/material';

import { ExtLink } from 'components/elements/ExtLink';
import { Svg } from 'components/elements/Svg';
import { H3, Text } from 'components/elements/Text';
import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
import { useAuthentication } from 'hooks/useAuthentication';
import FooterWave from 'public/assets/svg/footer_wave.svg';
import Logo from 'public/assets/svg/logo.svg';

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
            alt={translateCommon('frontPage')}
          />
          <Paper className="footer" elevation={3}>
            <div className="footer__container">
              <ExtLink
                text={t('links.opintopolku.text')}
                href={t('links.opintopolku.link')}
                endIcon={<OpenInNewIcon />}
              />
              <ExtLink
                text={t('links.accessibility.text')}
                href={t('links.accessibility.link')}
                endIcon={<OpenInNewIcon />}
              />
              <ExtLink
                text={t('links.aktHomepage.text')}
                href={t('links.aktHomepage.link')}
                endIcon={<OpenInNewIcon />}
              />
            </div>
            <div className="footer__container footer__container--contact-details">
              <H3>{t('address.name')}</H3>
              <br />
              <Text>{t('address.street')}</Text>
              <Text>{t('address.zipCity')}</Text>
              <br />
              <div>
                <Text className="inline-text">{t('address.phone.title')}</Text>
                <Text className="inline-text bold">
                  {t('address.phone.number')}
                </Text>
              </div>
            </div>
            <div className="footer__container">
              <Svg
                className="header__left__logo"
                src={Logo}
                alt={translateCommon('frontPage')}
              />
            </div>
          </Paper>
        </>
      )}
    </footer>
  );
};

export default Footer;
