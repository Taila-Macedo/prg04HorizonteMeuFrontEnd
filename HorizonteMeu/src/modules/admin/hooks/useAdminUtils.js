/**
 * Utilidades para o painel de administração
 */

/**
 * Formata um número como moeda
 * @param {number} value - Valor a formatar
 * @returns {string} Valor formatado
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata uma data relativa
 * @param {Date} date - Data a formatar
 * @returns {string} Data formatada de forma relativa
 */
export const formatRelativeDate = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora mesmo';
  if (diffMins < 60) return `há ${diffMins}m`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays < 7) return `há ${diffDays}d`;

  return date.toLocaleDateString('pt-BR');
};

/**
 * Extrai as iniciais de um nome
 * @param {string} name - Nome completo
 * @returns {string} Iniciais em maiúsculas
 */
export const getInitials = (name) => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

/**
 * Valida um email
 * @param {string} email - Email a validar
 * @returns {boolean} True se válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Gera um ID único
 * @returns {string} ID único
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Trunca um texto a um número máximo de caracteres
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Agrupa um array por uma propriedade
 * @param {Array} array - Array a agrupar
 * @param {string} property - Propriedade para agrupar
 * @returns {Object} Objeto com grupos
 */
export const groupBy = (array, property) => {
  return array.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
};

/**
 * Ordena um array por uma propriedade
 * @param {Array} array - Array a ordenar
 * @param {string} property - Propriedade para ordenar
 * @param {string} direction - 'asc' ou 'desc'
 * @returns {Array} Array ordenado
 */
export const sortBy = (array, property, direction = 'asc') => {
  return [...array].sort((a, b) => {
    if (a[property] < b[property]) return direction === 'asc' ? -1 : 1;
    if (a[property] > b[property]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Filtra um array por múltiplas propriedades
 * @param {Array} array - Array a filtrar
 * @param {Object} filters - Objeto com filtros
 * @returns {Array} Array filtrado
 */
export const filterBy = (array, filters) => {
  return array.filter((item) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      if (typeof value === 'string') {
        return item[key]?.toString().toLowerCase().includes(value.toLowerCase());
      }
      return item[key] === value;
    });
  });
};
