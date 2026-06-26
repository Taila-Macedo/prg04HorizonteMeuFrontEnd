import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Mock local — substitua por chamadas reais à API quando disponível
const ROTEIROS_MOCK = {
  1: {
    id: 1,
    titulo: 'Férias de verão na Europa',
    descricao: 'Roteiro passando por Paris, Amsterdã e Berlim. Uma experiência inesquecível pelos melhores pontos turísticos do continente.',
    dataViagem: '2025-07-15',
    dataCriacao: '2025-03-01',
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
    dataCriacao: '2025-05-10',
    publico: false,
    idUsuario: 1,
    pontos: [
      { id: 4, ordem: 1, visitado: false, idPontoTuristico: 10, nomePontoTuristico: 'Pelourinho' },
      { id: 5, ordem: 2, visitado: false, idPontoTuristico: 11, nomePontoTuristico: 'Praia do Porto de Galinhas' },
    ],
  },
};

export function useDetalheRoteiro() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roteiro, setRoteiro]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  // Estado de compartilhamento: feedback visual ao clicar no botão
  const [compartilhando, setCompartilhando] = useState(false);
  const [linkCopiado, setLinkCopiado]       = useState(false);

  // Carrega o roteiro pelo id da URL
  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      try {
        // TODO: GET /roteiros/{id}
        await new Promise((res) => setTimeout(res, 600)); // simula latência
        const dado = ROTEIROS_MOCK[Number(id)] ?? null;
        if (!dado) {
          setNaoEncontrado(true);
        } else {
          setRoteiro(dado);
        }
      } catch (err) {
        console.error('Erro ao carregar roteiro:', err);
        setNaoEncontrado(true);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [id]);

  // Formata "2025-07-15" → "15/07/2025"
  const formatarData = (dataString) => {
    if (!dataString) return '—';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Alterna o campo visitado de um ponto do roteiro
  // PATCH /roteiros/pontos/{idRoteiroPonto}?visitado=true|false
  const toggleVisitado = async (idRoteiroPonto, valorAtual) => {
    const novoValor = !valorAtual;

    // Atualiza otimistamente na tela
    setRoteiro((prev) => ({
      ...prev,
      pontos: prev.pontos.map((p) =>
        p.id === idRoteiroPonto ? { ...p, visitado: novoValor } : p
      ),
    }));

    try {
      // TODO: PATCH /roteiros/pontos/{idRoteiroPonto}?visitado={novoValor}
      console.log(`Marcando ponto ${idRoteiroPonto} como visitado=${novoValor}`);
    } catch (err) {
      // Reverte se a API falhar
      console.error('Erro ao atualizar visitado:', err);
      setRoteiro((prev) => ({
        ...prev,
        pontos: prev.pontos.map((p) =>
          p.id === idRoteiroPonto ? { ...p, visitado: valorAtual } : p
        ),
      }));
    }
  };

  // Torna o roteiro público e copia o link
  // PATCH /roteiros/{id}/compartilhar
  const handleCompartilhar = async () => {
    if (compartilhando) return;
    setCompartilhando(true);
    try {
      // TODO: PATCH /roteiros/{id}/compartilhar
      await new Promise((res) => setTimeout(res, 500));

      // Atualiza o estado local para refletir publico=true
      setRoteiro((prev) => ({ ...prev, publico: true }));

      // Copia o link para o clipboard
      const link = `${window.location.origin}/roteiros/${id}`;
      await navigator.clipboard.writeText(link);
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 3000);
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    } finally {
      setCompartilhando(false);
    }
  };

  // Calcula quantos pontos já foram visitados
  const totalPontos    = roteiro?.pontos?.length ?? 0;
  const pontosVisitados = roteiro?.pontos?.filter((p) => p.visitado).length ?? 0;
  const progresso      = totalPontos > 0 ? Math.round((pontosVisitados / totalPontos) * 100) : 0;

  return {
    roteiro,
    loading,
    naoEncontrado,
    compartilhando,
    linkCopiado,
    totalPontos,
    pontosVisitados,
    progresso,
    formatarData,
    toggleVisitado,
    handleCompartilhar,
    navigate,
  };
}