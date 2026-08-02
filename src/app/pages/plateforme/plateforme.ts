import { Component, signal, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api, fcfa } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';

type AgenceLigne = {
  id: number; nom: string; slug: string; ville: string | null; telephone: string | null;
  plan: string; plan_libelle: string; prix_mensuel: number;
  plan_souhaite: string | null; plan_souhaite_libelle: string | null;
  statut: string; active: boolean;
  quota_logements: number; max_utilisateurs: number; nb_logements: number; nb_utilisateurs: number;
  essai_termine_le: string | null; jours_restants: number | null; inscrite_le: string;
};

type Stats = {
  nb_agences: number; nb_actives: number; nb_en_essai: number; nb_payantes: number;
  nb_suspendues: number; nb_expirees: number; mrr: number; essais_bientot: number;
};

@Component({
  selector: 'app-plateforme',
  standalone: true,
  imports: [FormsModule],
  template: `
  <div class="pf">
    <header class="pf-top">
      <div>
        <h1>Console plateforme</h1>
        <p class="sub">Vos agences clientes et leurs abonnements</p>
      </div>
      <button class="btn" (click)="deconnexion()">Déconnexion</button>
    </header>

    @if (loading()) { <p class="muted">Chargement…</p> }
    @if (erreur()) { <p class="err">{{ erreur() }}</p> }

    @if (stats(); as s) {
      <div class="kpis">
        <div class="kpi accent">
          <span class="k-val">{{ money(s.mrr) }}</span>
          <span class="k-lab">Revenu mensuel</span>
        </div>
        <div class="kpi"><span class="k-val">{{ s.nb_agences }}</span><span class="k-lab">Agences</span></div>
        <div class="kpi"><span class="k-val">{{ s.nb_payantes }}</span><span class="k-lab">Payantes</span></div>
        <div class="kpi"><span class="k-val">{{ s.nb_en_essai }}</span><span class="k-lab">En essai</span></div>
        <div class="kpi" [class.warn]="s.essais_bientot > 0">
          <span class="k-val">{{ s.essais_bientot }}</span><span class="k-lab">Essais < 3 jours</span>
        </div>
        <div class="kpi" [class.danger]="s.nb_suspendues + s.nb_expirees > 0">
          <span class="k-val">{{ s.nb_suspendues + s.nb_expirees }}</span><span class="k-lab">Bloquées</span>
        </div>
      </div>
    }

    <div class="carte">
      <table class="tbl">
        <thead>
          <tr>
            <th>Agence</th><th>Formule</th><th>Statut</th>
            <th class="num">Logements</th><th class="num">Essai</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (a of agences(); track a.id) {
            <tr>
              <td>
                <strong>{{ a.nom }}</strong>
                <span class="slug">/{{ a.slug }}</span>
                @if (a.ville) { <span class="slug"> · {{ a.ville }}</span> }
              </td>
              <td>
                <select [ngModel]="a.plan" (ngModelChange)="changerPlan(a, $event)">
                  <option value="essai">Essai</option>
                  <option value="starter">Standard</option>
                  <option value="pro">Pro</option>
                  <option value="illimite">VIP</option>
                </select>
                <span class="slug">{{ money(a.prix_mensuel) }}</span>
                @if (a.plan_souhaite_libelle) {
                  <div class="souhaite">Souhaite : {{ a.plan_souhaite_libelle }}</div>
                }
              </td>
              <td>
                <span class="pill" [class.ok]="a.active" [class.ko]="!a.active">
                  {{ a.active ? 'Actif' : (a.statut === 'suspendu' ? 'Suspendu' : 'Expiré') }}
                </span>
              </td>
              <td class="num">
                {{ a.nb_logements }}<span class="slug">/{{ a.quota_logements || '∞' }}</span>
              </td>
              <td class="num">
                @if (a.jours_restants === null) { <span class="slug">—</span> }
                @else { <span [class.late]="a.jours_restants < 3">{{ a.jours_restants }} j</span> }
              </td>
              <td class="act">
                <button class="mini" (click)="prolonger(a, 14)">+14j</button>
                @if (a.statut === 'suspendu') {
                  <button class="mini" (click)="changerStatut(a, 'actif')">Réactiver</button>
                } @else {
                  <button class="mini ko" (click)="changerStatut(a, 'suspendu')">Suspendre</button>
                }
              </td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="muted">Aucune agence inscrite pour le moment.</td></tr>
          }
        </tbody>
      </table>
    </div>
  </div>
  `,
  styles: [`
    .pf { padding: 28px; max-width: 1180px; margin: 0 auto; }
    .pf-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; }
    h1 { margin:0; font-size:28px; }
    .sub { margin:4px 0 0; color:#6b7280; }
    .kpis { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:14px; margin-bottom:24px; }
    .kpi { background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:4px; }
    .kpi.accent { background:#12291f; border-color:#12291f; }
    .kpi.accent .k-val, .kpi.accent .k-lab { color:#e9c46a; }
    .kpi.warn { border-color:#f59e0b; }
    .kpi.danger { border-color:#dc2626; }
    .k-val { font-size:24px; font-weight:600; }
    .k-lab { font-size:13px; color:#6b7280; }
    .carte { background:#fff; border:1px solid #e5e7eb; border-radius:12px; overflow:auto; }
    .tbl { width:100%; border-collapse:collapse; font-size:14px; }
    .tbl th { text-align:left; padding:12px 14px; border-bottom:1px solid #e5e7eb; color:#6b7280; font-weight:500; }
    .tbl td { padding:12px 14px; border-bottom:1px solid #f3f4f6; vertical-align:middle; }
    .num { text-align:right; }
    .slug { color:#9ca3af; font-size:12px; margin-left:6px; }
    .souhaite { color:#c9922f; font-size:11px; font-weight:600; margin-top:4px; }
    .pill { padding:3px 10px; border-radius:999px; font-size:12px; }
    .pill.ok { background:#dcfce7; color:#166534; }
    .pill.ko { background:#fee2e2; color:#991b1b; }
    .late { color:#dc2626; font-weight:600; }
    select { padding:5px 8px; border:1px solid #d1d5db; border-radius:8px; }
    .act { display:flex; gap:6px; }
    .mini { padding:5px 10px; border:1px solid #d1d5db; background:#fff; border-radius:8px; cursor:pointer; font-size:12px; }
    .mini.ko { border-color:#fca5a5; color:#991b1b; }
    .btn { padding:9px 16px; border:1px solid #d1d5db; background:#fff; border-radius:10px; cursor:pointer; }
    .muted { color:#9ca3af; text-align:center; padding:22px; }
    .err { color:#b91c1c; background:#fee2e2; padding:10px 14px; border-radius:8px; }
  `],
})
export class Plateforme implements OnInit {
  agences = signal<AgenceLigne[]>([]);
  stats   = signal<Stats | null>(null);
  loading = signal(true);
  erreur  = signal('');

