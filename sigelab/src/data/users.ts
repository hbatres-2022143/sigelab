export type UserRole = 'ADMIN' | 'ENCARGADO' | 'DOCENTE';

export type AppUser = {
  id: string;
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: UserRole;
  active: boolean;
};

export const USERS: AppUser[] = [
  {
    id: '1',
    username: 'admin',
    password: '1',
    fullName: 'Ana',
    email: 'admin@sigelab.edu.gt',
    role: 'ADMIN',
    active: true,
  },
  {
    id: '2',
    username: 'encargado',
    password: 'Encargado2026',
    fullName: 'Erick',
    email: 'encargado@sigelab.edu.gt',
    role: 'ENCARGADO',
    active: true,
  },
  {
    id: '3',
    username: 'docente',
    password: 'Docente2026',
    fullName: 'Diana',
    email: 'docente@sigelab.edu.gt',
    role: 'DOCENTE',
    active: true,
  },
  {
    id: '4',
    username: 'inactivo',
    password: 'Inactivo2026',
    fullName: 'Iván',
    email: 'inactivo@sigelab.com',
    role: 'ENCARGADO',
    active: false,
  },
  {
    id: '1002',
    username: 'Samu.Perez',
    password: 'Docente2026',
    fullName: 'Samuel Perez',
    email: 'samuel@gmail.com',
    role: 'DOCENTE',
    active: true,
  },
  {
    id: '1003',
    username: 'akeneths',
    password: 'Docente2026',
    fullName: 'Keneth Alvarado',
    email: 'akeneth@gmail.com',
    role: 'DOCENTE',
    active: true,
  },
  {
    id: '1004',
    username: 'jvaldezj1',
    password: 'Docente2026',
    fullName: 'Daniel Valdez',
    email: 'jvaldezj1@miumg.edu.gt',
    role: 'DOCENTE',
    active: true,
  },
  {
    id: '1005',
    username: 'Alex',
    password: 'Docente2026',
    fullName: 'Alex Morales',
    email: 'alex@gmail.com',
    role: 'DOCENTE',
    active: true,
  },
  {
    id: '1006',
    username: 'Twentl12',
    password: 'Docente2026',
    fullName: 'Diego Alexander Perez Reyes',
    email: 'addtwentl@gmail.com',
    role: 'DOCENTE',
    active: true,
  },
  {
    id: '1007',
    username: 'garcia001',
    password: 'Docente2026',
    fullName: 'Jonathan Garcia',
    email: 'jonathanalejandrogarciia@gmail.com',
    role: 'DOCENTE',
    active: true,
  },
];
