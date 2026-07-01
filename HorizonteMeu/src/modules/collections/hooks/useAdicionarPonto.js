import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const FORM_INICIAL = {
  nome: '',
  categoria: '',
  descricao: '',
  cidade: '',
  pais: '',
  latitude: '',
  longitude: '',
  noMapa3D: false, // NOVO
};

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

export function useAdicionarPonto() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState(FORM_INICIAL);
  const [touched, setTouched] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [erroApi, setErroApi] = useState('');

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
    const todosTocados = Object.keys(FORM_INICIAL).reduce((acc, k) => ({ ...acc, [k]: true }), {});
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
        noMapa3D: form.noMapa3D, // NOVO
      };

      const res = await fetch(`${BASE}/pontos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let mensagem = 'Erro ao criar ponto turístico.';
        try {
          const erro = await res.json();
          mensagem = erro.message || erro.erro || mensagem;
        } catch {
          // resposta não era JSON
        }
        throw new Error(mensagem);
      }

      navigate('/pontos');
    } catch (err) {
      setErroApi(err.message || 'Erro ao criar ponto turístico. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelar = () => navigate('/pontos');

  return {
    form,
    touched,
    erros,
    salvando,
    erroApi,
    handleChange,
    handleBlur,
    handleSubmit,
    handleCancelar,
  };
}