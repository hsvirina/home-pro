import { register } from 'swiper/element/bundle';
// Register Swiper custom elements for use in templates
register();

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Router, NavigationEnd } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { filter } from 'rxjs/operators';

import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { appRoutes } from './app/app-routing.routes';

// ngx-translate imports
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, Translation } from '@ngx-translate/core';
import { Observable } from 'rxjs';

/**
 * Factory function to create ngx-translate TranslateLoader.
 * Loads translation JSON files from the assets/i18n folder.
 *
 * @param http - Angular HttpClient instance used to fetch translation files
 * @returns TranslateLoader - loader returning an Observable with translations
 */
export function createTranslateLoader(http: HttpClient): TranslateLoader {
  const loader = new TranslateHttpLoader(http, './assets/i18n/', '.json');
  return {
    getTranslation: (lang: string): Observable<Translation> =>
      loader.getTranslation(lang) as Observable<Translation>,
  };
}

/**
 * Bootstraps the Angular application with necessary providers.
 * Sets up routing, HTTP client with interceptors, animations,
 * and internationalization (i18n) support.
 * Also listens for router navigation events to scroll to the top on route changes.
 */
async function bootstrap() {
  try {
    const appRef = await bootstrapApplication(AppComponent, {
      providers: [
        provideRouter(appRoutes), // Provides application routing configuration
        provideHttpClient(withInterceptors([authInterceptor])), // HTTP client with authentication interceptor
        provideAnimations(), // Enable Angular animations support
        ...(TranslateModule.forRoot({
          fallbackLang: 'en', // Default language fallback
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient],
          },
        }).providers ?? []), // Translation module providers
      ],
    });

    // Scroll to top of the page on every successful navigation event
    const router = appRef.injector.get(Router);
    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });

  } catch (err) {
    // Log errors occurring during app bootstrap process for diagnostics
    console.error('Bootstrap error:', err);
  }
}

// Start the application
bootstrap();
