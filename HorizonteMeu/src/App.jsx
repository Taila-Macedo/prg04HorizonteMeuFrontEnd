// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './shared/components/PrivateRoute/PrivateRoute';
import DashboardPage from './modules/dashboard/pages/Dashboard';
import LoginPage from './modules/auth/pages/Login';
import CadastroPage from './modules/auth/pages/CadastroPage';
import PainelAdminPage from './modules/admin/pages/AdminDashboard';
import PerfilPage from './modules/profile/pages/Perfil';
import DetalhePontoPage from './modules/collections/pages/DetalhePonto';
import FavoritosPage from './modules/favorites/pages/Favoritos';
import RoteirosPage from './modules/itinerary/pages/ListaRoteiros';
import NovoRoteiroPage from './modules/itinerary/pages/NovoRoteiro';
import DetalheRoteiroPage from './modules/itinerary/pages/DetalheRoteiro'; // ← NOVO
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />

        {/* Rotas protegidas — exigem login */}
        <Route path="/dashboard"      element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/perfil"         element={<PrivateRoute><PerfilPage /></PrivateRoute>} />
        <Route path="/pontos/:id"     element={<PrivateRoute><DetalhePontoPage /></PrivateRoute>} />
        <Route path="/favoritos"      element={<PrivateRoute><FavoritosPage /></PrivateRoute>} />
        <Route path="/roteiros"       element={<PrivateRoute><RoteirosPage /></PrivateRoute>} />
        <Route path="/roteiros/novo"  element={<PrivateRoute><NovoRoteiroPage /></PrivateRoute>} />
        <Route path="/roteiros/:id"   element={<PrivateRoute><DetalheRoteiroPage /></PrivateRoute>} /> {/* ← NOVO */}

        {/* Rota de admin — exige login E perfil ADMINISTRADOR */}
        <Route path="/admin" element={<PrivateRoute><PainelAdminPage /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;