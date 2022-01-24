import { FC, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Footer from 'components/layouts/Footer';
import Header from 'components/layouts/Header';
import { Notifier } from 'components/notification/Notifier';
import { PublicHomePage } from 'pages/PublicHomePage';
import { NotFoundPage } from 'pages/NotFoundPage';
import { ClerkHomePage } from 'pages/ClerkHomePage';
import { ClerkSendEmailPage } from 'pages/ClerkSendEmailPage';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { loadClerkMe, loadClerkMeMock } from 'redux/actions/clerkMe';
import { clerkMeSelector } from 'redux/selectors/clerkMe';
import { AppRoutes } from 'enums/app';
import { APIResponseStatus } from 'enums/api';

export const AppRouter: FC = () => {
  const dispatch = useAppDispatch();
  const clerkMe = useAppSelector(clerkMeSelector);

  useEffect(() => {
    if (clerkMe.status === APIResponseStatus.NotStarted) {
      if (REACT_ENV_PRODUCTION) {
        dispatch(loadClerkMe);
      } else {
        dispatch(loadClerkMeMock);
      }
    }
  });

  return (
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
              <Route
                path={AppRoutes.ClerkHomePage}
                element={<ClerkHomePage />}
              />
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
};
