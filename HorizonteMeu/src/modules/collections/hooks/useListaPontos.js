import { useState, useEffect, useMemo } from 'react';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function useListaPontos() {
  const [pontosBrutos, setPontosBrutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('TODOS');
  const [erro, setErro] = useState('');

  // Carrega pontos da API na montagem
  useEffect(() => {
    const carregarPontos = async () => {
      try {
        setLoading(true);
        setErro('');
        
        // GET /pontos retorna Page<PontoTuristicoGetResponseDto>
        // Estrutura: { content: [...], totalElements, totalPages, ... }
        const res = await fetch(`${BASE}/pontos?page=0&size=100`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          throw new Error('Erro ao carregar pontos turísticos.');
        }

        const data = await res.json();
        // A resposta é paginada, pegamos o array de conteúdo
        const pontos = Array.isArray(data.content) ? data.content : [];
        setPontosBrutos(pontos);
      } catch (err) {
        setErro(err.message || 'Erro ao carregar pontos.');
        setPontosBrutos([]);
      } finally {
        setLoading(false);
      }
    };

    carregarPontos();
  }, []);

  // Filtra pontos em memória por categoria e busca
  const pontos = useMemo(() => {
    let resultado = pontosBrutos;

    if (categoriaAtiva !== 'TODOS') {
      resultado = resultado.filter((p) => p.categoria === categoriaAtiva);
    }

    if (busca.trim()) {
      const termo = busca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      resultado = resultado.filter((p) => {
        const campos = [p.nome, p.cidade, p.pais].join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return campos.includes(termo);
      });
    }

    return resultado;
  }, [busca, categoriaAtiva, pontosBrutos]);

  return {
    pontos,
    loading,
    erro,
    busca,
    setBusca,
    categoriaAtiva,
    setCategoriaAtiva,
  };
}
