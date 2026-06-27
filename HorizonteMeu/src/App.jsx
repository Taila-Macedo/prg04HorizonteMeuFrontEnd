// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './shared/components/PrivateRoute/PrivateRoute';
import DashboardPage from './modules/dashboard/pages/Dashboard';
import LoginPage from './modules/auth/pages/Login';
import CadastroPage from './modules/auth/pages/CadastroPage';
import RecuperarSenhaPage from './modules/auth/pages/RecuperarSenhaPage';
import PainelAdminPage from './modules/admin/pages/AdminDashboard';
import PerfilPage from './modules/profile/pages/Perfil';
import DetalhePontoPage from './modules/collections/pages/DetalhePonto';
import ListaPontosPage from './modules/collections/pages/ListaPontos';
import AdicionarPontoPage from './modules/collections/pages/AdicionarPonto';
import EditarPontoPage from './modules/collections/pages/EditarPonto';
import FavoritosPage from './modules/favorites/pages/Favoritos';
import RoteirosPage from './modules/itinerary/pages/ListaRoteiros';
import NovoRoteiroPage from './modules/itinerary/pages/NovoRoteiro';
import DetalheRoteiroPage from './modules/itinerary/pages/DetalheRoteiro';
import EditarRoteiroPage from './modules/itinerary/pages/EditarRoteiro'; 
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />

        {/* Rotas protegidas — exigem login */}
        <Route path="/dashboard"           element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/perfil"              element={<PrivateRoute><PerfilPage /></PrivateRoute>} />
        <Route path="/pontos"              element={<PrivateRoute><ListaPontosPage /></PrivateRoute>} />
        <Route path="/pontos/novo"         element={<PrivateRoute><AdicionarPontoPage /></PrivateRoute>} />
        <Route path="/pontos/:id"          element={<PrivateRoute><DetalhePontoPage /></PrivateRoute>} />
        <Route path="/pontos/:id/editar"   element={<PrivateRoute><EditarPontoPage /></PrivateRoute>} />
        <Route path="/favoritos"           element={<PrivateRoute><FavoritosPage /></PrivateRoute>} />
        <Route path="/roteiros"            element={<PrivateRoute><RoteirosPage /></PrivateRoute>} />
        <Route path="/roteiros/novo"       element={<PrivateRoute><NovoRoteiroPage /></PrivateRoute>} />
        <Route path="/roteiros/:id"        element={<PrivateRoute><DetalheRoteiroPage /></PrivateRoute>} />
        <Route path="/roteiros/:id/editar" element={<PrivateRoute><EditarRoteiroPage /></PrivateRoute>} /> {/* ← NOVO */}

        {/* Rota de admin — exige login E perfil ADMINISTRADOR */}
        <Route path="/admin" element={<PrivateRoute><PainelAdminPage /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;