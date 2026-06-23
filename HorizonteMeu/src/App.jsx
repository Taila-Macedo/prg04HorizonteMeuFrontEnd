import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './modules/dashboard/pages/Dashboard';
import LoginPage from './modules/auth/pages/Login';
import CadastroPage from './modules/auth/pages/Cadastro';
import PainelAdminPage from './modules/admin/pages/PainelAdm';
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
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;