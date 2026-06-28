import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useEditarComentario() {
  const navigate = useNavigate();
  const location = useLocation();

  // O DetalhePonto passa o comentário via state na navegação
  const comentarioOriginal = location.state?.comentario ?? null;
  const pontoId = location.state?.pontoId ?? null;

  const [texto, setTexto] = useState(comentarioOriginal?.texto ?? '');
  const [nota, setNota] = useState(comentarioOriginal?.nota ?? 5);
  const [salvando, setSalvando] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const mostrarToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSalvar = () => {
    if (!texto.trim()) return;
    setSalvando(true);

    // TODO: PUT /comentarios/{comentarioOriginal.id} { texto, nota }
    setTimeout(() => {
      setSalvando(false);
      mostrarToast('Comentário atualizado!');
      setTimeout(() => navigate(`/pontos/${pontoId}`), 1200);
    }, 600);
  };

  const handleCancelar = () => {
    navigate(`/pontos/${pontoId}`);
  };

  const textoAlterado = texto !== comentarioOriginal?.texto || nota !== comentarioOriginal?.nota;

  return {
    comentarioOriginal,
    pontoId,
    texto,
    setTexto,
    nota,
    setNota,
    salvando,
    toastMsg,
    textoAlterado,
    handleSalvar,
    handleCancelar,
  };
}