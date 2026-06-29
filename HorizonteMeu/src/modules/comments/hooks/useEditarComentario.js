import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function useEditarComentario() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

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

  const handleSalvar = async () => {
    if (!texto.trim()) return;
    setSalvando(true);

    try {
      // PUT /comentarios/{id} - Nota é imutável conforme RN119 do controller
      const payload = {
        texto: texto.trim(),
        fotoUrl: comentarioOriginal.fotoUrl // Mantém a foto atual
      };

      const res = await fetch(`${BASE}/comentarios/${comentarioOriginal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Erro ao atualizar comentário.');

      mostrarToast('Comentário atualizado!');
      setTimeout(() => navigate(`/pontos/${pontoId}`), 1200);
    } catch (err) {
      alert(err.message);
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelar = () => {
    navigate(`/pontos/${pontoId}`);
  };

  //A nota é imutável
  const textoAlterado = texto !== comentarioOriginal?.texto;

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