  constructor(private api: Api, private auth: AuthService, private router: Router) {}

  money = (v: number) => fcfa(v);

  async ngOnInit() { await this.charger(); }

  private async charger() {
    this.loading.set(true);
    this.erreur.set('');
    try {
      const [a, s] = await Promise.all([
        this.api.get('/plateforme/agences'),
        this.api.get('/plateforme/stats'),
      ]);
      this.agences.set(a as AgenceLigne[]);
      this.stats.set(s as Stats);
    } catch (e: any) {
      this.erreur.set(e?.error?.message || 'Chargement impossible.');
    } finally {
      this.loading.set(false);
    }
  }

  async changerPlan(a: AgenceLigne, plan: string) {
    await this.majAgence(a, { plan });
  }

  async changerStatut(a: AgenceLigne, statut: string) {
    await this.majAgence(a, { statut });
  }

  private async majAgence(a: AgenceLigne, corps: any) {
    try {
      await this.api.put('/plateforme/agences/' + a.id, corps);
      await this.charger();
    } catch (e: any) {
      this.erreur.set(e?.error?.message || 'Modification impossible.');
    }
  }

  async prolonger(a: AgenceLigne, jours: number) {
    try {
      await this.api.post('/plateforme/agences/' + a.id + '/prolonger', { jours });
      await this.charger();
    } catch (e: any) {
      this.erreur.set(e?.error?.message || 'Prolongation impossible.');
    }
  }

  deconnexion() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
