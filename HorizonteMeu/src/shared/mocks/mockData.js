// src/shared/mocks/mockData.js
//
// Fonte única de verdade para todos os dados mock do frontend.
// TODO: remover este arquivo quando a integração com a API estiver completa.

// ─── CATEGORIA_LABEL ────────────────────────────────────────────────────────
// Usado em: DetalhePonto, Favoritos
export const CATEGORIA_LABEL = {
  PRAIA:     '🏖️ Praia',
  MUSEU:     '🏛️ Museu',
  MONTANHA:  '⛰️ Montanha',
  MONUMENTO: '🗿 Monumento',
  PARQUE:    '🌳 Parque',
};

// ─── CATEGORIA_PARA_FILTRO ───────────────────────────────────────────────────
// Mapeia categoria do ponto → chave do filtro no Dashboard
export const CATEGORIA_PARA_FILTRO = {
  Monumento: 'monumentos',
  Museu:     'museus',
  Praia:     'praias',
  Montanha:  'montanhas',
  Parque:    'parques',
};

// ─── PONTOS TURÍSTICOS ───────────────────────────────────────────────────────
// TODO: GET /pontos-turisticos?pais={pais}
// Estrutura alinhada com PontoTuristicoGetResponseDto do backend
export const PONTOS_MOCK = {
  france: [
    {
      id: 1,
      nome: 'Torre Eiffel',
      categoria: 'Monumento',
      categoriaEnum: 'MONUMENTO',
      descricao: 'Um dos monumentos mais famosos do mundo, a Torre Eiffel foi construída em 1889 como o arco de entrada para a Exposição Universal de Paris. Com seus 330 metros de altura, oferece uma vista deslumbrante de toda a cidade.',
      cidade: 'Paris',
      pais: 'França',
      notaMedia: 4.8,
      latitude: 48.8584,
      longitude: 2.2945,
      img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500',
    },
    {
      id: 2,
      nome: 'Museu do Louvre',
      categoria: 'Museu',
      categoriaEnum: 'MUSEU',
      descricao: 'O maior museu de arte do mundo, abrigando mais de 380.000 obras, incluindo a Mona Lisa e a Vênus de Milo.',
      cidade: 'Paris',
      pais: 'França',
      notaMedia: 4.8,
      latitude: 48.8606,
      longitude: 2.3376,
      img: 'https://images.unsplash.com/photo-1597923891164-46c29d6c28c3?w=500',
    },
    {
      id: 3,
      nome: 'Praia de Nice',
      categoria: 'Praia',
      categoriaEnum: 'PRAIA',
      descricao: 'Famosa praia da Riviera Francesa, com águas cristalinas e a elegante Promenade des Anglais.',
      cidade: 'Nice',
      pais: 'França',
      notaMedia: 4.5,
      latitude: 43.7102,
      longitude: 7.2661,
      img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500',
    },
    {
      id: 4,
      nome: 'Mont Blanc',
      categoria: 'Montanha',
      categoriaEnum: 'MONTANHA',
      descricao: 'O pico mais alto dos Alpes e de toda a Europa Ocidental, com 4.808 metros de altitude.',
      cidade: 'Chamonix',
      pais: 'França',
      notaMedia: 4.9,
      latitude: 45.8326,
      longitude: 6.8652,
      img: 'https://images.unsplash.com/photo-1531400158697-004a55d99396?w=500',
    },
    {
      id: 5,
      nome: 'Jardim de Versalhes',
      categoria: 'Parque',
      categoriaEnum: 'PARQUE',
      descricao: 'Os famosos jardins geométricos do Palácio de Versalhes, com fontes, esculturas e canais históricos.',
      cidade: 'Versalhes',
      pais: 'França',
      notaMedia: 4.7,
      latitude: 48.8049,
      longitude: 2.1204,
      img: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=500',
    },
  ],
};

// ─── FOTOS DE UM PONTO ───────────────────────────────────────────────────────
// TODO: GET /fotos/ponto/{idPonto}
export const FOTOS_MOCK = {
  1: [
    { id: 1, url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
    { id: 2, url: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800' },
    { id: 3, url: 'https://images.unsplash.com/photo-1507833423370-a126b89d394b?w=800' },
  ],
};

// ─── COMENTÁRIOS DE UM PONTO ─────────────────────────────────────────────────
// TODO: GET /comentarios/ponto/{idPonto}
export const COMENTARIOS_MOCK = {
  1: [
    { id: 1, usuario: { nome: 'Ana Lima' },      texto: 'Lugar incrível! A vista do topo é de tirar o fôlego.',                             nota: 5, curtidas: 12, fotoUrl: null },
    { id: 2, usuario: { nome: 'Carlos Souza' },  texto: 'Vale muito a pena visitar. Cheguei cedo para evitar filas e foi perfeito.',         nota: 4, curtidas: 7,  fotoUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400' },
    { id: 3, usuario: { nome: 'Mariana Costa' }, texto: 'Experiência única! O pôr do sol visto de lá é inesquecível.',                      nota: 5, curtidas: 20, fotoUrl: null },
  ],
};

// ─── FAVORITOS DO USUÁRIO ────────────────────────────────────────────────────
// TODO: GET /favoritos/usuario/{idUsuario}
export const FAVORITOS_MOCK = [
  {
    id: 1,
    pontoTuristico: {
      id: 1,
      nome: 'Torre Eiffel',
      cidade: 'Paris',
      pais: 'França',
      categoria: 'MONUMENTO',
      notaMedia: 4.8,
      descricao: 'Um dos monumentos mais famosos do mundo, com vista deslumbrante de toda Paris.',
      url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
    },
    dataSalvo: '2025-03-10',
  },
  {
    id: 2,
    pontoTuristico: {
      id: 2,
      nome: 'Machu Picchu',
      cidade: 'Cusco',
      pais: 'Peru',
      categoria: 'MONUMENTO',
      notaMedia: 4.9,
      descricao: 'Cidadela inca situada no alto dos Andes peruanos, Patrimônio Mundial da UNESCO.',
      url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600',
    },
    dataSalvo: '2025-04-02',
  },
  {
    id: 3,
    pontoTuristico: {
      id: 3,
      nome: 'Parque Nacional de Yellowstone',
      cidade: 'Wyoming',
      pais: 'EUA',
      categoria: 'PARQUE',
      notaMedia: 4.7,
      descricao: 'Primeiro parque nacional do mundo, famoso pelos gêiseres e vida selvagem abundante.',
      url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600',
    },
    dataSalvo: '2025-05-18',
  },
];