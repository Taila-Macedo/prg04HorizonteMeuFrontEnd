import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PONTOS_MOCK } from '../../../shared/mocks/mockData';

// Achata todos os pontos de todos os países num array único
const TODOS_OS_PONTOS = Object.values(PONTOS_MOCK).flat();

// Mock do roteiro — substitua por GET /roteiros/{id}
const ROTEIROS_MOCK = {
  1: {
    id: 1,
    titulo: 'Férias de verão na Europa',
    descricao: 'Roteiro passando por Paris, Amsterdã e Berlim. Uma experiência inesquecível pelos melhores pontos turísticos do continente.',
    dataViagem: '2025-07-15',
    publico: true,
    idUsuario: 1,
    pontos: [
      { id: 1, ordem: 1, visitado: false, idPontoTuristico: 1, nomePontoTuristico: 'Torre Eiffel' },
      { id: 2, ordem: 2, visitado: true,  idPontoTuristico: 2, nomePontoTuristico: 'Museu do Louvre' },
      { id: 3, ordem: 3, visitado: false, idPontoTuristico: 3, nomePontoTuristico: 'Praia de Nice' },
    ],
  },
  2: {
    id: 2,
    titulo: 'Explorando o Nordeste',
    descricao: 'Melhores praias e pontos históricos de Salvador e Recife.',
    dataViagem: '2025-12-20',
    publico: false,
    idUsuario: 1,
    pontos: [
      { id: 4, ordem: 1, visitado: false, idPontoTuristico: 4, nomePontoTuristico: 'Mont Blanc' },
    ],
  },
};

export function useEditarRoteiro() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ── Campos do formulário ─────────────────────────────────────────────────
  const [titulo, setTitulo]         = useState('');
  const [descricao, setDescricao]   = useState('');
  const [dataViagem, setDataViagem] = useState('');
  const [publico, setPublico]       = useState(false);

  // ── Lista de pontos do roteiro ───────────────────────────────────────────
  // Cada item: { idPontoTuristico, nomePontoTuristico, ordem }
  const [pontos, setPontos] = useState([]);

  // ── Seletor de novo ponto ────────────────────────────────────────────────
  // pontosDisponiveis: todos os pontos do mock que ainda não estão na lista
  const [buscaPonto, setBuscaPonto]           = useState('');
  const [seletorAberto, setSeletorAberto]     = useState(false);

  // ── Controle de UI ───────────────────────────────────────────────────────
  const [carregando, setCarregando]         = useState(true);
  const [naoEncontrado, setNaoEncontrado]   = useState(false);
  const [tituloTouched, setTituloTouched]   = useState(false);
  const [salvando, setSalvando]             = useState(false);

  const isTituloValid = titulo.trim().length >= 3;

  // ── Carrega dados existentes ─────────────────────────────────────────────
  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      try {
        // TODO: GET /roteiros/{id}
        await new Promise((res) => setTimeout(res, 600));
        const dado = ROTEIROS_MOCK[Number(id)] ?? null;

        if (!dado) {
          setNaoEncontrado(true);
        } else {
          setTitulo(dado.titulo);
          setDescricao(dado.descricao ?? '');
          setDataViagem(dado.dataViagem ?? '');
          setPublico(dado.publico ?? false);
          // Converte para o formato interno: { idPontoTuristico, nomePontoTuristico, ordem }
          setPontos(
            [...(dado.pontos ?? [])].sort((a, b) => a.ordem - b.ordem)
          );
        }
      } catch (err) {
        console.error('Erro ao carregar roteiro:', err);
        setNaoEncontrado(true);
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, [id]);

  // ── Pontos disponíveis para adicionar ────────────────────────────────────
  // Remove os que já estão na lista e aplica o filtro de busca
  const idsJaNaLista = new Set(pontos.map((p) => p.idPontoTuristico));

  const pontosDisponiveis = TODOS_OS_PONTOS.filter((p) => {
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
        // ordem = próximo número da sequência
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
      // Recalcula a ordem para não ficar com buracos (1, 2, 3...)
      return filtrado.map((p, i) => ({ ...p, ordem: i + 1 }));
    });
  };

  // ── Move ponto para cima na lista ────────────────────────────────────────
  const moverParaCima = (index) => {
    if (index === 0) return;
    setPontos((prev) => {
      const nova = [...prev];
      [nova[index - 1], nova[index]] = [nova[index], nova[index - 1]];
      // Recalcula ordem após troca
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
      // TODO: PUT /roteiros/{id}
      // Body alinhado com RoteiroPutRequestDto:
      // { titulo, descricao, dataViagem, publico, pontos: [{ idPontoTuristico, ordem }] }
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
      console.log('PUT /roteiros/' + id, body);
      await new Promise((res) => setTimeout(res, 700));
      navigate(`/roteiros/${id}`);
    } catch (err) {
      console.error('Erro ao salvar:', err);
    } finally {
      setSalvando(false);
    }
  };

  const handleCancelar = () => navigate(`/roteiros/${id}`);

  return {
    // Campos
    titulo, setTitulo,
    descricao, setDescricao,
    dataViagem, setDataViagem,
    publico, setPublico,
    // Pontos
    pontos,
    pontosDisponiveis,
    buscaPonto, setBuscaPonto,
    seletorAberto, setSeletorAberto,
    adicionarPonto,
    removerPonto,
    moverParaCima,
    moverParaBaixo,
    // Validação e UI
    tituloTouched, setTituloTouched,
    isTituloValid,
    carregando,
    naoEncontrado,
    salvando,
    // Ações
    handleSubmit,
    handleCancelar,
  };
}