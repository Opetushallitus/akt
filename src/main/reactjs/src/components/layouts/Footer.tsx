import { FC } from 'react';
import { Paper, Link } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { Text } from 'components/elements/Text';
import { ExtLink } from 'components/elements/ExtLink';
import { Svg } from 'components/elements/Svg';
import Logo from 'public/assets/svg/logo.svg';
import FooterWave from 'public/assets/svg/footer_wave.svg';
import { useAppTranslation } from 'configs/i18n';

const Footer: FC = () => {
  const { t } = useAppTranslation({ keyPrefix: 'akt.component.footer' });

  return (
    <footer>
      <Svg src={FooterWave} alt={t('logo.alt')} />
      <Paper className="footer" elevation={3}>
        <div className="footer__container">
          <ExtLink
            text={t('links.aktHomepage.text')}
            href={t('links.aktHomepage.link')}
            endIcon={<OpenInNewIcon />}
          />
          <ExtLink
            text={t('links.accessibility.text')}
            href={t('links.accessibility.link')}
            endIcon={<OpenInNewIcon />}
          />
          <Text>{t('links.mail.text')}</Text>
          <Link
            href={`mailto:${t('links.mail.link')}`}
            underline="none"
            variant="button"
            color="secondary"
          >
            {t('links.mail.link')}
          </Link>
          <Text>{t('links.mail.workingTime')}</Text>
        </div>
        <div className="footer__container">
          <Text>{t('address.street')}</Text>
          <Text>{t('address.zipCity')}</Text>
          <br />
          <Text>{t('address.phone')}</Text>
          <Text>{t('address.fax')}</Text>
        </div>
        <div className="footer__container">
          <Svg className="header__left__logo" src={Logo} alt={t('logo.alt')} />
        </div>
      </Paper>
    </footer>
  );
};

export default Footer;
