import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FORM_INICIAL = {
  nome: '',
  categoria: '',
  descricao: '',
  cidade: '',
  pais: '',
  latitude: '',
  longitude: '',
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
  const [form, setForm] = useState(FORM_INICIAL);
  const [touched, setTouched] = useState({});
  const [salvando, setSalvando] = useState(false);

  const erros = validar(form);

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setTouched((prev) => ({ ...prev, [campo]: true }));
  };

  const handleBlur = (campo) => {
    setTouched((prev) => ({ ...prev, [campo]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Marca todos os campos como tocados para exibir erros
    const todosTocados = Object.keys(FORM_INICIAL).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(todosTocados);

    if (Object.keys(erros).length > 0) return;

    setSalvando(true);

    // TODO: integrar com POST /pontos quando a API estiver pronta
    // Body: { nome, categoria, descricao, cidade, pais, latitude, longitude }
    // A notaMedia é iniciada em 0.0 pelo backend automaticamente (RN04)
    await new Promise((res) => setTimeout(res, 700));

    setSalvando(false);
    navigate('/pontos');
  };

  const handleCancelar = () => navigate('/pontos');

  return {
    form,
    touched,
    erros,
    salvando,
    handleChange,
    handleBlur,
    handleSubmit,
    handleCancelar,
  };
}