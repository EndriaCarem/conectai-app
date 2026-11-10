// Grupos de chat — SEM conversas individuais: todo grupo nasce de um evento
// criado ou confirmado pelo usuário (regra do produto + ref 5/6).
// TODO(backend): tabelas `chats` / `chat_members` / `messages` com RLS por
// participante, e criação automática do grupo quando o evento é confirmado.

export type ChatMessage = {
  id: string;
  author: string;
  text: string;
  time: string;
  mine?: boolean;
};

export type EventGroup = {
  id: string;
  /** Evento que originou o grupo. */
  eventId: string;
  name: string;
  emoji: string;
  gradient: [string, string];
  members: number;
  online: number;
  lastAuthor: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: ChatMessage[];
};

export const mockGroups: EventGroup[] = [
  {
    id: 'g1',
    eventId: 'e1',
    name: 'Café & Conversa',
    emoji: '☕',
    gradient: ['#6F42D9', '#2F1A5E'],
    members: 40,
    online: 6,
    lastAuthor: 'Marina',
    lastMessage: 'Boaa! Levo a Sofia também 💜',
    time: '11:46',
    unread: 2,
    messages: [
      { id: 'm1', author: 'Ana', text: 'Pessoal, reservei mesa pra 6 às 15h no sábado ☕', time: '09:40' },
      { id: 'm2', author: 'Você', text: 'Perfeito! Quem topa chegar 14h30 pra garantir o lugar?', time: '09:52', mine: true },
      { id: 'm3', author: 'Rafa', text: 'Eu chego 14h30, caminho junto do metrô', time: '10:15' },
      { id: 'm4', author: 'Marina', text: 'Boaa! Levo a Sofia também 💜', time: '11:46' },
    ],
  },
  {
    id: 'g2',
    eventId: 'e2',
    name: 'Rolê Nerd · Jogos de Tabuleiro',
    emoji: '🎲',
    gradient: ['#B23FE2', '#5A1E93'],
    members: 32,
    online: 5,
    lastAuthor: 'João',
    lastMessage: 'Levei meu RPG na mochila hehe 🐉',
    time: '10:27',
    unread: 0,
    messages: [
      { id: 'm1', author: 'João', text: 'Levei meu RPG na mochila hehe 🐉', time: '10:27' },
      { id: 'm2', author: 'Você', text: 'A gente precisa de mais 2 pra mesa de Catan', time: '10:31', mine: true },
      { id: 'm3', author: 'Bia', text: 'Eu topo, mas chego 20h 🎪', time: '10:35' },
    ],
  },
  {
    id: 'g3',
    eventId: 'e3',
    name: 'Trilha + Natureza',
    emoji: '🥾',
    gradient: ['#2FB8A6', '#155E54'],
    members: 18,
    online: 3,
    lastAuthor: 'Sofia',
    lastMessage: 'Bora sair 7h da rodoviária, sol tá garantido ☀️',
    time: '09:12',
    unread: 5,
    messages: [
      { id: 'm1', author: 'Sofia', text: 'Bora sair 7h da rodoviária, sol tá garantido ☀️', time: '09:12' },
      { id: 'm2', author: 'Você', text: 'Fechou, levo água e lanche pra todo mundo', time: '09:20', mine: true },
      { id: 'm3', author: 'Léo', text: 'Contem comigo 🥾', time: '09:24' },
    ],
  },
  {
    id: 'g4',
    eventId: 'e4',
    name: 'Games Online · Co-op Night',
    emoji: '🎮',
    gradient: ['#4B5DFF', '#232C9E'],
    members: 21,
    online: 8,
    lastAuthor: 'João',
    lastMessage: 'Lobby aberto, entra no discord que te mando o link',
    time: 'ter',
    unread: 0,
    messages: [
      { id: 'm1', author: 'João', text: 'Lobby aberto, entra no discord que te mando o link', time: '20:04' },
      { id: 'm2', author: 'Você', text: 'Entrando! 🎮', time: '20:06', mine: true },
    ],
  },
];
