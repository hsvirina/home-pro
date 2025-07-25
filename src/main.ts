import { bootstrapApplication } from '@angular/platform-browser';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { filter } from 'rxjs/operators';

import { AppComponent } from './app/app.component';
import { HomePageComponent } from './app/pages/home-page/home-page.component';
import { CatalogPageComponent } from './app/pages/catalog-page/catalog-page.component';
import { PlaceDetailsPageComponent } from './app/pages/place-details-page/place-details-page';
import { AuthPageComponent } from './app/pages/auth-page/auth-page.component';
import { ProfilePageComponent } from './app/pages/profile-page/profile-page';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';

const routes = [
  { path: '', component: HomePageComponent },
  { path: 'catalog', component: CatalogPageComponent },
  { path: 'catalog/:id', component: PlaceDetailsPageComponent },
  { path: 'auth', component: AuthPageComponent },
  { path: 'profile', component: ProfilePageComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
  ],
}).then(appRef => {
  const router = appRef.injector.get(Router);
  router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe(() => {
    window.scrollTo(0, 0);
  });
}).catch(err => console.error(err));
