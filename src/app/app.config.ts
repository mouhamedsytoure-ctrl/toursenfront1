import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth.interceptor';
import { abonnementInterceptor } from './core/abonnement.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    // L'ordre compte : authInterceptor pose le jeton, abonnementInterceptor
    // intercepte la reponse 402 qui en decoule.
    provideHttpClient(withInterceptors([authInterceptor, abonnementInterceptor])),
  ],
};
