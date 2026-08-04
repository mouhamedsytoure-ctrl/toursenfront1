import { Component, signal, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api, fcfa } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';

type AgenceLigne = {
  id: number; nom: string; slug: string; ville: string | null; telephone: string | null;
  plan: string; plan_libelle: string; prix_mensuel: number;
  plan_souhaite: string | null; plan_souhaite_libelle: string | null;
  statut: string; motif_suspension: string | null; note_suspension: string | null; active: boolean;
  quota_logements: number; max_utilisateurs: number; nb_logements: number; nb_utilisateurs: number;
  essai_termine_le: string | null; jours_restants: number | null; inscrite_le: string;
};

type MoisEvolution = { periode: string; libelle: string; nb_agences: number; revenus: number };

type Stats = {
  nb_agences: number; nb_actives: number; nb_en_essai: number; nb_payantes: number;
  nb_suspendues: number; nb_expirees: number; mrr: number; essais_bientot: number;
  evolution: MoisEvolution[];
  comparaison: {
    agences_ce_mois: number; agences_mois_dernier: number; variation_agences: number | null;
    revenus_ce_mois: number; revenus_mois_dernier: number; variation_revenus: number | null;
  };
  total_annee_courante: number;
  total_encaisse_historique: number;
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

      <div class="comp-row">
        <div class="comp-card">
          <span class="comp-lab">Nouvelles agences ce mois</span>
          <div class="comp-val">
            {{ s.comparaison.agences_ce_mois }}
            @if (s.comparaison.variation_agences !== null) {
              <span class="comp-var" [class.up]="s.comparaison.variation_agences >= 0" [class.down]="s.comparaison.variation_agences < 0">
                {{ s.comparaison.variation_agences >= 0 ? '▲' : '▼' }} {{ abs(s.comparaison.variation_agences) }}%
              </span>
            }
          </div>
          <span class="comp-sub">vs {{ s.comparaison.agences_mois_dernier }} le mois dernier</span>
        </div>
        <div class="comp-card">
          <span class="comp-lab">Revenus encaissés ce mois</span>
          <div class="comp-val">
            {{ money(s.comparaison.revenus_ce_mois) }}
            @if (s.comparaison.variation_revenus !== null) {
              <span class="comp-var" [class.up]="s.comparaison.variation_revenus >= 0" [class.down]="s.comparaison.variation_revenus < 0">
                {{ s.comparaison.variation_revenus >= 0 ? '▲' : '▼' }} {{ abs(s.comparaison.variation_revenus) }}%
              </span>
            }
          </div>
          <span class="comp-sub">vs {{ money(s.comparaison.revenus_mois_dernier) }} le mois dernier</span>
        </div>
        <div class="comp-card">
          <span class="comp-lab">Encaissé cette année</span>
          <div class="comp-val">{{ money(s.total_annee_courante) }}</div>
          <span class="comp-sub">Historique total : {{ money(s.total_encaisse_historique) }}</span>
        </div>
      </div>

      <div class="carte evo-carte">
        <h2>Nouvelles agences — 12 derniers mois</h2>
        @if (s.total_encaisse_historique === 0) {
          <p class="note-vide">Aucun paiement automatique n'est encore passé (PayDunya) : les revenus resteront à 0 tant qu'aucune facture n'a été réellement payée.</p>
        }
        <div class="barres">
          @for (m of s.evolution; track m.periode) {
            <div class="barre">
              <div class="b-tube"><div class="b-fill" [style.height.%]="pct(m.nb_agences, maxAgences(s.evolution))"></div></div>
              <span class="b-val">{{ m.nb_agences }}</span>
              <span class="b-lab">{{ m.libelle }}</span>
            </div>
          }
        </div>
      </div>

      @if (s.total_encaisse_historique > 0) {
        <div class="carte evo-carte">
          <h2>Revenus encaissés — 12 derniers mois</h2>
          <div class="barres">
            @for (m of s.evolution; track m.periode) {
              <div class="barre">
                <div class="b-tube"><div class="b-fill or" [style.height.%]="pct(m.revenus, maxRevenus(s.evolution))"></div></div>
                <span class="b-val">{{ court(m.revenus) }}</span>
                <span class="b-lab">{{ m.libelle }}</span>
              </div>
            }
          </div>
        </div>
      }
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
                @if (a.statut === 'suspendu') {
                  <div class="motif-susp">
                    {{ a.motif_suspension === 'autre' ? 'Autre motif' : 'Defaut de paiement' }}
                    @if (a.note_suspension) { <span class="note-susp"> · {{ a.note_suspension }}</span> }
                  </div>
                }
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
                  <button class="mini ko" (click)="ouvrirSuspension(a)">Suspendre</button>
                }
              </td>
            </tr>
            @if (suspensionEnCours() === a.id) {
              <tr class="ligne-susp">
                <td colspan="6">
                  <div class="form-susp">
                    <label>
                      Motif
                      <select [(ngModel)]="motifChoisi">
                        <option value="paiement">Defaut de paiement (l'agence pourra se reactiver en payant)</option>
                        <option value="autre">Autre motif (paiement bloque, contact obligatoire)</option>
                      </select>
                    </label>
                    <label class="note-lab">
                      Note affichee a l'agence (optionnel)
                      <input class="note-input" [(ngModel)]="noteChoisie" placeholder="Ex : reclamation en cours"/>
                    </label>
                    <div class="form-susp-actions">
                      <button class="mini ko" (click)="confirmerSuspension(a)">Confirmer la suspension</button>
                      <button class="mini" (click)="suspensionEnCours.set(null)">Annuler</button>
                    </div>
                  </div>
                </td>
              </tr>
            }
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
    .motif-susp { color:#991b1b; font-size:11px; margin-top:4px; max-width: 220px; }
    .note-susp { color:#6b7280; font-style: italic; }
    .ligne-susp td { background:#fafafa; padding: 16px 14px; }
    .form-susp { display:flex; flex-wrap:wrap; gap:16px; align-items:flex-end; }
    .form-susp label { display:flex; flex-direction:column; gap:4px; font-size:12px; color:#6b7280; font-weight:600; }
    .form-susp select { min-width: 260px; }
    .note-lab { flex: 1; min-width: 220px; }
    .note-input { padding:7px 10px; border:1px solid #d1d5db; border-radius:8px; font-size:13px; font-weight:400; }
    .form-susp-actions { display:flex; gap:8px; }
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

    .comp-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:14px; margin-bottom:24px; }
    .comp-card { background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:16px; }
    .comp-lab { font-size:12.5px; color:#6b7280; }
    .comp-val { font-size:22px; font-weight:700; margin:4px 0 2px; display:flex; align-items:baseline; gap:8px; }
    .comp-var { font-size:12px; font-weight:600; }
    .comp-var.up { color:#16a34a; } .comp-var.down { color:#dc2626; }
    .comp-sub { font-size:12px; color:#9ca3af; }

    .evo-carte { padding:20px; margin-bottom:18px; }
    .evo-carte h2 { margin:0 0 6px; font-size:15px; }
    .note-vide { color:#9ca3af; font-size:12.5px; margin:0 0 14px; }
    .barres { display:flex; gap:8px; align-items:flex-end; overflow-x:auto; padding-top:8px; }
    .barre { flex:1; min-width:44px; display:flex; flex-direction:column; align-items:center; gap:5px; }
    .b-tube { width:100%; height:110px; background:#f3f4f6; border-radius:6px; display:flex; align-items:flex-end; overflow:hidden; }
    .b-fill { width:100%; background:#12291f; border-radius:6px 6px 0 0; transition:height .4s; min-height:2px; }
    .b-fill.or { background:#c9922f; }
    .b-val { font-size:11px; font-weight:600; } .b-lab { font-size:10px; color:#9ca3af; }
  `],
})
export class Plateforme implements OnInit {
  agences = signal<AgenceLigne[]>([]);
  stats   = signal<Stats | null>(null);
  loading = signal(true);
  erreur  = signal('');

  suspensionEnCours = signal<number | null>(null);
  motifChoisi: 'paiement' | 'autre' = 'paiement';
  noteChoisie = '';

  constructor(private api: Api, private auth: AuthService, private router: Router) {}

  money = (v: number) => fcfa(v);
  abs = (v: number) => Math.abs(v);

  maxAgences(evolution: MoisEvolution[]): number {
    return Math.max(...evolution.map(m => m.nb_agences), 1);
  }
  maxRevenus(evolution: MoisEvolution[]): number {
    return Math.max(...evolution.map(m => m.revenus), 1);
  }
  pct(valeur: number, max: number): number {
    return Math.round((valeur / max) * 100);
  }
  court(v: number): string {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace('.0', '') + 'M';
    if (v >= 1000) return Math.round(v / 1000) + 'k';
    return String(v);
  }

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

  ouvrirSuspension(a: AgenceLigne) {
    this.motifChoisi = 'paiement';
    this.noteChoisie = '';
    this.suspensionEnCours.set(a.id);
  }

  async confirmerSuspension(a: AgenceLigne) {
    await this.majAgence(a, {
      statut: 'suspendu',
      motif_suspension: this.motifChoisi,
      note_suspension: this.noteChoisie.trim() || null,
    });
    this.suspensionEnCours.set(null);
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
