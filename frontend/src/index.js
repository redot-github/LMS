import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { authStore, authPersistor } from './Store'; // Import the combined authStore and authPersistor

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Wrap your App component with Provider for authStore */}
      <Provider store={authStore}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
