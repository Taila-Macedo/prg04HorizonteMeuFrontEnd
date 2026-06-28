import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { useUploadFoto } from '../../../shared/hooks/useUploadFoto';

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
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const { uploadFoto, carregando: enviandoFoto } = useUploadFoto();

  const [abaAtiva, setAbaAtiva] = useState('perfil');
  const [salvando, setSalvando] = useState(false);

  // ── Editar Perfil ──
  const [perfil, setPerfil] = useState({ nome: '', email: '', bio: '' });
  const [toastPerfil, setToastPerfil] = useState('');
  const [fotoPerfilPreview, setFotoPerfilPreview] = useState(null);

  useEffect(() => {
    if (usuario) {
      setPerfil({
        nome: usuario.nome ?? '',
        email: usuario.email ?? '',
        bio: usuario.bio ?? '',
      });
    }
  }, [usuario]);

  const handleSalvarPerfil = async () => {
    setSalvando(true);
    // TODO: PUT /usuarios/{id}   body: { nome, email, nomeUsuario, bio }
    await new Promise((r) => setTimeout(r, 700));
    setSalvando(false);
    setToastPerfil('Perfil atualizado com sucesso!');
    setTimeout(() => setToastPerfil(''), 3000);
  };

  const handleAlterarFotoPerfil = async (arquivo) => {
    if (!arquivo) return;
    setFotoPerfilPreview(URL.createObjectURL(arquivo));

    const resultado = await uploadFoto({
      arquivo,
      idUsuario: usuario?.id,
    });

    if (resultado) {
      // TODO: atualizar usuário no contexto com resultado.url
    }
  };

  // ── Notificações ──
  const [notifs, setNotifs] = useState({
    favoritos: true, roteiros: true, lembretes: true, promocoes: true, comentarios: false,
  });

  const toggleNotif = (key) => {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));
    // TODO: PATCH /usuarios/{id}/notificacoes
  };

  // ── Alterar Senha ──
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
    // TODO: PUT /usuarios/{id}/senha   body: { senhaAtual, novaSenha }
    await new Promise((r) => setTimeout(r, 700));
    setSalvando(false);
    setSenha({ atual: '', nova: '', confirmar: '' });
    setToastSenha({ tipo: 'sucesso', msg: 'Senha alterada com sucesso!' });
    setTimeout(() => setToastSenha(null), 3000);
  };

  // ── Excluir Conta ──
  const [excluir, setExcluir] = useState({ senha: '', confirmacao: '', ciente: false });

  const handleExcluirConta = async () => {
    if (!excluir.senha || excluir.confirmacao !== 'EXCLUIR MINHA CONTA' || !excluir.ciente) return;
    setSalvando(true);
    // TODO: DELETE /usuarios/{id}   body: { senha }
    await new Promise((r) => setTimeout(r, 800));
    setSalvando(false);
    logout();
    navigate('/login');
  };

  return {
    abaAtiva, setAbaAtiva, salvando,
    perfil, setPerfil, toastPerfil, handleSalvarPerfil,
    fotoPerfilPreview, enviandoFoto, handleAlterarFotoPerfil,
    notifs, toggleNotif,
    senha, setSenha, mostrarSenhas, toggleMostrarSenha, forcaSenha, toastSenha, handleAlterarSenha,
    excluir, setExcluir, handleExcluirConta,
  };
}