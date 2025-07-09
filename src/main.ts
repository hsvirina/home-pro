import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { HomePageComponent } from './app/pages/home-page/home-page.component';
import { provideHttpClient } from '@angular/common/http';
import { PlaceDetailsPageComponent } from './app/pages/place-details-page/place-details-page';
import { CatalogPageComponent } from './app/pages/catalog-page/catalog-page.component';
import { ProfilePageComponent } from './app/pages/profile-page/profile-page';
import { AuthPageComponent } from './app/pages/auth-page/auth-page.component';

const routes = [
  { path: '', component: HomePageComponent },
  { path: 'catalog', component: CatalogPageComponent },
  { path: 'catalog/:id', component: PlaceDetailsPageComponent },
  { path: 'auth', component: AuthPageComponent },
  { path: 'profile', component: ProfilePageComponent },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()],
}).catch((err) => console.error(err));
