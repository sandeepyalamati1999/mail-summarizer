import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/**@PRIMEREACT */
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primereact/resources/primereact.min.css'; // Core CSS
import 'primeicons/primeicons.css';

/** @ANTD DESIGNS */
import 'antd/dist/reset.css';

/**@Redux */
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import './css/style.css';
import './css/satoshi.css';
import { router } from './router.jsx';
import { store } from './redux/store.js';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from "@react-oauth/google";
import config from './config/config.js';

const persistor = persistStore(store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={config.googleClientId}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RouterProvider router={router} />
          <ToastContainer
            position="top-right"
            className="p-0 m-0"
            theme=""
            style={{ width: '400px', padding: 0 }}
          />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
