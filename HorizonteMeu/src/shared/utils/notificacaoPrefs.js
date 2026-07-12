// Preferências de notificação por usuário — persistidas no localStorage.
//
// Por que localStorage e não backend: o back ainda não tem uma tabela de
// preferências (só tem a notificação em si, com um TipoNotificacao fixo).
// Fazer isso 100% no front resolve o caso de uso (silenciar tipos de
// notificação) sem precisar de mais uma migration antes da apresentação.
//
// Chave por usuário pra não vazar preferência de uma conta pra outra no
// mesmo navegador.

const PREFIXO = 'hm_notif_prefs_';

// Precisam bater com o enum TipoNotificacao do backend
export const TIPOS_NOTIFICACAO = ['CURTIDA', 'COMENTARIO', 'FOTO_APROVADA', 'CONTEUDO_REMOVIDO'];

const PADRAO = {
  CURTIDA: true,
  COMENTARIO: true,
  FOTO_APROVADA: true,
  CONTEUDO_REMOVIDO: true,
};

export function getNotifPrefs(idUsuario) {
  if (!idUsuario) return { ...PADRAO };

  try {
    const salvo = localStorage.getItem(PREFIXO + idUsuario);
    if (!salvo) return { ...PADRAO };
    // Mescla com o padrão pra cobrir tipos novos que ainda não existiam
    // quando a preferência foi salva
    return { ...PADRAO, ...JSON.parse(salvo) };
  } catch {
    return { ...PADRAO };
  }
}

export function setNotifPrefs(idUsuario, prefs) {
  if (!idUsuario) return;
  localStorage.setItem(PREFIXO + idUsuario, JSON.stringify(prefs));
}