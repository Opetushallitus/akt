import { AppBar, Toolbar } from '@mui/material';

import { OPHLogoViewer } from 'components/elements/OPHLogoViewer';
import { SkipLink } from 'components/elements/SkipLink';
import { LangSelector } from 'components/i18n/LangSelector';
import { ClerkNavTabs } from 'components/layouts//clerkHeader/ClerkNavTabs';
import { ClerkHeaderButtons } from 'components/layouts/clerkHeader/ClerkHeaderButtons';
import { useAppTranslation } from 'configs/i18n';
import { Direction } from 'enums/app';
import { useAuthentication } from 'hooks/useAuthentication';

const Header = (): JSX.Element => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.header.accessibility',
  });
  const [isClerkUI] = useAuthentication();

  return (
    <>
      <SkipLink href="#main-content" text={t('continueToMain')} />
      <AppBar className="header" position="static">
        <Toolbar className="header__toolbar">
          <div className="header__left">
            <OPHLogoViewer
              className="header__left__logo"
              direction={Direction.Horizontal}
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
