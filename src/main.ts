import { register } from 'swiper/element/bundle';
register();
import { bootstrapApplication } from '@angular/platform-browser';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { filter } from 'rxjs/operators';

import { AppComponent } from './app/app.component';
import { HomePageComponent } from './app/pages/home-page/home-page.component';
import { CatalogPageComponent } from './app/pages/catalog-page/catalog-page.component';
import { PlaceDetailsPageComponent } from './app/pages/place-details-page/place-details-page';
import { AuthPageComponent } from './app/pages/auth-page/auth-page.component';
import { ProfilePageComponent } from './app/pages/profile-page/profile-page';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { PublicUserProfileComponent } from './app/pages/public-user-profile/public-user-profile.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  TranslateLoader,
  TranslateModule,
  Translation,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';

export function createTranslateLoader(http: HttpClient): TranslateLoader {
  const loader = new TranslateHttpLoader(http, './assets/i18n/', '.json');
  return {
    getTranslation: (lang: string): Observable<Translation> =>
      loader.getTranslation(lang) as Observable<Translation>,
  };
}

const routes = [
  { path: '', component: HomePageComponent },
  { path: 'catalog', component: CatalogPageComponent },
  { path: 'catalog/:id', component: PlaceDetailsPageComponent },
  { path: 'auth', component: AuthPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'users/:id', component: PublicUserProfileComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),

    ...(TranslateModule.forRoot({
      fallbackLang: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }).providers ?? []),
  ],
})
  .then((appRef) => {
    const router = appRef.injector.get(Router);
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
  })
  .catch((err) => console.error(err));
