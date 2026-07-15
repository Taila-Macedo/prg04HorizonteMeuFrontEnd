import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { apiFetch } from '../../../shared/utils/apiFetch';
import { getNotifPrefs, setNotifPrefs } from '../../../shared/utils/notificacaoPrefs';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function calcularForca(senha) {
  if (!senha) return { nivel: 'vazia', texto: '' };
  let pontos = 0;
  if (senha.length >= 8) pontos++;
  if (senha.length >= 12) pontos++;
  if (/[A-Z]/.test(senha)) pontos++;
  if (/[0-9]/.test(senha)) pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;
  if (pontos <= 1) return { nivel: 'fraca', texto: 'Fraca' };
  if (pontos <= 3) return { nivel: 'media', texto: 'Média' };
  return { nivel: 'forte', texto: 'Forte' };
}

export function useConfiguracoes() {
  const { usuario, token, logout, atualizarUsuario } = useAuth();
  const navigate = useNavigate();

  const [abaAtiva, setAbaAtiva] = useState('perfil');
  const [salvando, setSalvando] = useState(false);

  // ── Editar Perfil ──────────────────────────────────────────────────────────
  const [perfil, setPerfil] = useState({ nome: '', email: '', bio: '' });
  const [toastPerfil, setToastPerfil] = useState('');
  const [fotoPerfilPreview, setFotoPerfilPreview] = useState(null);
  const [enviandoFoto, setEnviandoFoto] = useState(false);

  useEffect(() => {
    if (usuario) {
      setPerfil({
        nome: usuario.nome ?? '',
        email: usuario.email ?? '',
        bio: usuario.bio ?? '',
      });
      if (usuario.fotoPerfil) setFotoPerfilPreview(usuario.fotoPerfil);
    }
  }, [usuario]);

  const handleSalvarPerfil = async () => {
    if (!perfil.nome.trim()) {
      setToastPerfil('❌ O nome não pode ser vazio.');
      setTimeout(() => setToastPerfil(''), 3000);
      return;
    }
    setSalvando(true);
    try {
      const res = await apiFetch(`${BASE}/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: perfil.nome.trim(),
          fotoPerfil: fotoPerfilPreview ?? usuario.fotoPerfil ?? null,
          bio: perfil.bio.trim(),
        }),
      });

      if (!res.ok) throw new Error('Erro ao salvar perfil.');

      const atualizado = await res.json();
      // Atualiza o usuário no contexto para refletir em toda a app
      atualizarUsuario(atualizado);
      setToastPerfil('Perfil atualizado com sucesso!');
      setTimeout(() => setToastPerfil(''), 3000);
    } catch (err) {
      setToastPerfil(`❌ ${err.message}`);
      setTimeout(() => setToastPerfil(''), 3000);
    } finally {
      setSalvando(false);
    }
  };

  const handleAlterarFotoPerfil = async (arquivo) => {
    if (!arquivo) return;
    setFotoPerfilPreview(URL.createObjectURL(arquivo));
    setEnviandoFoto(true);

    try {
      // 1. Sobe a foto no Cloudinary via /fotos/upload
      const formData = new FormData();
      formData.append('arquivo', arquivo);

      const uploadRes = await apiFetch(`${BASE}/fotos/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Erro ao enviar foto.');
      const { url } = await uploadRes.json();

      // 2. Salva a URL no perfil do usuário
      const res = await apiFetch(`${BASE}/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: usuario.nome,
          fotoPerfil: url,
          bio: usuario.bio ?? '',
        }),
      });

      if (!res.ok) throw new Error('Erro ao salvar foto no perfil.');
      const atualizado = await res.json();

      setFotoPerfilPreview(url);
      atualizarUsuario(atualizado);
    } catch (err) {
      console.error(err);
    } finally {
      setEnviandoFoto(false);
    }
  };

  // ── Notificações ───────────────────────────────────────────────────────────
  // Tipos reais gerados pelo backend (TipoNotificacao). A preferência controla
  // se aquele tipo aparece na lista/badge de notificações — ver useNotificacoes.
  const [notifs, setNotifsState] = useState({
    CURTIDA: true, COMENTARIO: true, FOTO_APROVADA: true, CONTEUDO_REMOVIDO: true,
  });

  // Carrega a preferência salva assim que sabemos quem é o usuário
  useEffect(() => {
    if (usuario?.id) {
      setNotifsState(getNotifPrefs(usuario.id));
    }
  }, [usuario?.id]);

  const toggleNotif = (key) => {
    setNotifsState((prev) => {
      const atualizado = { ...prev, [key]: !prev[key] };
      setNotifPrefs(usuario?.id, atualizado);
      return atualizado;
    });
  };

  // ── Alterar Senha ──────────────────────────────────────────────────────────
  const [senha, setSenha] = useState({ atual: '', nova: '', confirmar: '' });
  const [mostrarSenhas, setMostrarSenhas] = useState({ atual: false, nova: false, confirmar: false });
  const [toastSenha, setToastSenha] = useState(null);

  const forcaSenha = useMemo(() => calcularForca(senha.nova), [senha.nova]);
  const toggleMostrarSenha = (campo) => setMostrarSenhas((p) => ({ ...p, [campo]: !p[campo] }));

  const handleAlterarSenha = async () => {
    if (!senha.atual || !senha.nova || !senha.confirmar) {
      setToastSenha({ tipo: 'erro', msg: 'Preencha todos os campos.' });
      return;
    }
    if (senha.nova !== senha.confirmar) {
      setToastSenha({ tipo: 'erro', msg: 'As senhas não coincidem.' });
      return;
    }
    if (senha.nova.length < 6) {
      setToastSenha({ tipo: 'erro', msg: 'A nova senha deve ter pelo menos 6 caracteres.' });
      return;
    }

    setSalvando(true);
    try {
      const res = await apiFetch(`${BASE}/usuarios/${usuario.id}/senha`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          senhaAtual: senha.atual,
          novaSenha: senha.nova,
        }),
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.message || 'Erro ao alterar senha.');
      }

      setSenha({ atual: '', nova: '', confirmar: '' });
      setToastSenha({ tipo: 'sucesso', msg: 'Senha alterada com sucesso!' });
      setTimeout(() => setToastSenha(null), 3000);
    } catch (err) {
      setToastSenha({ tipo: 'erro', msg: err.message });
      setTimeout(() => setToastSenha(null), 3000);
    } finally {
      setSalvando(false);
    }
  };


  return {
    abaAtiva, setAbaAtiva, salvando,
    perfil, setPerfil, toastPerfil, handleSalvarPerfil,
    fotoPerfilPreview, enviandoFoto, handleAlterarFotoPerfil,
    notifs, toggleNotif,
    senha, setSenha, mostrarSenhas, toggleMostrarSenha, forcaSenha, toastSenha, handleAlterarSenha,
  };
}