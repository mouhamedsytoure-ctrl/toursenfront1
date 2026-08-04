import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';

interface MenuItem { label: string; path: string; icon: string; superAdminOnly?: boolean; proOnly?: boolean; }

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell implements OnInit {
  // Pas de repli sur le logo Toursen ici : une nouvelle agence sans logo
  // ne doit pas voir la marque d'une autre agence. Le template affiche
  // un pictogramme generique si logo() est null.
  logo = () => this.auth.agence()?.logo ?? null;
  agenceNom = () => this.auth.agence()?.nom || 'Sunnu Immo';
  open = signal(false); // menu mobile

  menu: MenuItem[] = [
    { label: 'Tableau de bord', path: '/app',              icon: '▦' },
    { label: 'Immeubles',       path: '/app/immeubles',    icon: '🏢' },
    { label: 'Terrains',        path: '/app/terrains',     icon: '🗺' },
    { label: 'Locataires',      path: '/app/locataires',   icon: '👥' },
    { label: 'Contrats',        path: '/app/contrats',     icon: '📄' },
    { label: 'Loyers',          path: '/app/loyers',       icon: '💰' },
    { label: 'Réclamations',    path: '/app/reclamations', icon: '🛠' },
    { label: 'Utilisateurs',    path: '/app/utilisateurs', icon: '🔑', superAdminOnly: true },
    { label: 'Statistiques',    path: '/app/statistiques', icon: '📈', proOnly: true },
    { label: 'Parametres',      path: '/app/parametres',   icon: '⚙️', superAdminOnly: true },
  ];

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    // Rafraichit les chiffres d'usage (quota, utilisateurs, essai) a l'entree
    // dans l'espace de gestion : les valeurs stockees datent de la connexion.
    this.auth.rafraichirAgence();
  }

  visibleMenu() {
    const isSuper = this.auth.role() === 'super_admin';
    return this.menu.filter(m => !m.superAdminOnly || isSuper);
  }

  estProOuPlus(): boolean {
    const plan = this.auth.agence()?.plan;
    return plan === 'pro' || plan === 'illimite';
  }

  // Bandeau d'usage affiche sous l'en-tete : essai qui se termine, ou quota atteint.
  // null si tout va bien (compte paye, dans les clous) -- pas de bruit inutile.
  bandeau(): { type: 'essai' | 'quota'; texte: string; urgent: boolean } | null {
    const a = this.auth.agence();
    if (!a) return null;

    if (a.quota_logements > 0 && a.nb_logements >= a.quota_logements) {
      return { type: 'quota', texte: `Quota de logements atteint (${a.nb_logements}/${a.quota_logements}). Passez a une formule superieure pour en ajouter.`, urgent: true };
    }

    if (a.plan === 'essai' && a.jours_restants !== null) {
      if (a.jours_restants <= 0) {
        return { type: 'essai', texte: "Votre essai gratuit est termine.", urgent: true };
      }
      if (a.jours_restants <= 5) {
        const j = a.jours_restants === 1 ? '1 jour' : `${a.jours_restants} jours`;
        return { type: 'essai', texte: `Il vous reste ${j} d'essai gratuit.`, urgent: a.jours_restants <= 3 };
      }
    }

    return null;
  }

  roleLabel(): string {
    switch (this.auth.role()) {
      case 'super_admin': return 'Super administrateur';
      case 'admin': return 'Administrateur';
      default: return this.auth.role();
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/accueil']);
  }
}
