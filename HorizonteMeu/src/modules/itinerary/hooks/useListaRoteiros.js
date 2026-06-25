import { useState, useEffect } from 'react';

export function useListaRoteiros() {
  const [roteiros, setRoteiros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarRoteiros = async () => {
      try {
        // Mock de dados (representando o retorno do seu Backend)
        const dadosMock = [
          {
            id: 1,
            titulo: "FÉRIAS DE VERÃO NA EUROPA",
            descricao: "Roteiro passando por Paris, Amsterdã e Berlim.",
            dataViagem: "2025-07-15",
            publico: true,
            quantidadePontos: 8
          },
          {
            id: 2,
            titulo: "EXPLORANDO O NORDESTE",
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

  const deletarRoteiro = (id, e) => {
    e.stopPropagation(); 
    if (window.confirm("Tem certeza que deseja excluir este roteiro?")) {
      setRoteiros(prev => prev.filter(r => r.id !== id));
    }
  };

  return {
    roteiros,
    loading,
    formatarData,
    deletarRoteiro
  };
}
