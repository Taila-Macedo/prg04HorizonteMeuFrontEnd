import { useState, useRef } from 'react';
import { COMENTARIOS_MOCK } from '../../../shared/mocks/mockData';

export function useComentarios(pontoId) {
  const comentarioFotoRef = useRef(null);

  const [comentarios, setComentarios] = useState(
    COMENTARIOS_MOCK[Number(pontoId)] ?? COMENTARIOS_MOCK[1] ?? []
  );

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

  const enviarComentario = () => {
    if (!novoComentario.texto.trim()) return;
    // TODO: POST /comentarios { pontoTuristicoId, texto, nota }
    const novo = {
      id: Date.now(),
      usuario: { nome: 'Você' },
      texto: novoComentario.texto,
      nota: novoComentario.nota,
      curtidas: 0,
      curtido: false,
      fotoUrl: novoComentario.fotoPreview,
      editado: false,
      meu: true, // flag para mostrar ações de editar/excluir
    };
    setComentarios((prev) => [novo, ...prev]);
    setNovoComentario({ texto: '', nota: 5, fotoPreview: null, fotoFile: null });
  };

  // ── Curtir ───────────────────────────────────────────────────────────────────

  const toggleCurtir = (comentarioId) => {
    // TODO: POST /comentarios/{id}/curtir
    setComentarios((prev) =>
      prev.map((c) => {
        if (c.id !== comentarioId) return c;
        const curtido = !c.curtido;
        return { ...c, curtido, curtidas: curtido ? c.curtidas + 1 : c.curtidas - 1 };
      })
    );
  };

  // ── Excluir ──────────────────────────────────────────────────────────────────

  const pedirConfirmacaoExcluir = (comentarioId) => {
    setConfirmacaoExcluir({ aberto: true, comentarioId });
  };

  const cancelarExcluir = () => {
    setConfirmacaoExcluir({ aberto: false, comentarioId: null });
  };

  const confirmarExcluir = () => {
    // TODO: DELETE /comentarios/{id}
    setComentarios((prev) =>
      prev.filter((c) => c.id !== confirmacaoExcluir.comentarioId)
    );
    setConfirmacaoExcluir({ aberto: false, comentarioId: null });
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
    // TODO: POST /denuncias { comentarioId, motivo }
    fecharDenuncia();
  };

  return {
    comentarios,
    setComentarios,
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