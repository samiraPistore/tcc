import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './main/App.jsx';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './auth/AuthContext'; // ✅ Importa o provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> 
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
