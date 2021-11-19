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
      <div className="content">
        <Routes>
          <Route path="/akt" element={<HomePage />} />
        </Routes>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  </BrowserRouter>
);
