import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './modules/dashboard/pages/Dashboard';
import LoginPage from './modules/auth/pages/Login';
import CadastroPage from './modules/auth/pages/CadastroPage';
import PainelAdminPage from './modules/admin/pages/PainelAdm';
import PerfilPage from './modules/profile/pages/Perfil';
import DetalhePontoPage from './modules/collections/pages/DetalhePonto';
import FavoritosPage from './modules/favorites/pages/Favoritos';
import RoteirosPage from './modules/itinerary/pages/ListaRoteiros';
import NovoRoteiroPage from './modules/itinerary/pages/NovoRoteiro';
import './App.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<PainelAdminPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/pontos/:id" element={<DetalhePontoPage />} />
        <Route path="/favoritos" element={<FavoritosPage />} />
        <Route path="/roteiros" element={<RoteirosPage />} />
        <Route path="/roteiros/novo" element={<NovoRoteiroPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;