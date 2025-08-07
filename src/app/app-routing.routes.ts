import { Routes } from '@angular/router';

/**
 * Application routes with lazy-loaded standalone components
 */
export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent),
  },
  {
    path: 'catalog',
    loadComponent: () => import('./pages/catalog-page/catalog-page.component').then(m => m.CatalogPageComponent),
  },
  {
    path: 'catalog/:id',
    loadComponent: () => import('./pages/place-details-page/place-details-page').then(m => m.PlaceDetailsPageComponent),
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth-page/auth-page.component').then(m => m.AuthPageComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent),
  },
  {
    path: 'users/:id',
    loadComponent: () => import('./pages/public-user-profile/public-user-profile.component').then(m => m.PublicUserProfileComponent),
  },
];
