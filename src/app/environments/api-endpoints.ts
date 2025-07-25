export const API_BASE_URL = 'https://coffeespot.54-221-160-23.nip.io/api';

export const API_ENDPOINTS = {
  places: {
    list: `${API_BASE_URL}/cafes`,
  },
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
  },
  user: {
    me: `${API_BASE_URL}/users/me`,
    settings: `${API_BASE_URL}/users/settings`,
    favorites: `${API_BASE_URL}/users/me/favorites`,
  },
  reviews: {
    base: `${API_BASE_URL}/reviews`,
  },
};
