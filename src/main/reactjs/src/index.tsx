import ReactDOM from 'react-dom';

import { App } from './App';
import { initI18n } from 'configs/i18n';

initI18n().then((_) => {
  ReactDOM.render(<App />, document.getElementById('root'));
  return;
});
