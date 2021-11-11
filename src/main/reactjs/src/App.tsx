import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';

import { theme } from 'configs/materialUI';
import { store } from 'configs/redux';
import { AppRouter } from 'routers/AppRouter';
import { initI18n } from 'configs/i18n';

import 'styles/styles.scss';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Initialize I18next
initI18n();

export const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <AppRouter />
    </ThemeProvider>
  </Provider>
);
