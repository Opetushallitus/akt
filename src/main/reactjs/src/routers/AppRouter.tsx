import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Footer from 'components/layouts/Footer';
import Header from 'components/layouts/Header';
import { HomePage } from 'pages/PublicTranslatorsHomePage';
import { NotFoundPage } from 'pages/NotFoundPage';

export const AppRouter: FC = () => (
  <BrowserRouter>
    <div className="app">
      <Header />
      <main className="content">
        <div className="content__container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  </BrowserRouter>
);
