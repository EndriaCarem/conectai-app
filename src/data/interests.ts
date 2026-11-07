// Fonte de verdade: Conectaí — Backlog Mestre Completo (seção 7.1)
// + referência visual em docs/refs/ref-02-landing-abertura.jpg (chips com ícone,
// busca "Buscar interesses...", selecionado em violeta sólido).
// TODO(backend): mover para as tabelas `interest_categories` / `interest_items` no PostgreSQL
// via Supabase, mantendo estas constantes como fallback determinístico offline.

export type InterestItem = {
  label: string;
  emoji: string;
};

export type InterestCategory = {
  id: string;
  label: string;
  emoji: string;
  items: InterestItem[];
  /** Permite que o usuário adicione itens próprios (texto livre). */
  customizable?: boolean;
  /**
   * Categoria sensível: sempre opcional, nunca aplicada como filtro automático —
   * só influencia quando o usuário escolher mais tarde.
   * Regra do backlog (seção 7.2): "Nenhuma categoria deve virar filtro rígido automaticamente."
   */
  sensitive?: boolean;
};

export const interestCategories: InterestCategory[] = [
  {
    id: 'comida',
    label: 'Comida & Gastronomia',
    emoji: '🍜',
    items: [
      { label: 'Comida italiana', emoji: '🍕' },
      { label: 'Comida japonesa', emoji: '🍣' },
      { label: 'Churrasco', emoji: '🍖' },
      { label: 'Veggie/vegan', emoji: '🥗' },
      { label: 'Bares e botecos', emoji: '🍻' },
      { label: 'Cafeterias', emoji: '☕' },
      { label: 'Street food', emoji: '🌮' },
      { label: 'Cozinhar em casa', emoji: '👩‍🍳' },
    ],
  },
  {
    id: 'musica',
    label: 'Música',
    emoji: '🎧',
    items: [
      { label: 'Pop', emoji: '🎙️' },
      { label: 'Rock', emoji: '🎸' },
      { label: 'Sertanejo', emoji: '🤠' },
      { label: 'Funk', emoji: '🔊' },
      { label: 'Rap e hip hop', emoji: '🎤' },
      { label: 'MPB', emoji: '🎶' },
      { label: 'Eletrônica', emoji: '🎛️' },
      { label: 'Forró', emoji: '💃' },
      { label: 'Pagode', emoji: '🪘' },
      { label: 'Indie', emoji: '🌙' },
      { label: 'Show ao vivo', emoji: '🎫' },
      { label: 'Karaokê', emoji: '🪩' },
    ],
  },
  {
    id: 'instrumentos',
    label: 'Instrumentos musicais',
    emoji: '🎸',
    items: [
      { label: 'Violão', emoji: '🎼' },
      { label: 'Guitarra', emoji: '🎸' },
      { label: 'Piano', emoji: '🎹' },
      { label: 'Bateria', emoji: '🥁' },
      { label: 'Canto', emoji: '🎵' },
      { label: 'Produção musical', emoji: '🎚️' },
    ],
  },
  {
    id: 'esportes',
    label: 'Esportes',
    emoji: '⚽',
    items: [
      { label: 'Futebol', emoji: '⚽' },
      { label: 'Vôlei', emoji: '🏐' },
      { label: 'Basquete', emoji: '🏀' },
      { label: 'Academia', emoji: '🏋️' },
      { label: 'Corrida', emoji: '🏃' },
      { label: 'Ciclismo', emoji: '🚴' },
      { label: 'Natação', emoji: '🏊' },
      { label: 'Surf', emoji: '🏄' },
      { label: 'Escalada', emoji: '🧗' },
      { label: 'Artes marciais', emoji: '🥋' },
    ],
  },
  {
    id: 'hobbies',
    label: 'Hobbies',
    emoji: '🎲',
    customizable: true,
    items: [
      { label: 'Xadrez', emoji: '♟️' },
      { label: 'Cartas', emoji: '🃏' },
      { label: 'Colecionismo', emoji: '🗃️' },
      { label: 'Jardinagem', emoji: '🌱' },
      { label: 'Experimentar coisas novas', emoji: '🔥' },
    ],
  },
  {
    id: 'cinema',
    label: 'Cinema & séries',
    emoji: '🎬',
    items: [
      { label: 'Filmes', emoji: '🎬' },
      { label: 'Séries', emoji: '📺' },
      { label: 'Animes', emoji: '🎴' },
      { label: 'Documentários', emoji: '📽️' },
      { label: 'Terror e suspense', emoji: '👻' },
      { label: 'Comédia', emoji: '😂' },
      { label: 'Maratonas', emoji: '🛋️' },
    ],
  },
  {
    id: 'livros',
    label: 'Livros',
    emoji: '📚',
    items: [
      { label: 'Ficção', emoji: '📖' },
      { label: 'Fantasia', emoji: '🧙' },
      { label: 'Autoconhecimento', emoji: '🌿' },
      { label: 'Mangás', emoji: '🍥' },
      { label: 'Clube de leitura', emoji: '💬' },
    ],
  },
  {
    id: 'games',
    label: 'Games',
    emoji: '🎮',
    items: [
      { label: 'Consoles', emoji: '🕹️' },
      { label: 'PC', emoji: '🖥️' },
      { label: 'Mobile', emoji: '📱' },
      { label: 'RPG de mesa', emoji: '🐉' },
      { label: 'Party games', emoji: '🎉' },
      { label: 'Co-op', emoji: '🎮' },
    ],
  },
  {
    id: 'viagens',
    label: 'Viagens',
    emoji: '✈️',
    items: [
      { label: 'Road trip', emoji: '🚐' },
      { label: 'Mochilão', emoji: '🎒' },
      { label: 'Praia', emoji: '🏖️' },
      { label: 'Trilhas', emoji: '⛰️' },
      { label: 'Cidades históricas', emoji: '🏰' },
      { label: 'Viver no exterior', emoji: '🌍' },
    ],
  },
  {
    id: 'noturna',
    label: 'Vida noturna',
    emoji: '🌙',
    items: [
      { label: 'Bar', emoji: '🍻' },
      { label: 'Balada', emoji: '🍸' },
      { label: 'Festival', emoji: '🎪' },
      { label: 'Stand-up comedy', emoji: '🎤' },
    ],
  },
  {
    id: 'bem-estar',
    label: 'Bem-estar',
    emoji: '🧘',
    items: [
      { label: 'Yoga', emoji: '🧘' },
      { label: 'Meditação', emoji: '🪷' },
      { label: 'Rotina saudável', emoji: '🥦' },
      { label: 'Saúde mental', emoji: '💚' },
      { label: 'Amanhecer na praia', emoji: '🌅' },
    ],
  },
  {
    id: 'pets',
    label: 'Pets',
    emoji: '🐶',
    items: [
      { label: 'Cachorros', emoji: '🐕' },
      { label: 'Gatos', emoji: '🐈' },
      { label: 'Passeios com pets', emoji: '🦮' },
      { label: 'Causas de adoção', emoji: '🏡' },
    ],
  },
  {
    id: 'arte',
    label: 'Arte',
    emoji: '🎨',
    items: [
      { label: 'Museus', emoji: '🏛️' },
      { label: 'Galerias', emoji: '🖼️' },
      { label: 'Arte de rua', emoji: '🎨' },
      { label: 'Pintura', emoji: '🖌️' },
      { label: 'Poesia', emoji: '✒️' },
      { label: 'Teatro', emoji: '🎭' },
    ],
  },
  {
    id: 'carros',
    label: 'Carros',
    emoji: '🚗',
    items: [
      { label: 'Carros', emoji: '🚗' },
      { label: 'Motos', emoji: '🏍️' },
      { label: 'Carros antigos', emoji: '🛻' },
      { label: 'Tuning', emoji: '🔧' },
      { label: 'Pista / track day', emoji: '🏁' },
    ],
  },
  {
    id: 'fotografia',
    label: 'Fotografia',
    emoji: '📸',
    items: [
      { label: 'Fotografia de rua', emoji: '📷' },
      { label: 'Retratos', emoji: '🤳' },
      { label: 'Paisagem', emoji: '🏞️' },
      { label: 'Edição de foto', emoji: '🖼️' },
    ],
  },
  {
    id: 'natureza',
    label: 'Natureza',
    emoji: '🏞️',
    items: [
      { label: 'Trilhas', emoji: '🥾' },
      { label: 'Acampamento', emoji: '⛺' },
      { label: 'Parques', emoji: '🌳' },
      { label: 'Observação de pássaros', emoji: '🐦' },
      { label: 'Piquenique', emoji: '🧺' },
    ],
  },
  {
    id: 'tecnologia-cultura',
    label: 'Tecnologia & Cultura',
    emoji: '💻',
    items: [
      { label: 'Tecnologia', emoji: '💻' },
      { label: 'Idiomas', emoji: '🌐' },
      { label: 'Cultura', emoji: '🏛️' },
      { label: 'Voluntariado', emoji: '🤲' },
    ],
  },
  {
    id: 'espiritualidade',
    label: 'Espiritualidade',
    emoji: '🕊️',
    sensitive: true,
    items: [
      { label: 'Crente', emoji: '⛪' },
      { label: 'Espírita', emoji: '📿' },
      { label: 'Umbanda', emoji: '🌿' },
      { label: 'Candomblé', emoji: '🪔' },
      { label: 'Budismo', emoji: '☸️' },
      { label: 'Agnóstica/Ateia', emoji: '🔭' },
      { label: 'Outra', emoji: '✨' },
    ],
  },
  {
    id: 'politica',
    label: 'Política',
    emoji: '🗳️',
    sensitive: true,
    items: [
      { label: 'Esquerda', emoji: '⬅️' },
      { label: 'Direita', emoji: '➡️' },
      { label: 'Centro', emoji: '⚖️' },
      { label: 'Indiferente', emoji: '🤷' },
    ],
  },
  {
    id: 'neurodiversidade',
    label: 'Mente & neurodiversidade',
    emoji: '🧠',
    sensitive: true,
    items: [
      { label: 'Autismo', emoji: '🧩' },
      { label: 'TDAH', emoji: '⚡' },
      { label: 'Ansiedade', emoji: '🌊' },
      { label: 'Neurotípico', emoji: '🧠' },
    ],
  },
];
