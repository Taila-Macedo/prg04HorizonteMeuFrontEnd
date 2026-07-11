// Helper central pra chamadas autenticadas à API.
//
// Por que existe: o backend agora devolve 401 quando o token está ausente,
// expirado ou inválido (antes vinha 403 pra tudo, e não dava pra diferenciar
// "sessão morreu" de "você não tem permissão"). Esse helper centraliza a
// reação ao 401 — limpa a sessão salva e manda pro login — pra não precisar
// repetir essa lógica em cada hook que faz fetch.
//
// Uso:
//   const res = await apiFetch(`${BASE}/favoritos/usuario/${id}`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   if (!res.ok) throw new Error('Erro ao carregar favoritos.');

const CHAVE_TOKEN = 'hm_token';
const CHAVE_USUARIO = 'hm_usuario';

let redirecionando = false;

function sessaoExpirou() {
  // Evita disparar o redirect mais de uma vez se várias chamadas
  // falharem com 401 ao mesmo tempo (ex: várias telas buscando dados juntas).
  if (redirecionando) return;
  redirecionando = true;

  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_USUARIO);

  // Redirect "cru" (não via react-router) de propósito: esse helper roda
  // fora da árvore de componentes, então não tem acesso a useNavigate().
  // O reload garante que o AuthProvider suba já sem sessão.
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

/**
 * Wrapper de fetch para chamadas autenticadas.
 * Se a API responder 401, limpa a sessão local e redireciona pro login.
 * Não trata 403 como sessão expirada — 403 agora significa "autenticado,
 * mas sem permissão pra essa rota", e cada tela decide o que fazer com isso.
 */
export async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);

  if (res.status === 401) {
    sessaoExpirou();
  }

  return res;
}