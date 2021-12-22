import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Footer from 'components/layouts/Footer';
import Header from 'components/layouts/Header';
import { PublicHomePage } from 'pages/PublicHomePage';
import { NotFoundPage } from 'pages/NotFoundPage';
import { ClerkHomePage } from 'pages/ClerkHomePage';
import { AppPages } from 'enums/app';

export const AppRouter: FC = () => (
  <BrowserRouter>
    <div className="app">
      <Header />
      <main className="content">
        <div className="content__container">
          <Routes>
            <Route path={AppPages.HomePage} element={<PublicHomePage />} />
            <Route path={AppPages.ClerkPage} element={<ClerkHomePage />} />
            <Route path={AppPages.NotFoundPage} element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  </BrowserRouter>
);
