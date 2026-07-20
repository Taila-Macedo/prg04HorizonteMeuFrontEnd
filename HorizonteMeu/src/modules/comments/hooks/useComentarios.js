import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { useUploadFoto } from '../../../shared/hooks/useUploadFoto';
import { apiFetch } from '../../../shared/utils/apiFetch';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function useComentarios(pontoId) {
  const { usuario, token } = useAuth();
  const { uploadFoto } = useUploadFoto();
  const comentarioFotoRef = useRef(null);

  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const [novoComentario, setNovoComentario] = useState({
    texto: '',
    nota: 5,
    fotoPreview: null,
    fotoFile: null,
  });

  const [denunciaModal, setDenunciaModal] = useState({
    aberto: false,
    comentarioId: null,
  });

  const [motivoDenuncia, setMotivoDenuncia] = useState('');

  const [confirmacaoExcluir, setConfirmacaoExcluir] = useState({
    aberto: false,
    comentarioId: null,
  });

  // Carrega comentários do ponto
  useEffect(() => {
    const carregarComentarios = async () => {
      try {
        setLoading(true);
        // ALTERADO — envia idUsuario (quando logado) para o backend já
        // retornar em cada comentário se o usuário atual o curtiu ou não (RN21)
        const url = usuario?.id
          ? `${BASE}/comentarios/ponto/${pontoId}?idUsuario=${usuario.id}`
          : `${BASE}/comentarios/ponto/${pontoId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Erro ao carregar avaliações.');
        const data = await res.json();
        const lista = Array.isArray(data) ? data : [];

        // Busca o nome real de cada autor (uma vez por id, não por comentário)
        // e detecta perfis que não existem mais (usuário excluído).
        const idsUnicos = [...new Set(lista.map((c) => c.idUsuario))];
        const cacheAutores = {};

        await Promise.all(
          idsUnicos.map(async (idAutor) => {
            if (idAutor === usuario?.id) {
              cacheAutores[idAutor] = { nome: usuario?.nome, disponivel: true };
              return;
            }
            try {
              const resAutor = await apiFetch(`${BASE}/usuarios/${idAutor}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (resAutor.status === 404) {
                cacheAutores[idAutor] = { nome: 'Indisponível', disponivel: false };
                return;
              }
              if (!resAutor.ok) throw new Error();
              const dadosAutor = await resAutor.json();
              cacheAutores[idAutor] = { nome: dadosAutor.nome, disponivel: true };
            } catch {
              cacheAutores[idAutor] = { nome: 'Indisponível', disponivel: false };
            }
          })
        );

        const listaComAutores = lista.map((c) => {
          const eMeu = c.idUsuario === usuario?.id || usuario?.perfil === 'ADMINISTRADOR';
          const autor = cacheAutores[c.idUsuario] || { nome: 'Indisponível', disponivel: false };
          return {
            ...c,
            autorNome: autor.nome,
            autorDisponivel: autor.disponivel,
            meu: eMeu,
          };
        });

        setComentarios(listaComAutores);
      } catch (err) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (pontoId) carregarComentarios();
  }, [pontoId, usuario, token]);

  // ── Novo comentário ──────────────────────────────────────────────────────────

  const handleFotoComentario = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setNovoComentario((prev) => ({ ...prev, fotoPreview: preview, fotoFile: file }));
  };

  const removerFotoComentario = () => {
    setNovoComentario((prev) => ({ ...prev, fotoPreview: null, fotoFile: null }));
  };

  const enviarComentario = async () => {
    if (!novoComentario.texto.trim()) return;
    if (!usuario) {
      alert('Você precisa estar logado para comentar.');
      return;
    }

    try {
      let fotoUrl = null;

      if (novoComentario.fotoFile) {
        const formData = new FormData();
        formData.append('arquivo', novoComentario.fotoFile);

        const uploadRes = await fetch(`${BASE}/fotos/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('Erro ao enviar a foto.');
        const uploadData = await uploadRes.json();
        fotoUrl = uploadData.url;
      }

      const payload = {
        texto: novoComentario.texto.trim(),
        nota: novoComentario.nota,
        fotoUrl: fotoUrl,
        idUsuario: usuario.id,
        idPontoTuristico: Number(pontoId),
      };

      const res = await fetch(`${BASE}/comentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erro ao publicar avaliação.');

      const salvo = await res.json();

      setComentarios((prev) => [
        { ...salvo, autorNome: usuario.nome, autorDisponivel: true, meu: true },
        ...prev,
      ]);
      setNovoComentario({ texto: '', nota: 5, fotoPreview: null, fotoFile: null });

    } catch (err) {
      alert(err.message);
    }
  };

  // ── Curtir ───────────────────────────────────────────────────────────────────

  // ALTERADO (RN21): agora envia o idUsuario (obrigatório no backend) e
  // sincroniza o campo "curtido" retornado, além de bloquear cliques
  // repetidos enquanto a requisição está em andamento — evita que o
  // mesmo usuário curta o mesmo comentário mais de uma vez.
  const curtindoRef = useRef(new Set());

  const toggleCurtir = async (comentarioId) => {
    if (!token || !usuario) return;

    // Impede clique duplo/repetido enquanto a requisição anterior não terminou
    if (curtindoRef.current.has(comentarioId)) return;
    curtindoRef.current.add(comentarioId);

    try {
      const res = await fetch(
        `${BASE}/comentarios/${comentarioId}/curtir?idUsuario=${usuario.id}`,
        {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const atualizado = await res.json();
        setComentarios(prev => prev.map(c =>
          c.id === comentarioId
            ? { ...c, curtidas: atualizado.curtidas, curtido: atualizado.curtido }
            : c
        ));
      }
    } catch (err) {
      console.error('Erro ao curtir:', err);
    } finally {
      curtindoRef.current.delete(comentarioId);
    }
  };

  // ── Excluir ──────────────────────────────────────────────────────────────────

  const pedirConfirmacaoExcluir = (comentarioId) => {
    setConfirmacaoExcluir({ aberto: true, comentarioId });
  };

  const cancelarExcluir = () => {
    setConfirmacaoExcluir({ aberto: false, comentarioId: null });
  };

  const confirmarExcluir = async () => {
    try {
      const res = await fetch(`${BASE}/comentarios/${confirmacaoExcluir.comentarioId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Erro ao excluir comentário.');

      setComentarios(prev => prev.filter(c => c.id !== confirmacaoExcluir.comentarioId));
      setConfirmacaoExcluir({ aberto: false, comentarioId: null });
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Denúncia ─────────────────────────────────────────────────────────────────

  const abrirDenuncia = (comentarioId) => {
    setDenunciaModal({ aberto: true, comentarioId });
    setMotivoDenuncia('');
  };

  const fecharDenuncia = () => {
    setDenunciaModal({ aberto: false, comentarioId: null });
    setMotivoDenuncia('');
  };

  const enviarDenuncia = async () => {
    if (!motivoDenuncia.trim()) return;

    if (!usuario) {
      alert('Você precisa estar logado para denunciar.');
      return;
    }

    try {
      const payload = {
        motivo: motivoDenuncia.trim(),
        idUsuario: usuario.id,
        idComentario: denunciaModal.comentarioId,
      };

      const res = await apiFetch(`${BASE}/denuncias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const erroBody = await res.json().catch(() => ({}));
        throw new Error(erroBody.message || erroBody.mensagem || 'Erro ao enviar denúncia.');
      }

      alert('Denúncia enviada com sucesso. Nossa equipe irá analisar.');
      fecharDenuncia();
    } catch (err) {
      alert(err.message);
    }
  };

  return {
    comentarios,
    loading,
    erro,
    novoComentario,
    setNovoComentario,
    comentarioFotoRef,
    handleFotoComentario,
    removerFotoComentario,
    enviarComentario,
    toggleCurtir,
    confirmacaoExcluir,
    pedirConfirmacaoExcluir,
    cancelarExcluir,
    confirmarExcluir,
    denunciaModal,
    motivoDenuncia,
    setMotivoDenuncia,
    abrirDenuncia,
    fecharDenuncia,
    enviarDenuncia,
  };
}