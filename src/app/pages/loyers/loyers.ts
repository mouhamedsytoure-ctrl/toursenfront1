import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api, fcfa } from '../../core/api.service';

@Component({
  selector: 'app-loyers',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1 class="ptitle">Loyers — {{ periode }}</h1>
    @if (loading()) { <p class="muted">Chargement...</p> }
    @else {
      <div class="chips">
        <button [class.on]="filtre()==='tous'" (click)="filtre.set('tous')">Tous</button>
        <button [class.on]="filtre()==='impayes'" (click)="filtre.set('impayes')">Non payés</button>
        <button [class.on]="filtre()==='payes'" (click)="filtre.set('payes')">Payés</button>
      </div>
      @for (r of view(); track r.id) {
        <div class="card row">
          <div class="rtop">
            <div class="info"><div class="nm">{{ r.name }}</div><div class="sub">{{ r.logement }} · {{ fcfa(r.loyer) }} FCFA</div></div>
            <span class="badge" [style.background]="r.paye ? '#E7F1EC':'#FBE3E0'" [style.color]="r.paye ? 'var(--ok)':'var(--bad)'">
              {{ r.paye ? 'Payé' : 'Non payé' }}
            </span>
          </div>

          @if (!r.paye && r.contratId) {
            @if (formOuvert() === r.id) {
              <div class="mini">
                <input class="input" type="number" [(ngModel)]="montantForm" placeholder="Montant (FCFA)" />
                <select class="input" [(ngModel)]="modeForm">
                  <option value="especes">Espèces</option>
                  <option value="wave">Wave</option>
                  <option value="orange_money">Orange Money</option>
                </select>
                <div class="mini-actions">
                  <button class="btn btn-gold" [disabled]="busy()" (click)="enregistrer(r)">Confirmer le paiement</button>
                  <button class="lien" (click)="formOuvert.set(null)">Annuler</button>
                </div>
              </div>
            } @else {
              <button class="btn btn-ink small" (click)="ouvrirForm(r)">Enregistrer le paiement</button>
            }
          }

          @if (r.paye && r.paiementId) {
            @if (r.recuEnvoye) {
              <div class="envoye">✓ Reçu envoyé{{ r.recuEnvoyeLabel ? ' le ' + r.recuEnvoyeLabel : '' }}</div>
            } @else {
              <button class="btn btn-ink small" [disabled]="busy()" (click)="envoyerRecu(r)">Envoyer le reçu par email</button>
            }
          }

          @if (erreur() === r.id) { <div class="err">{{ erreurMsg() }}</div> }
        </div>
      }
      @if (view().length === 0) { <p class="muted">Aucun élément.</p> }
    }
  `,
  styles: [`
    .ptitle{color:var(--ink);margin:0 0 14px}
    .muted{color:var(--muted)}
    .chips{display:flex;gap:8px;margin-bottom:14px}
    .chips button{border:1px solid var(--line);background:#fff;border-radius:99px;padding:7px 14px;cursor:pointer;color:var(--ink)}
    .chips button.on{background:var(--ink);color:#fff;border-color:var(--ink)}
    .row{margin-bottom:10px}
    .rtop{display:flex;justify-content:space-between;align-items:center}
    .nm{font-weight:600;color:var(--ink)}.sub{color:var(--muted);font-size:13px}
    .small{padding:7px 12px;font-size:13px;margin-top:10px}
    .mini{margin-top:10px;display:flex;flex-direction:column;gap:8px}
    .mini-actions{display:flex;align-items:center;gap:12px}
    .lien{background:none;border:none;color:var(--gold);font-weight:600;cursor:pointer}
    .envoye{margin-top:10px;color:var(--ok);font-size:13px;font-weight:600}
    .err{margin-top:8px;color:var(--bad);font-size:13px}
  `],
})
export class Loyers implements OnInit {
  rows = signal<any[]>([]);
  loading = signal(true);
  busy = signal(false);
  filtre = signal<'tous' | 'impayes' | 'payes'>('tous');
  periode = new Date().toISOString().slice(0, 7);
  fcfa = fcfa;

  formOuvert = signal<number | null>(null);
  montantForm = 0;
  modeForm: 'especes' | 'wave' | 'orange_money' = 'especes';
  erreur = signal<number | null>(null);
  erreurMsg = signal('');

  constructor(private api: Api) {}

  async ngOnInit() {
    await this.charger();
  }

  async charger() {
    this.loading.set(true);
    try {
      const [locs, pays]: any = await Promise.all([this.api.get('/locataires'), this.api.get('/paiements')]);
      // Un seul paiement par contrat et par periode (contrainte unique cote back).
      const paiementsDeLaPeriode = new Map<number, any>(
        (pays as any[])
          .filter(p => p.periode === this.periode)
          .map(p => [p.contrat_id, p])
      );
      const rows = (locs as any[]).map(l => {
        const c = (l.contrats || [])[0]; const lg = c?.logement; const im = lg?.immeuble;
        const paiement = c ? paiementsDeLaPeriode.get(c.id) : null;
        return {
          id: l.id, name: l.name, loyer: c?.montant_loyer || 0,
          logement: lg ? `${im?.nom || ''} - ${lg.reference || ''}` : '—',
          contratId: c?.id ?? null,
          paiementId: paiement?.id ?? null,
          paye: paiement?.statut === 'paye',
          recuEnvoye: !!paiement?.recu_envoye_at,
          recuEnvoyeLabel: paiement?.recu_envoye_at ? String(paiement.recu_envoye_at).slice(0, 10) : null,
        };
      }).filter(r => r.loyer > 0);
      this.rows.set(rows);
    } finally { this.loading.set(false); }
  }

  view() {
    const f = this.filtre();
    return this.rows().filter(r => f === 'tous' || (f === 'payes' ? r.paye : !r.paye));
  }

  ouvrirForm(r: any) {
    this.montantForm = r.loyer;
    this.modeForm = 'especes';
    this.erreur.set(null);
    this.formOuvert.set(r.id);
  }

  async enregistrer(r: any) {
    this.busy.set(true);
    this.erreur.set(null);
    try {
      await this.api.post('/paiements', {
        contrat_id: r.contratId,
        periode: this.periode,
        montant: this.montantForm,
        mode_paiement: this.modeForm,
        statut: 'paye',
      });
      this.formOuvert.set(null);
      await this.charger();
    } catch (e: any) {
      this.erreur.set(r.id);
      this.erreurMsg.set(e?.error?.message || "Impossible d'enregistrer ce paiement.");
    } finally {
      this.busy.set(false);
    }
  }

  async envoyerRecu(r: any) {
    this.busy.set(true);
    this.erreur.set(null);
    try {
      await this.api.post(`/paiements/${r.paiementId}/envoyer-recu`, {});
      await this.charger();
    } catch (e: any) {
      this.erreur.set(r.id);
      this.erreurMsg.set(e?.error?.message || "Impossible d'envoyer le reçu.");
    } finally {
      this.busy.set(false);
    }
  }
}
