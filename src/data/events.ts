// Eventos/rolês — mock fiel à ref (tela 6, "Explorar eventos").
// `mine` = evento criado ou confirmado por mim → é dele que nasce o grupo de chat.
// TODO(backend): tabela `plans`/`events`, lista de espera, confirmação 24h (backlog §9)
// e criação automática do grupo correspondente.

export type EventItem = {
  id: string;
  title: string;
  emoji: string;
  date: { day: string; month: string };
  place: string;
  distanceKm: number;
  joined: number;
  capacity: number;
  online?: boolean;
  /** Meu vínculo com o evento (fonte dos meus grupos de chat). */
  mine?: 'criou' | 'confirmou';
  gradient: [string, string];
};

export const mockEvents: EventItem[] = [
  {
    id: 'e1',
    title: 'Café & Conversa',
    emoji: '☕',
    date: { day: '24', month: 'ABR' },
    place: 'Centro, SP',
    distanceKm: 1.2,
    joined: 40,
    capacity: 45,
    mine: 'criou',
    gradient: ['#6F42D9', '#2F1A5E'],
  },
  {
    id: 'e2',
    title: 'Rolê Nerd · Jogos de Tabuleiro',
    emoji: '🎲',
    date: { day: '25', month: 'ABR' },
    place: 'Vila Madalena, SP',
    distanceKm: 2.5,
    joined: 32,
    capacity: 40,
    gradient: ['#B23FE2', '#5A1E93'],
  },
  {
    id: 'e3',
    title: 'Trilha + Natureza',
    emoji: '🥾',
    date: { day: '01', month: 'MAI' },
    place: 'Parque da Cantareira, SP',
    distanceKm: 5,
    joined: 18,
    capacity: 25,
    mine: 'confirmou',
    gradient: ['#2FB8A6', '#155E54'],
  },
  {
    id: 'e4',
    title: 'Games Online · Co-op Night',
    emoji: '🎮',
    date: { day: '03', month: 'MAI' },
    place: 'Online',
    distanceKm: 0,
    joined: 21,
    capacity: 30,
    online: true,
    gradient: ['#4B5DFF', '#232C9E'],
  },
];
