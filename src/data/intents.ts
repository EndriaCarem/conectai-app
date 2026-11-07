// Intenções do dia — "Momentos e Intenções" da ref (docs/refs/ref-01-14-telas.jpg):
// "Indique o que quer fazer hoje: café, cinema, conversar, estudar, viajar, etc."
// É o ponto de partida do Descobrir: primeiro a atividade, depois as pessoas.
// TODO(backend): tabela `intentions` + opt-in diário do usuário (backlog §8).

export type Intent = {
  id: string;
  /** Rótulo nos chips (ex.: "Tomar um café"). */
  label: string;
  emoji: string;
};

export const intents: Intent[] = [
  { id: 'cafe', label: 'Tomar um café', emoji: '☕' },
  { id: 'cinema', label: 'Ir ao cinema', emoji: '🎬' },
  { id: 'trilha', label: 'Fazer uma trilha', emoji: '🥾' },
  { id: 'jogo', label: 'Jogar algo', emoji: '🎲' },
  { id: 'bar', label: 'Sair pra um bar', emoji: '🍻' },
  { id: 'show', label: 'Ver um show', emoji: '🎧' },
  { id: 'museu', label: 'Ir a um museu', emoji: '🏛️' },
  { id: 'workout', label: 'Treinar', emoji: '🏋️' },
  { id: 'conversa', label: 'Bater papo', emoji: '💬' },
  { id: 'pet', label: 'Passear com o pet', emoji: '🦮' },
];
