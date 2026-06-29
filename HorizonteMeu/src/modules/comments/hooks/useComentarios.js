import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { useUploadFoto } from '../../../shared/hooks/useUploadFoto';

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
        const res = await fetch(`${BASE}/comentarios/ponto/${pontoId}`);
        if (!res.ok) throw new Error('Erro ao carregar avaliações.');
        const data = await res.json();
        
        const lista = (Array.isArray(data) ? data : []).map(c => {
          const eMeu = c.idUsuario === usuario?.id || usuario?.perfil === 'ADMINISTRADOR';
          return {
            ...c,
            autorNome: eMeu ? usuario?.nome : `Viajante #${c.idUsuario}`,
            meu: eMeu
          };
        });
        
        setComentarios(lista);
      } catch (err) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (pontoId) carregarComentarios();
  }, [pontoId, usuario]);

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
        // IMPORTANTE: Não enviamos o idPontoTuristico aqui para evitar que a foto
        // seja vinculada à galeria oficial do ponto pelo backend.
        // O backend ainda salvará a foto no Cloudinary e nos devolverá a URL.
        const uploadRes = await uploadFoto({
          arquivo: novoComentario.fotoFile,
          idUsuario: usuario.id,
          legenda: `Foto da avaliação de ${usuario.nome}`
        });
        if (uploadRes) fotoUrl = uploadRes.url;
      }

      const payload = {
        texto: novoComentario.texto.trim(),
        nota: novoComentario.nota,
        fotoUrl: fotoUrl,
        idUsuario: usuario.id,
        idPontoTuristico: Number(pontoId)
      };

      const res = await fetch(`${BASE}/comentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Erro ao publicar avaliação.');

      const salvo = await res.json();
      
      const novoFormatado = {
        ...salvo,
        autorNome: usuario.nome,
        meu: true
      };
      
      setComentarios(prev => [novoFormatado, ...prev]);
      setNovoComentario({ texto: '', nota: 5, fotoPreview: null, fotoFile: null });
      
    } catch (err) {
      alert(err.message);
    }
  };

  // ── Curtir ───────────────────────────────────────────────────────────────────

  const toggleCurtir = async (comentarioId) => {
    if (!token) return;

    try {
      const res = await fetch(`${BASE}/comentarios/${comentarioId}/curtir`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const atualizado = await res.json();
        setComentarios(prev => prev.map(c => 
          c.id === comentarioId ? { ...c, curtidas: atualizado.curtidas } : c
        ));
      }
    } catch (err) {
      console.error('Erro ao curtir:', err);
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

  const enviarDenuncia = () => {
    if (!motivoDenuncia.trim()) return;
    alert('Denúncia enviada com sucesso. Nossa equipe irá analisar.');
    fecharDenuncia();
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