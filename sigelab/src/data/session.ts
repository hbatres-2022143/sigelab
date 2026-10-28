import type { AppUser } from './users';

let currentUser: AppUser | null = null;

export const setCurrentUser = (user: AppUser | null) => {
  currentUser = user;
};

export const getCurrentUser = () => currentUser;
