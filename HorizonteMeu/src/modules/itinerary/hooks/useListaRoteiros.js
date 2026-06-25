import { useState, useEffect } from 'react';

export function useListaRoteiros() {
  const [roteiros, setRoteiros] = useState([]);
  const [loading, setLoading] = useState(true);
  // CORRIGIDO: substitui window.confirm por estado de confirmação inline
  const [confirmandoId, setConfirmandoId] = useState(null);

  useEffect(() => {
    const carregarRoteiros = async () => {
      try {
        // TODO: GET /roteiros/usuario/{idUsuario}
        const dadosMock = [
          {
            id: 1,
            titulo: "Férias de verão na Europa",
            descricao: "Roteiro passando por Paris, Amsterdã e Berlim.",
            dataViagem: "2025-07-15",
            publico: true,
            quantidadePontos: 8
          },
          {
            id: 2,
            titulo: "Explorando o Nordeste",
            descricao: "Melhores praias e pontos históricos de Salvador e Recife.",
            dataViagem: "2025-12-20",
            publico: false,
            quantidadePontos: 5
          }
        ];

        setTimeout(() => {
          setRoteiros(dadosMock);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Erro ao carregar roteiros:", error);
        setLoading(false);
      }
    };

    carregarRoteiros();
  }, []);

  const formatarData = (dataString) => {
    if (!dataString) return "";
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Abre a confirmação inline para o roteiro clicado
  const pedirConfirmacao = (id, e) => {
    e.stopPropagation();
    setConfirmandoId(id);
  };

  // Confirma e deleta
  const confirmarDelecao = (id, e) => {
    e.stopPropagation();
    // TODO: DELETE /roteiros/{id}
    setRoteiros(prev => prev.filter(r => r.id !== id));
    setConfirmandoId(null);
  };

  // Cancela sem deletar
  const cancelarDelecao = (e) => {
    e.stopPropagation();
    setConfirmandoId(null);
  };

  return {
    roteiros,
    loading,
    formatarData,
    confirmandoId,
    pedirConfirmacao,
    confirmarDelecao,
    cancelarDelecao,
  };
}