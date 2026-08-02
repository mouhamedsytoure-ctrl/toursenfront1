import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AbonnementService } from './abonnement.service';

/**
 * Capte le code 402 renvoye par le middleware "abonnement" du back
 * et bascule l'utilisateur sur l'ecran de reabonnement.
 *
 * 402 = abonnement expire ou suspendu   (a distinguer du 403 = droits insuffisants)
 */
export const abonnementInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const abo = inject(AbonnementService);

  // Motifs qui bloquent toute l'application (bascule sur /abonnement).
  // Tout autre motif 402 (quota_atteint, utilisateurs_atteint, ...) est une
  // limite ponctuelle : le formulaire concerne affiche le message lui-meme.
  const motifsBlocage = ['essai_termine', 'suspendu'];

  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {
      if (e.status === 402) {
        if (!motifsBlocage.includes(e.error?.motif)) {
          abo.quota.set(e.error);
          return throwError(() => e);
        }

        abo.blocage.set({
          motif: e.error?.motif ?? 'essai_termine',
          message: e.error?.message ?? '',
          agence: e.error?.agence ?? null,
        });

        if (!router.url.startsWith('/abonnement')) {
          router.navigateByUrl('/abonnement');
        }
      }
      return throwError(() => e);
    })
  );
};
