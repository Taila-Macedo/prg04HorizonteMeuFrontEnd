/**
 * Serviço de API para o Painel de Administração
 * Lida com todas as chamadas ao backend
 */

const API_BASE_URL = 'http://localhost:8080/api'; // Ajuste para a URL do seu backend

/**
 * Utilitário para chamadas fetch com autenticação
 */
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message || 'Erro na requisição');
  }

  return response.status !== 204 ? response.json() : null;
};

export const adminService = {
  // Gestão de Usuários
  getUsers: () => fetchWithAuth('/usuarios'),
  getUserById: (id) => fetchWithAuth(`/usuarios/${id}`),
  deleteUser: (id) => fetchWithAuth(`/usuarios/${id}`, { method: 'DELETE' }),
  updateUser: (id, data) => fetchWithAuth(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Gestão de Fotos
  getPendingPhotos: () => fetchWithAuth('/fotos/aprovacao?aprovado=false'),
  approvePhoto: (id) => fetchWithAuth(`/fotos/aprovar/${id}`, { method: 'PATCH' }),
  rejectPhoto: (id) => fetchWithAuth(`/fotos/${id}`, { method: 'DELETE' }),

  // Gestão de Pontos Turísticos
  getPoints: () => fetchWithAuth('/pontos'),
  createPoint: (data) => fetchWithAuth('/pontos', { method: 'POST', body: JSON.stringify(data) }),
  updatePoint: (id, data) => fetchWithAuth(`/pontos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePoint: (id) => fetchWithAuth(`/pontos/${id}`, { method: 'DELETE' }),

  // Métricas
  getDashboardMetrics: async () => {
    // Exemplo de como agregar métricas se não houver um endpoint específico
    try {
      // Se tiver endpoint real: return fetchWithAuth('/admin/metrics');
      // Mock para demonstração se falhar:
      return {
        usersCount: 1284,
        pointsCount: 348,
        pendingPhotosCount: 7,
        pendingReportsCount: 4
      };
    } catch (e) {
      console.error('Erro ao buscar métricas', e);
      return null;
    }
  }
};
