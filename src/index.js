
import ReactDOM from 'react-dom/client';
import './index.scss';
import reportWebVitals from './reportWebVitals';

import App from './App';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter,HashRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <HashRouter>
      <App></App>
    </HashRouter>
  </Provider>

);


reportWebVitals();
