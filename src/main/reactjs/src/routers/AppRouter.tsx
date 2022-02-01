import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Footer from 'components/layouts/Footer';
import Header from 'components/layouts/Header';
import { Notifier } from 'components/notification/Notifier';
import { AppRoutes } from 'enums/app';
import { ClerkHomePage } from 'pages/ClerkHomePage';
import { ClerkSendEmailPage } from 'pages/ClerkSendEmailPage';
import { NotFoundPage } from 'pages/NotFoundPage';
import { PublicHomePage } from 'pages/PublicHomePage';

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
              element={<PublicHomePage />}
            />
            <Route path={AppRoutes.ClerkHomePage} element={<ClerkHomePage />} />
            <Route
              path={AppRoutes.ClerkSendEmailPage}
              element={<ClerkSendEmailPage />}
            />
            <Route path={AppRoutes.NotFoundPage} element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  </BrowserRouter>
);
