import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function useNovoRoteiro() {
  const navigate = useNavigate();
  const { usuario, token } = useAuth();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataViagem, setDataViagem] = useState('');
  const [publico, setPublico] = useState(false);

  const [tituloTouched, setTituloTouched] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const isTituloValid = titulo.trim().length >= 3;

  // POST /roteiros — body alinhado com RoteiroPostRequestDto
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTituloTouched(true);

    if (!isTituloValid) return;
    if (!usuario || !token) {
      alert('Você precisa estar logado para criar um roteiro.');
      return;
    }

    setSalvando(true);
    setErro('');
    try {
      const res = await fetch(`${BASE}/roteiros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          descricao,
          dataViagem: dataViagem || null,
          publico,
          idUsuario: usuario.id,
        }),
      });

      if (!res.ok) {
        const erroData = await res.json().catch(() => ({}));
        throw new Error(erroData.message || 'Erro ao criar roteiro.');
      }

      const criado = await res.json();
      navigate(`/roteiros/${criado.id}`);
    } catch (err) {
      setErro(err.message);
      alert(err.message);
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelar = () => {
    navigate('/roteiros');
  };

  return {
    titulo, setTitulo,
    descricao, setDescricao,
    dataViagem, setDataViagem,
    publico, setPublico,
    tituloTouched, setTituloTouched,
    isTituloValid,
    salvando,
    erro,
    handleSubmit,
    handleCancelar,
  };
}