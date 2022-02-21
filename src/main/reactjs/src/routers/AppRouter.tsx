import { FC, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Footer from 'components/layouts/Footer';
import Header from 'components/layouts/Header';
import { Notifier } from 'components/notification/Notifier';
import { AppRoutes, HeaderNav } from 'enums/app';
import { ClerkHomePage } from 'pages/clerk/ClerkHomePage';
import { ClerkSendEmailPage } from 'pages/clerk/ClerkSendEmailPage';
import { ClerkTranslatorOverviewPage } from 'pages/clerk/ClerkTranslatorOverviewPage';
import { Meetings } from 'pages/Meetings';
import { NotFoundPage } from 'pages/NotFoundPage';
import { PublicHomePage } from 'pages/PublicHomePage';

export const AppRouter: FC = () => {
  const [headerNav, setHeaderNav] = useState(HeaderNav.Register);

  return (
    <BrowserRouter>
      <div className="app">
        <Header headerNav={headerNav} setHeaderNav={setHeaderNav} />
        <Notifier />
        <main className="content" id="main-content">
          <div className="content__container">
            <Routes>
              <Route
                path={AppRoutes.PublicHomePage}
                element={<PublicHomePage />}
              />
              <Route
                path={AppRoutes.ClerkHomePage}
                element={
                  headerNav === HeaderNav.Register ? (
                    <ClerkHomePage />
                  ) : (
                    <Meetings />
                  )
                }
              />
              <Route
                path={AppRoutes.ClerkSendEmailPage}
                element={<ClerkSendEmailPage />}
              />
              <Route
                path={AppRoutes.ClerkTranslatorOverviewPage}
                element={<ClerkTranslatorOverviewPage />}
              />
              <Route path={AppRoutes.NotFoundPage} element={<NotFoundPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};
