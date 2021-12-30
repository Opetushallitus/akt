import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';

import { theme } from 'configs/materialUI';
import { store } from 'configs/redux';
import { AppRouter } from 'routers/AppRouter';
import 'styles/styles.scss';
import { initI18n } from 'configs/i18n';

initI18n();

export const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <AppRouter />
    </ThemeProvider>
  </Provider>
);
