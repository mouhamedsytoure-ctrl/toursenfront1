import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService); const router = inject(Router);
  if (!auth.isAuthenticated()) { router.navigate(['/login']); return false; }
  const r = auth.role();
  if (r === 'super_admin' || r === 'admin') return true;
  router.navigate(['/espace']); return false;
};

// Reservé au super_admin (ex: parametres de l'agence) : un admin simple
// est redirige vers le tableau de bord au lieu de voir un formulaire
// qu'il ne pourra de toute facon pas enregistrer (403 cote API).
export const superAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService); const router = inject(Router);
  if (!auth.isAuthenticated()) { router.navigate(['/login']); return false; }
  if (auth.role() === 'super_admin') return true;
  router.navigate(['/app']); return false;
};

export const locataireGuard: CanActivateFn = () => {
  const auth = inject(AuthService); const router = inject(Router);
  if (!auth.isAuthenticated()) { router.navigate(['/login']); return false; }
  if (auth.role() === 'locataire') return true;
  router.navigate(['/app']); return false;
};
