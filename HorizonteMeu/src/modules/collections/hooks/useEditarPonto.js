import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function validar(form) {
  const erros = {};
  if (!form.nome.trim() || form.nome.trim().length < 3)
    erros.nome = 'O nome precisa ter pelo menos 3 caracteres.';
  if (!form.categoria)
    erros.categoria = 'Selecione uma categoria.';
  if (!form.descricao.trim() || form.descricao.trim().length < 10)
    erros.descricao = 'A descrição precisa ter pelo menos 10 caracteres.';
  if (!form.cidade.trim())
    erros.cidade = 'Informe a cidade.';
  if (!form.pais.trim())
    erros.pais = 'Informe o país.';
  if (form.latitude === '' || isNaN(Number(form.latitude)) || Number(form.latitude) < -90 || Number(form.latitude) > 90)
    erros.latitude = 'Latitude inválida (entre -90 e 90).';
  if (form.longitude === '' || isNaN(Number(form.longitude)) || Number(form.longitude) < -180 || Number(form.longitude) > 180)
    erros.longitude = 'Longitude inválida (entre -180 e 180).';
  return erros;
}

export function useEditarPonto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState({
    nome: '', categoria: '', descricao: '', cidade: '', pais: '', latitude: '', longitude: '',
  });
  const [touched, setTouched] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [confirmandoDeletar, setConfirmandoDeletar] = useState(false);
  const [erroApi, setErroApi] = useState('');

  // Carrega o ponto da API na montagem
  useEffect(() => {
    const carregarPonto = async () => {
      try {
        setCarregando(true);
        setErroApi('');

        const res = await fetch(`${BASE}/pontos/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          throw new Error('Ponto turístico não encontrado.');
        }

        const ponto = await res.json();
        setForm({
          nome: ponto.nome ?? '',
          categoria: ponto.categoria ?? '',
          descricao: ponto.descricao ?? '',
          cidade: ponto.cidade ?? '',
          pais: ponto.pais ?? '',
          latitude: ponto.latitude?.toString() ?? '',
          longitude: ponto.longitude?.toString() ?? '',
        });
      } catch (err) {
        setErroApi(err.message || 'Erro ao carregar ponto turístico.');
      } finally {
        setCarregando(false);
      }
    };

    carregarPonto();
  }, [id]);

  const erros = validar(form);

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setTouched((prev) => ({ ...prev, [campo]: true }));
    setErroApi('');
  };

  const handleBlur = (campo) => {
    setTouched((prev) => ({ ...prev, [campo]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const todosTocados = Object.keys(form).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(todosTocados);

    if (Object.keys(erros).length > 0) return;

    setSalvando(true);
    setErroApi('');

    try {
      const payload = {
        nome: form.nome.trim(),
        categoria: form.categoria,
        descricao: form.descricao.trim(),
        cidade: form.cidade.trim(),
        pais: form.pais.trim(),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      };

      const res = await fetch(`${BASE}/pontos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let mensagem = 'Erro ao atualizar ponto turístico.';
        try {
          const erro = await res.json();
          mensagem = erro.message || erro.erro || mensagem;
        } catch {
          // resposta não era JSON
        }
        throw new Error(mensagem);
      }

      // Ponto atualizado com sucesso — redireciona para detalhe
      navigate(`/pontos/${id}`);
    } catch (err) {
      setErroApi(err.message || 'Erro ao atualizar ponto turístico. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelar = () => navigate(`/pontos/${id}`);

  const pedirConfirmacaoDeletar = () => setConfirmandoDeletar(true);
  const cancelarDeletar = () => setConfirmandoDeletar(false);

  const confirmarDeletar = async () => {
    setSalvando(true);
    setErroApi('');

    try {
      const res = await fetch(`${BASE}/pontos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let mensagem = 'Erro ao excluir ponto turístico.';
        try {
          const erro = await res.json();
          mensagem = erro.message || erro.erro || mensagem;
        } catch {
          // resposta não era JSON
        }
        throw new Error(mensagem);
      }

      // Ponto excluído com sucesso — redireciona para listagem
      navigate('/pontos');
    } catch (err) {
      setErroApi(err.message || 'Erro ao excluir ponto turístico. Tente novamente.');
      setSalvando(false);
    }
  };

  return {
    form, touched, erros,
    salvando, carregando,
    confirmandoDeletar,
    erroApi,
    handleChange, handleBlur, handleSubmit, handleCancelar,
    pedirConfirmacaoDeletar, confirmarDeletar, cancelarDeletar,
  };
}