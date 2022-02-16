import { AppBar, Toolbar } from '@mui/material';
import { FC } from 'react';

import { SkipLink } from 'components/elements/SkipLink';
import { Svg } from 'components/elements/Svg';
import { LangSelector } from 'components/i18n/LangSelector';
import { ClerkNavTabs } from 'components/layouts//clerkHeader/ClerkNavTabs';
import { ClerkHeaderButtons } from 'components/layouts/clerkHeader/ClerkHeaderButtons';
import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
import { useAuthentication } from 'hooks/useAuthentication';
import Logo from 'public/assets/svg/logo.svg';

const Header: FC = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.header.accessibility',
  });
  const translateCommon = useCommonTranslation();
  const [isClerkUI] = useAuthentication();

  return (
    <>
      <SkipLink href="#main-content" text={t('continueToMain')} />
      <AppBar className="header" position="static">
        <Toolbar className="header__toolbar">
          <div className="header__left">
            <Svg
              className="header__left__logo"
              src={Logo}
              alt={translateCommon('ophLogo')}
            />
          </div>
          <div className="header__center">{isClerkUI && <ClerkNavTabs />}</div>
          <div className="header__right">
            {isClerkUI && <ClerkHeaderButtons />}
            <LangSelector />
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
