import { Component, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Api, fcfa } from '../../core/api.service';

type Point = { periode: string; libelle: string; encaisse: number; attendu: number; nb: number };
type Taux  = { periode: string; libelle: string; taux: number };

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
  <div class="stats">
    <header class="st-top">
      <div>
        <h1>Statistiques</h1>
        <p class="sub">Analyse de votre activite locative</p>
      </div>
      <select [(ngModel)]="mois" (ngModelChange)="charger()">
        <option [ngValue]="6">6 derniers mois</option>
        <option [ngValue]="12">12 derniers mois</option>
        <option [ngValue]="24">24 derniers mois</option>
      </select>
    </header>

    @if (loading()) { <p class="muted">Chargement des donnees…</p> }
    @if (interdit()) {
      <div class="upsell">
        <span class="upsell-ic">📈</span>
        <h2>Statistiques avancees</h2>
        <p>{{ erreur() }}</p>
        <a class="btn-upsell" routerLink="/abonnement">Voir les formules →</a>
      </div>
    } @else if (erreur()) {
      <p class="err">{{ erreur() }}</p>
    }

    @if (data(); as d) {

      <!-- Indicateurs de tete -->
      <div class="kpis">
        <div class="kpi hero">
          <span class="k-lab">Encaisse ce mois</span>
          <span class="k-val">{{ money(d.comparaison.encaisse_actuel) }}</span>
          @if (d.comparaison.variation !== null) {
            <span class="k-var" [class.up]="d.comparaison.variation >= 0" [class.down]="d.comparaison.variation < 0">
              {{ d.comparaison.variation >= 0 ? '▲' : '▼' }} {{ abs(d.comparaison.variation) }}% vs mois dernier
            </span>
          }
        </div>
        <div class="kpi">
          <span class="k-lab">Taux d'occupation</span>
          <span class="k-val">{{ d.occupation.taux }}%</span>
          <span class="k-sub">{{ d.occupation.loues }} loues / {{ d.occupation.total }}</span>
        </div>
        <div class="kpi" [class.alerte]="d.retards.total_montant > 0">
          <span class="k-lab">Impayes</span>
          <span class="k-val">{{ money(d.retards.total_montant) }}</span>
          <span class="k-sub">{{ d.retards.total_nb }} echeance(s)</span>
        </div>
        <div class="kpi">
          <span class="k-lab">Delai reclamations</span>
          <span class="k-val">{{ d.reclamations.delai_moyen }} j</span>
          <span class="k-sub">{{ d.reclamations.ouvertes }} ouverte(s)</span>
        </div>
      </div>

      <!-- Evolution des encaissements -->
      <section class="carte">
        <h2>Evolution des encaissements</h2>
        <svg [attr.viewBox]="'0 0 ' + W + ' ' + H" class="chart">
          @for (g of grille(); track g.y) {
            <line [attr.x1]="PAD" [attr.y1]="g.y" [attr.x2]="W - 12" [attr.y2]="g.y" class="grid"/>
            <text [attr.x]="PAD - 8" [attr.y]="g.y + 4" class="ax" text-anchor="end">{{ g.label }}</text>
          }
          <path [attr.d]="airePath()" class="aire"/>
          <path [attr.d]="lignePath()" class="ligne"/>
          @for (p of pts(); track p.periode) {
            <circle [attr.cx]="p.x" [attr.cy]="p.y" r="3.5" class="pt"/>
            <text [attr.x]="p.x" [attr.y]="H - 8" class="ax" text-anchor="middle">{{ p.libelle }}</text>
          }
        </svg>
      </section>

      <div class="duo">
        <!-- Taux de recouvrement -->
        <section class="carte">
          <h2>Taux de recouvrement</h2>
          <div class="barres">
            @for (r of d.recouvrement; track r.periode) {
              <div class="barre">
                <div class="b-tube">
                  <div class="b-fill" [style.height.%]="r.taux"
                       [class.bas]="r.taux < 60" [class.moyen]="r.taux >= 60 && r.taux < 85"></div>
                </div>
                <span class="b-val">{{ r.taux }}%</span>
                <span class="b-lab">{{ r.libelle }}</span>
              </div>
            }
          </div>
        </section>

        <!-- Modes de paiement -->
        <section class="carte">
          <h2>Modes de paiement</h2>
          @for (m of d.modes_paiement; track m.mode) {
            <div class="mode">
              <div class="m-head">
                <span>{{ m.libelle }}</span>
                <strong>{{ m.pourcentage }}%</strong>
              </div>
              <div class="m-tube"><div class="m-fill" [style.width.%]="m.pourcentage"></div></div>
              <span class="m-sub">{{ money(m.montant) }} · {{ m.nb }} paiement(s)</span>
            </div>
          } @empty { <p class="muted">Aucun paiement enregistre.</p> }
        </section>
      </div>

      <div class="duo">
        <!-- Anciennete des impayes -->
        <section class="carte">
          <h2>Anciennete des impayes</h2>
          <table class="tbl">
            <tbody>
              @for (t of d.retards.tranches; track t.cle) {
                <tr>
                  <td>{{ t.libelle }}</td>
                  <td class="num">{{ t.nb }}</td>
                  <td class="num" [class.rouge]="t.cle === 'plus_trois' && t.montant > 0">{{ money(t.montant) }}</td>
                </tr>
              }
            </tbody>
          </table>
          @if (d.retards.pires.length) {
            <h3>Les plus anciens</h3>
            <table class="tbl">
              <tbody>
                @for (p of d.retards.pires; track p.periode + p.locataire) {
                  <tr>
                    <td>{{ p.locataire }}<span class="slug"> · {{ p.logement }}</span></td>
                    <td class="num"><span class="pill ko">{{ p.retard }} mois</span></td>
                    <td class="num">{{ money(p.montant) }}</td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </section>

        <!-- Classement des immeubles -->
        <section class="carte">
          <h2>Revenus par immeuble</h2>
          <p class="muted-s">Sur les 12 derniers mois</p>
          @for (i of d.top_immeubles; track i.id) {
            <div class="mode">
              <div class="m-head">
                <span>{{ i.nom }}<span class="slug"> · {{ i.ville }}</span></span>
                <strong>{{ money(i.revenu) }}</strong>
              </div>
              <div class="m-tube"><div class="m-fill or" [style.width.%]="partImmeuble(i.revenu, d.top_immeubles)"></div></div>
            </div>
          } @empty { <p class="muted">Aucun revenu sur la periode.</p> }
        </section>
      </div>

      <!-- Occupation par immeuble -->
      <section class="carte">
        <h2>Occupation par immeuble</h2>
        <table class="tbl">
          <thead><tr><th>Immeuble</th><th class="num">Loues</th><th class="num">Total</th><th class="num">Taux</th></tr></thead>
          <tbody>
            @for (o of d.occupation.par_immeuble; track o.nom) {
              <tr>
                <td>{{ o.nom }}</td>
                <td class="num">{{ o.loues }}</td>
                <td class="num">{{ o.total }}</td>
                <td class="num">
                  <span class="pill" [class.ok]="o.taux >= 80" [class.moy]="o.taux >= 50 && o.taux < 80" [class.ko]="o.taux < 50">
                    {{ o.taux }}%
                  </span>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </section>
    }
  </div>
  `,
  styles: [`
    .stats { padding: 4px 0 40px; }
    .st-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:22px; gap:16px; }
    h1 { margin:0; font-size:28px; }
    h2 { margin:0 0 14px; font-size:16px; font-weight:600; }
    h3 { margin:20px 0 10px; font-size:14px; font-weight:600; color:#6b7280; }
    .sub { margin:4px 0 0; color:#6b7280; }
    select { padding:8px 12px; border:1px solid #d1d5db; border-radius:10px; background:#fff; }

    .kpis { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:14px; margin-bottom:18px; }
    .kpi { background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:18px; display:flex; flex-direction:column; gap:5px; }
    .kpi.hero { background:#12291f; border-color:#12291f; }
    .kpi.hero .k-lab { color:#9db3a8; }
    .kpi.hero .k-val { color:#e9c46a; }
    .kpi.alerte { border-color:#fca5a5; }
    .k-lab { font-size:13px; color:#6b7280; }
    .k-val { font-size:26px; font-weight:700; letter-spacing:-.5px; }
    .k-sub, .k-var { font-size:12px; color:#9ca3af; }
    .k-var.up { color:#4ade80; } .k-var.down { color:#f87171; }

    .carte { background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:20px; margin-bottom:18px; }
    .duo { display:grid; grid-template-columns:repeat(auto-fit,minmax(340px,1fr)); gap:18px; }

    .chart { width:100%; height:260px; }
    .grid { stroke:#f1f3f5; stroke-width:1; }
    .ax { font-size:10px; fill:#9ca3af; }
    .aire { fill:rgba(233,196,106,.16); }
    .ligne { fill:none; stroke:#c9922f; stroke-width:2.5; stroke-linejoin:round; stroke-linecap:round; }
    .pt { fill:#fff; stroke:#c9922f; stroke-width:2; }

    .barres { display:flex; gap:8px; align-items:flex-end; overflow-x:auto; padding-top:8px; }
    .barre { flex:1; min-width:34px; display:flex; flex-direction:column; align-items:center; gap:5px; }
    .b-tube { width:100%; height:130px; background:#f3f4f6; border-radius:6px; display:flex; align-items:flex-end; overflow:hidden; }
    .b-fill { width:100%; background:#16a34a; border-radius:6px 6px 0 0; transition:height .4s; }
    .b-fill.moyen { background:#f59e0b; } .b-fill.bas { background:#dc2626; }
    .b-val { font-size:11px; font-weight:600; } .b-lab { font-size:10px; color:#9ca3af; }

    .mode { margin-bottom:14px; }
    .m-head { display:flex; justify-content:space-between; font-size:14px; margin-bottom:5px; }
    .m-tube { height:8px; background:#f3f4f6; border-radius:99px; overflow:hidden; }
    .m-fill { height:100%; background:#12291f; border-radius:99px; transition:width .4s; }
    .m-fill.or { background:#c9922f; }
    .m-sub { font-size:11px; color:#9ca3af; }

    .tbl { width:100%; border-collapse:collapse; font-size:14px; }
    .tbl th { text-align:left; padding:9px 6px; border-bottom:1px solid #e5e7eb; color:#6b7280; font-weight:500; font-size:12px; }
    .tbl td { padding:9px 6px; border-bottom:1px solid #f3f4f6; }
    .num { text-align:right; }
    .rouge { color:#dc2626; font-weight:600; }
    .slug { color:#9ca3af; font-size:12px; }
    .pill { padding:2px 9px; border-radius:99px; font-size:12px; background:#f3f4f6; }
    .pill.ok { background:#dcfce7; color:#166534; }
    .pill.moy { background:#fef3c7; color:#92400e; }
    .pill.ko { background:#fee2e2; color:#991b1b; }
    .muted { color:#9ca3af; text-align:center; padding:18px; }
    .muted-s { color:#9ca3af; font-size:12px; margin:-8px 0 14px; }
    .err { color:#b91c1c; background:#fee2e2; padding:10px 14px; border-radius:8px; }

    .upsell { text-align:center; background:#fff; border:1px solid #e5e7eb; border-radius:16px; padding:48px 24px; }
    .upsell-ic { font-size:40px; display:block; margin-bottom:10px; }
    .upsell h2 { margin:0 0 8px; }
    .upsell p { color:#6b7280; max-width:420px; margin:0 auto 20px; }
    .btn-upsell { display:inline-block; background:#12291f; color:#e9c46a; font-weight:600; padding:11px 22px;
                  border-radius:10px; text-decoration:none; font-size:14px; }
  `],
})
export class Statistiques implements OnInit {
  readonly W = 700; readonly H = 240; readonly PAD = 52;

  mois = 12;
  data = signal<any>(null);
  loading = signal(true);
  erreur = signal('');
  interdit = signal(false);

  constructor(private api: Api) {}

  money = (v: number) => fcfa(v);
  abs = (v: number) => Math.abs(v);

  async ngOnInit() { await this.charger(); }

  async charger() {
    this.loading.set(true); this.erreur.set(''); this.interdit.set(false);
    try {
      this.data.set(await this.api.get('/statistiques?mois=' + this.mois));
    } catch (e: any) {
      this.erreur.set(e?.error?.message || 'Chargement des statistiques impossible.');
      this.interdit.set(e?.status === 403);
    } finally {
      this.loading.set(false);
    }
  }

  private serie = computed<Point[]>(() => this.data()?.evolution ?? []);
  private maxi  = computed(() => Math.max(...this.serie().map(p => p.encaisse), 1));

  /** Points du graphique, convertis en coordonnees SVG. */
  pts = computed(() => {
    const s = this.serie(); const max = this.maxi();
    const large = this.W - this.PAD - 20;
    const haut  = this.H - 46;

    return s.map((p, i) => ({
      ...p,
      x: this.PAD + (s.length > 1 ? (i * large) / (s.length - 1) : large / 2),
      y: this.H - 30 - (p.encaisse / max) * haut,
    }));
  });

  lignePath = () => this.pts().map((p, i) => (i ? 'L' : 'M') + p.x + ' ' + p.y).join(' ');

  airePath = () => {
    const p = this.pts();
    if (!p.length) return '';
    return this.lignePath() + ` L${p[p.length - 1].x} ${this.H - 30} L${p[0].x} ${this.H - 30} Z`;
  };

  /** Lignes horizontales et leurs etiquettes. */
  grille = computed(() => {
    const max = this.maxi(); const haut = this.H - 46;
    return [0, 0.25, 0.5, 0.75, 1].map(f => ({
      y: this.H - 30 - f * haut,
      label: this.court(max * f),
    }));
  });

  private court(v: number): string {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace('.0', '') + 'M';
    if (v >= 1000) return Math.round(v / 1000) + 'k';
    return String(Math.round(v));
  }

  partImmeuble(revenu: number, liste: any[]): number {
    const max = Math.max(...liste.map(i => i.revenu), 1);
    return Math.round((revenu / max) * 100);
  }
}
