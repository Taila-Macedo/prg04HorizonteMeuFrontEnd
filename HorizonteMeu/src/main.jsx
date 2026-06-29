import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './shared/contexts/AuthContext';
import { FavoritosProvider } from './shared/contexts/FavoritosContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AuthProvider envolve tudo para que qualquer tela acesse useAuth() */}
    <AuthProvider>
      <FavoritosProvider>
        <App />
      </FavoritosProvider>
    </AuthProvider>
  </React.StrictMode>
);