import { FC } from 'react';
import { Paper, Link } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTranslation } from 'react-i18next';

import { Text } from 'components/elements/Text';
import { ExtLink } from 'components/elements/ExtLink';
import { Svg } from 'components/elements/Svg';
import Logo from '../../../public/assets/svg/logo.svg';

const Footer: FC = () => {
  const { t } = useTranslation();

  return (
    <Paper className="footer" elevation={3} component="footer">
      <div className="footer__container">
        <ExtLink
          text="akt.component.footer.links.aktHomepage.text"
          href="akt.component.footer.links.aktHomepage.link"
          endIcon={<OpenInNewIcon />}
        />
        <ExtLink
          text="akt.component.footer.links.accessibility.text"
          href="akt.component.footer.links.accessibility.link"
          endIcon={<OpenInNewIcon />}
        />
        <Text>{t('akt.component.footer.links.mail.text')}</Text>
        <Link
          href={`mailto:${t('akt.component.footer.links.mail.link')}`}
          underline="none"
          variant="button"
          color="secondary"
        >
          {t('akt.component.footer.links.mail.link')}
        </Link>
        <Text>{t('akt.component.footer.links.mail.workingTime')}</Text>
      </div>
      <div className="footer__container">
        <Text>{t('akt.component.footer.address.street')}</Text>
        <Text>{t('akt.component.footer.address.zipCity')}</Text>
        <br />
        <Text>{t('akt.component.footer.address.phone')}</Text>
        <Text>{t('akt.component.footer.address.fax')}</Text>
      </div>
      <div className="footer__container">
        <Svg
          className="header__left__logo"
          src={Logo}
          alt={t('akt.component.header.logo.alt')}
        />
      </div>
    </Paper>
  );
};

export default Footer;
