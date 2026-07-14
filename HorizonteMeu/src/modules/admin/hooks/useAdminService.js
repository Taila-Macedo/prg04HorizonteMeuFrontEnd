const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const fetchWithAuth = async (endpoint, token, options = {}) => {
  const headers = {
    ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const response = await fetch(`${BASE}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    const erro = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(erro.message || erro.mensagem || 'Erro na requisição');
  }
  return response.status !== 204 ? response.json() : null;
};

const extrairLista = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  return [];
};

export const adminService = {
  // Usuários — GET /usuarios retorna Page<>, extraímos .content
  getUsers:   async (token) => extrairLista(await fetchWithAuth('/usuarios?size=100', token)),
  getUserById: (id, token)  => fetchWithAuth(`/usuarios/${id}`, token),
  deleteUser:  (id, token)  => fetchWithAuth(`/usuarios/${id}`, token, { method: 'DELETE' }),
  updateUser:  (id, data, token) => fetchWithAuth(`/usuarios/${id}`, token, { method: 'PUT', body: JSON.stringify(data) }),

  // Fotos pendentes — retorna lista pura (não paginada)
  getPendingPhotos: (token)      => fetchWithAuth('/fotos/aprovacao?aprovado=false', token),
  approvePhoto:     (id, token)  => fetchWithAuth(`/fotos/aprovar/${id}`, token, { method: 'PATCH' }),
  rejectPhoto:      (id, token)  => fetchWithAuth(`/fotos/${id}`, token, { method: 'DELETE' }),

  // Pontos turísticos — GET /pontos retorna Page<>, extraímos .content
  getPoints:   async (token) => extrairLista(await fetchWithAuth('/pontos?size=100', token)),
  deletePoint: (id, token)   => fetchWithAuth(`/pontos/${id}`, token, { method: 'DELETE' }),

  // Denúncias — GET /denuncias/status/{status} retorna Page<>, extraímos .content
  getPendingReports: async (token) =>
    extrairLista(await fetchWithAuth('/denuncias/status/PENDENTE?size=100', token)),
  resolveReport: (id, token) =>
    fetchWithAuth(`/denuncias/${id}/resolver`, token, { method: 'PATCH' }),
  rejectReport: (id, token) =>
    fetchWithAuth(`/denuncias/${id}/rejeitar`, token, { method: 'PATCH' }),
  resolveReportExcluindoConteudo: (id, token) =>
    fetchWithAuth(`/denuncias/${id}/resolver-excluindo`, token, { method: 'PATCH' }),
};