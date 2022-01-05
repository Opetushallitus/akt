import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Footer from 'components/layouts/Footer';
import Header from 'components/layouts/Header';
import { Notifier } from 'components/notification/Notifier';
import { PublicHomePage } from 'pages/PublicHomePage';
import { NotFoundPage } from 'pages/NotFoundPage';
import { ClerkHomePage } from 'pages/ClerkHomePage';
import { AppRoutes } from 'enums/app';

const PublicRoutesContainer = ({ children }: { children: JSX.Element }) => (
  <>
    <main className="content">
      <div className="content__container">{children}</div>
    </main>
    <Footer showWave={true} />
  </>
);

const ClerkRoutesContainer = ({ children }: { children: JSX.Element }) => (
  <>
    <main className="content__clerk">
      <div className="content__container">{children}</div>
    </main>
    <Footer showWave={false} />
  </>
);

export const AppRouter: FC = () => (
  <BrowserRouter>
    <div className="app">
      <Header />
      <Notifier />
      <Routes>
        <Route
          path={AppRoutes.PublicHomePage}
          element={
            <PublicRoutesContainer>
              <PublicHomePage />
            </PublicRoutesContainer>
          }
        />
        <Route
          path={AppRoutes.ClerkHomePage}
          element={
            <ClerkRoutesContainer>
              <ClerkHomePage />
            </ClerkRoutesContainer>
          }
        />
        <Route
          path={AppRoutes.NotFoundPage}
          element={
            <PublicRoutesContainer>
              <NotFoundPage />
            </PublicRoutesContainer>
          }
        />
      </Routes>
    </div>
  </BrowserRouter>
);
