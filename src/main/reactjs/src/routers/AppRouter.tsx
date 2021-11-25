import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Footer from 'components/layouts/Footer';
import Header from 'components/layouts/Header';
import { HomePage } from 'pages/HomePage';

export const AppRouter: FC = () => (
  <BrowserRouter>
    <div className="app">
      <div className="appbar">
        <Header />
      </div>
      <main className="content">
        <div className="content__container">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </main>
      <div className="footer">
        <Footer />
      </div>
    </div>
  </BrowserRouter>
);
