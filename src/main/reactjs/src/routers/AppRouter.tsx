import { FC, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Footer from 'components/layouts/Footer';
import Header from 'components/layouts/Header';
import { Notifier } from 'components/notification/Notifier';
import { PublicHomePage } from 'pages/PublicHomePage';
import { NotFoundPage } from 'pages/NotFoundPage';
import { ClerkHomePage } from 'pages/ClerkHomePage';
import { AppRoutes, UIStates } from 'enums/app';
import { displayUIState } from 'redux/actions/navigation';
import { useAppDispatch } from 'configs/redux';

const NavigationStateWrapper = ({
  uiState,
  children,
}: {
  uiState: UIStates;
  children: JSX.Element;
}) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(displayUIState(uiState));
  }, [dispatch, uiState]);

  return <>{children}</>;
};

const withNavigationState = (uiState: UIStates, children: JSX.Element) => (
  <NavigationStateWrapper uiState={uiState}>{children}</NavigationStateWrapper>
);

export const AppRouter: FC = () => (
  <BrowserRouter>
    <div className="app">
      <Header />
      <Notifier />
      <main className="content">
        <div className="content__container">
          <Routes>
            <Route
              path={AppRoutes.PublicHomePage}
              element={withNavigationState(
                UIStates.PublicTranslatorListing,
                <PublicHomePage />
              )}
            />
            <Route
              path={AppRoutes.ClerkHomePage}
              element={withNavigationState(
                UIStates.ClerkTranslatorRegistry,
                <ClerkHomePage />
              )}
            />
            <Route
              path={AppRoutes.NotFoundPage}
              element={withNavigationState(
                UIStates.NotFoundPage,
                <NotFoundPage />
              )}
            />
          </Routes>
        </div>
      </main>
      <Footer showWave={true} />
    </div>
  </BrowserRouter>
);
