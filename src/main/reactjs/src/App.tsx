import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import { AppRouter } from './routers/AppRouter';
import './styles/styles.scss';

const store = configureStore();

export const App = () => (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);
