import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function useEditarRoteiro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  // ── Campos do formulário ─────────────────────────────────────────────────
  const [titulo, setTitulo]         = useState('');
  const [descricao, setDescricao]   = useState('');
  const [dataViagem, setDataViagem] = useState('');
  const [publico, setPublico]       = useState(false);

  // ── Lista de pontos do roteiro ───────────────────────────────────────────
  // Cada item: { idPontoTuristico, nomePontoTuristico, ordem }
  const [pontos, setPontos] = useState([]);

  // ── Pontos turísticos disponíveis para adicionar (vêm da API) ───────────
  const [todosOsPontos, setTodosOsPontos] = useState([]);
  const [buscaPonto, setBuscaPonto]       = useState('');
  const [seletorAberto, setSeletorAberto] = useState(false);

  // ── Controle de UI ───────────────────────────────────────────────────────
  const [carregando, setCarregando]       = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [tituloTouched, setTituloTouched] = useState(false);
  const [salvando, setSalvando]           = useState(false);

  const isTituloValid = titulo.trim().length >= 3;

  // ── Carrega o roteiro (GET /roteiros/{id}) e a lista de pontos turísticos
  //    (GET /pontos) em paralelo ────────────────────────────────────────────
  const carregar = useCallback(async () => {
    setCarregando(true);
    setNaoEncontrado(false);
    try {
      const [resRoteiro, resPontos] = await Promise.all([
        fetch(`${BASE}/roteiros/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${BASE}/pontos?page=0&size=100`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (!resRoteiro.ok) {
        setNaoEncontrado(true);
        return;
      }

      const dado = await resRoteiro.json();
      setTitulo(dado.titulo);
      setDescricao(dado.descricao ?? '');
      setDataViagem(dado.dataViagem ?? '');
      setPublico(dado.publico ?? false);
      setPontos(
        [...(dado.pontos ?? [])].sort((a, b) => a.ordem - b.ordem)
      );

      if (resPontos.ok) {
        const dadosPontos = await resPontos.json();
        setTodosOsPontos(Array.isArray(dadosPontos.content) ? dadosPontos.content : []);
      }
    } catch (err) {
      console.error('Erro ao carregar roteiro:', err);
      setNaoEncontrado(true);
    } finally {
      setCarregando(false);
    }
  }, [id, token]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // ── Pontos disponíveis para adicionar ────────────────────────────────────
  // Remove os que já estão na lista e aplica o filtro de busca
  const idsJaNaLista = new Set(pontos.map((p) => p.idPontoTuristico));

  const pontosDisponiveis = todosOsPontos.filter((p) => {
    const naoEstaNaLista = !idsJaNaLista.has(p.id);
    const baterBusca = p.nome.toLowerCase().includes(buscaPonto.toLowerCase()) ||
                       p.cidade.toLowerCase().includes(buscaPonto.toLowerCase());
    return naoEstaNaLista && (buscaPonto === '' || baterBusca);
  });

  // ── Adiciona ponto à lista ───────────────────────────────────────────────
  const adicionarPonto = (ponto) => {
    setPontos((prev) => [
      ...prev,
      {
        idPontoTuristico: ponto.id,
        nomePontoTuristico: ponto.nome,
        ordem: prev.length + 1,
      },
    ]);
    setBuscaPonto('');
    setSeletorAberto(false);
  };

  // ── Remove ponto da lista e reordena ─────────────────────────────────────
  const removerPonto = (idPontoTuristico) => {
    setPontos((prev) => {
      const filtrado = prev.filter((p) => p.idPontoTuristico !== idPontoTuristico);
      return filtrado.map((p, i) => ({ ...p, ordem: i + 1 }));
    });
  };

  // ── Move ponto para cima na lista ────────────────────────────────────────
  const moverParaCima = (index) => {
    if (index === 0) return;
    setPontos((prev) => {
      const nova = [...prev];
      [nova[index - 1], nova[index]] = [nova[index], nova[index - 1]];
      return nova.map((p, i) => ({ ...p, ordem: i + 1 }));
    });
  };

  // ── Move ponto para baixo na lista ───────────────────────────────────────
  const moverParaBaixo = (index) => {
    setPontos((prev) => {
      if (index === prev.length - 1) return prev;
      const nova = [...prev];
      [nova[index], nova[index + 1]] = [nova[index + 1], nova[index]];
      return nova.map((p, i) => ({ ...p, ordem: i + 1 }));
    });
  };

  // ── Salva — PUT /roteiros/{id} ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTituloTouched(true);
    if (!isTituloValid) return;

    setSalvando(true);
    try {
      const body = {
        titulo,
        descricao,
        dataViagem: dataViagem || null,
        publico,
        pontos: pontos.map((p) => ({
          idPontoTuristico: p.idPontoTuristico,
          ordem: p.ordem,
        })),
      };

      const res = await fetch(`${BASE}/roteiros/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const erroData = await res.json().catch(() => ({}));
        throw new Error(erroData.message || 'Erro ao salvar roteiro.');
      }

      navigate(`/roteiros/${id}`);
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert(err.message);
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelar = () => navigate(`/roteiros/${id}`);

  return {
    titulo, setTitulo,
    descricao, setDescricao,
    dataViagem, setDataViagem,
    publico, setPublico,
    pontos,
    pontosDisponiveis,
    buscaPonto, setBuscaPonto,
    seletorAberto, setSeletorAberto,
    adicionarPonto,
    removerPonto,
    moverParaCima,
    moverParaBaixo,
    tituloTouched, setTituloTouched,
    isTituloValid,
    carregando,
    naoEncontrado,
    salvando,
    handleSubmit,
    handleCancelar,
  };
}