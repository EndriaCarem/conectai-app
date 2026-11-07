// Pessoas do deck de descoberta — mock fiel à ref (docs/refs/ref-01-14-telas.jpg, tela 3).
// TODO(backend): substituir por consulta a `profiles` + ranking determinístico (backlog §8),
// fotos vindo do storage e distância real via localização.

export type Person = {
  id: string;
  name: string;
  age: number;
  online: boolean;
  city: string;
  distanceM: number;
  bio: string;
  interests: string[];
  emoji: string;
  gradient: [string, string];
};

export const mockProfiles: Person[] = [
  {
    id: 'p1',
    name: 'Marina',
    age: 26,
    online: true,
    city: 'Centro, SP',
    distanceM: 300,
    bio: 'Amo descobrir novos lugares, bons cafés e conversas que vão além do óbvio. ✨',
    interests: ['Café', 'Trilhas', 'Livros', 'Viagens', 'Fotografia', 'Música'],
    emoji: '☕',
    gradient: ['#6F42D9', '#3B1F73'],
  },
  {
    id: 'p2',
    name: 'Rafa',
    age: 32,
    online: true,
    city: 'Vila Madalena, SP',
    distanceM: 800,
    bio: 'Sou pai de uma gata, fã de trilhas, futebol e música. Procuro pessoas com boas conversas para explorar a cidade.',
    interests: ['Trilhas', 'Cafés', 'Cinema', 'Futebol', 'Música'],
    emoji: '⛰️',
    gradient: ['#956AFA', '#5B37B7'],
  },
  {
    id: 'p3',
    name: 'Bia',
    age: 24,
    online: false,
    city: 'Pinheiros, SP',
    distanceM: 1200,
    bio: 'Vida noturna, festivais e trilha no fim de semana — depende da vibe do grupo.',
    interests: ['Festival', 'Fotografia', 'Café', 'Balada'],
    emoji: '🎪',
    gradient: ['#B23FE2', '#6A1FA8'],
  },
  {
    id: 'p4',
    name: 'João',
    age: 28,
    online: true,
    city: 'Bela Vista, SP',
    distanceM: 2100,
    bio: 'Nerd raiz: RPG de mesa na sexta, café na manhã seguinte. Tô começando a colecionar board games.',
    interests: ['RPG de mesa', 'Games', 'Cafeterias', 'Pizza'],
    emoji: '🎲',
    gradient: ['#4B5DFF', '#2A33A8'],
  },
  {
    id: 'p5',
    name: 'Sofia',
    age: 27,
    online: false,
    city: 'Perdizes, SP',
    distanceM: 3400,
    bio: 'Editora de livros e grande fã de clube de leitura. Trilhas aos domingos são meu ritual.',
    interests: ['Livros', 'Trilhas', 'Arte', 'Cafeterias'],
    emoji: '📚',
    gradient: ['#D946A6', '#7A2168'],
  },
  {
    id: 'p6',
    name: 'Léo',
    age: 30,
    online: true,
    city: 'Moema, SP',
    distanceM: 4800,
    bio: 'Músico nas horas vagas, sempre pronto pra um show ou pra um jogo de vôlei na praia.',
    interests: ['Show ao vivo', 'Vôlei', 'Surf', 'Karaokê'],
    emoji: '🎸',
    gradient: ['#2FB8A6', '#18685F'],
  },
];
