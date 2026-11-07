// Conversas — mock fiel à ref (tela 5, Chat).
// TODO(backend): tabelas `chats` / `chat_members` / `messages` com RLS por participante.

export type Conversation = {
  id: string;
  name: string;
  snippet: string;
  time: string;
  unread: number;
  online: boolean;
  emoji: string;
  gradient: [string, string];
};

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    name: 'Marina',
    snippet: 'Bora tomar um café esse finde? Tem uma cafeteria nova aqui no Centro 💜',
    time: '11:46',
    unread: 2,
    online: true,
    emoji: '☕',
    gradient: ['#6F42D9', '#3B1F73'],
  },
  {
    id: 'c2',
    name: 'Rafa',
    snippet: 'Topoo! Vai ser demais 🤩',
    time: '10:27',
    unread: 0,
    online: true,
    emoji: '⛰️',
    gradient: ['#956AFA', '#5B37B7'],
  },
  {
    id: 'c3',
    name: 'Grupo · Trilha da Pedra Grande',
    snippet: 'João: convidei mais 2 pessoas pra trilha 🥾',
    time: '09:12',
    unread: 5,
    online: false,
    emoji: '🥾',
    gradient: ['#2FB8A6', '#155E54'],
  },
  {
    id: 'c4',
    name: 'Bia',
    snippet: 'Show sábado? fecha 🎪',
    time: 'ontem',
    unread: 0,
    online: false,
    emoji: '🎪',
    gradient: ['#B23FE2', '#6A1FA8'],
  },
  {
    id: 'c5',
    name: 'João',
    snippet: 'Levei meu RPG na mochila hehe 🐉',
    time: 'ter',
    unread: 1,
    online: true,
    emoji: '🎲',
    gradient: ['#4B5DFF', '#2A33A8'],
  },
];
