import { useState, useMemo } from 'react';
import { PONTOS_MOCK } from '../../../shared/mocks/mockData';

// Achata todos os pontos de todos os países em um único array
const TODOS_PONTOS = Object.values(PONTOS_MOCK).flat();

export function useListaPontos() {
  const [loading] = useState(false); // TODO: true enquanto faz GET /pontos
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('TODOS');

  const pontos = useMemo(() => {
    // TODO: substituir TODOS_PONTOS pela resposta de GET /pontos
    let resultado = TODOS_PONTOS;

    if (categoriaAtiva !== 'TODOS') {
      resultado = resultado.filter((p) => p.categoriaEnum === categoriaAtiva);
    }

    if (busca.trim()) {
      const termo = busca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      resultado = resultado.filter((p) => {
        const campos = [p.nome, p.cidade, p.pais].join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return campos.includes(termo);
      });
    }

    return resultado;
  }, [busca, categoriaAtiva]);

  return {
    pontos,
    loading,
    busca,
    setBusca,
    categoriaAtiva,
    setCategoriaAtiva,
  };
}