import { Routes } from '@angular/router';
import { adminGuard, locataireGuard, superAdminGuard } from './core/role.guard';
import { plateformeGuard } from './core/plateforme.guard';

export const routes: Routes = [
  // Page produit (racine du site)
  { path: 'accueil',     loadComponent: () => import('./pages/accueil/accueil').then(m => m.Accueil) },

  { path: 'login',       loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'inscription', loadComponent: () => import('./pages/inscription/inscription').then(m => m.Inscription) },
  { path: 'mot-de-passe-oublie',     loadComponent: () => import('./pages/mot-de-passe-oublie/mot-de-passe-oublie').then(m => m.MotDePasseOublie) },
  { path: 'reinitialiser-mot-de-passe', loadComponent: () => import('./pages/reinitialiser-mot-de-passe/reinitialiser-mot-de-passe').then(m => m.ReinitialiserMotDePasse) },

  // Ecran de reabonnement (essai termine ou compte suspendu)
  { path: 'abonnement',  loadComponent: () => import('./pages/abonnement/abonnement').then(m => m.Abonnement) },

  // Vitrine publique (visiteurs, sans connexion), une par agence (slug dans l'URL)
  { path: 'vitrine/:slug',      loadComponent: () => import('./pages/vitrine/vitrine').then(m => m.Vitrine) },
  { path: 'vitrine/:slug/:id',  loadComponent: () => import('./pages/vitrine/vitrine-detail').then(m => m.VitrineDetail) },
  { path: 'apropos',     loadComponent: () => import('./pages/apropos/apropos').then(m => m.Apropos) },

  // Espace locataire (responsive : ordinateur ET telephone, iPhone inclus)
  { path: 'espace', canActivate: [locataireGuard], loadComponent: () => import('./pages/espace/espace').then(m => m.Espace) },

  // Console du proprietaire de la plateforme
  {
    path: 'plateforme',
    canActivate: [plateformeGuard],
    loadComponent: () => import('./pages/plateforme/plateforme').then(m => m.Plateforme),
  },

  // Espace de gestion (admin / super admin uniquement)
  {
    path: 'app',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/shell/shell').then(m => m.Shell),
    children: [
      { path: '',                 loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'immeubles',        loadComponent: () => import('./pages/immeubles/immeubles').then(m => m.Immeubles) },
      { path: 'immeubles/:id',    loadComponent: () => import('./pages/immeubles/immeuble-detail').then(m => m.ImmeubleDetail) },
      { path: 'terrains',         loadComponent: () => import('./pages/terrains/terrains').then(m => m.Terrains) },
      { path: 'locataires',       loadComponent: () => import('./pages/locataires/locataires').then(m => m.Locataires) },
      { path: 'contrats',         loadComponent: () => import('./pages/contrats/contrats').then(m => m.Contrats) },
      { path: 'contrats/nouveau', loadComponent: () => import('./pages/contrats/nouveau-contrat').then(m => m.NouveauContrat) },
      { path: 'contrats/:id',     loadComponent: () => import('./pages/contrats/contrat-detail').then(m => m.ContratDetail) },
      { path: 'loyers',           loadComponent: () => import('./pages/loyers/loyers').then(m => m.Loyers) },
      { path: 'reclamations',     loadComponent: () => import('./pages/reclamations/reclamations').then(m => m.Reclamations) },
      { path: 'utilisateurs',     canActivate: [superAdminGuard], loadComponent: () => import('./pages/utilisateurs/utilisateurs').then(m => m.Utilisateurs) },
      { path: 'statistiques',     loadComponent: () => import('./pages/statistiques/statistiques').then(m => m.Statistiques) },
      { path: 'parametres',       canActivate: [superAdminGuard], loadComponent: () => import('./pages/parametres/parametres').then(m => m.Parametres) },
    ],
  },

  { path: '', pathMatch: 'full', redirectTo: 'accueil' },
  { path: '**', redirectTo: 'accueil' },
];