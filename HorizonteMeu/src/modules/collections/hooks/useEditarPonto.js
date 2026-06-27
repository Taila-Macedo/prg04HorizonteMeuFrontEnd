import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PONTOS_MOCK } from '../../../shared/mocks/mockData';

// Achata todos os pontos em um objeto indexado por id
const PONTOS_POR_ID = Object.values(PONTOS_MOCK)
  .flat()
  .reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

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

  const [form, setForm] = useState({
    nome: '', categoria: '', descricao: '', cidade: '', pais: '', latitude: '', longitude: '',
  });
  const [touched, setTouched] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [confirmandoDeletar, setConfirmandoDeletar] = useState(false);

  useEffect(() => {
    // TODO: substituir por GET /pontos/{id}
    setTimeout(() => {
      const ponto = PONTOS_POR_ID[Number(id)];
      if (ponto) {
        setForm({
          nome: ponto.nome ?? '',
          categoria: ponto.categoriaEnum ?? '',
          descricao: ponto.descricao ?? '',
          cidade: ponto.cidade ?? '',
          pais: ponto.pais ?? '',
          latitude: ponto.latitude?.toString() ?? '',
          longitude: ponto.longitude?.toString() ?? '',
        });
      }
      setCarregando(false);
    }, 400);
  }, [id]);

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
    const todosTocados = Object.keys(form).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(todosTocados);

    if (Object.keys(erros).length > 0) return;

    setSalvando(true);

    // TODO: integrar com PUT /pontos/{id}
    // Body: { nome, categoria, descricao, cidade, pais, latitude, longitude }
    // notaMedia NÃO deve ser enviada — o backend recalcula automaticamente (RN04)
    await new Promise((res) => setTimeout(res, 700));

    setSalvando(false);
    navigate(`/pontos/${id}`);
  };

  const handleCancelar = () => navigate(`/pontos/${id}`);

  const pedirConfirmacaoDeletar = () => setConfirmandoDeletar(true);
  const cancelarDeletar = () => setConfirmandoDeletar(false);

  const confirmarDeletar = async () => {
    setSalvando(true);
    // TODO: integrar com DELETE /pontos/{id}
    await new Promise((res) => setTimeout(res, 500));
    setSalvando(false);
    navigate('/pontos');
  };

  return {
    form, touched, erros,
    salvando, carregando,
    confirmandoDeletar,
    handleChange, handleBlur, handleSubmit, handleCancelar,
    pedirConfirmacaoDeletar, confirmarDeletar, cancelarDeletar,
  };
}