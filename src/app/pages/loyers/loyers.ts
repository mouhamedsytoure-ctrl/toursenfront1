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
      <input class="input search" placeholder="Rechercher un locataire..." [(ngModel)]="q" />
      <div class="chips">
        <button [class.on]="filtre()==='tous'" (click)="filtre.set('tous')">Tous</button>
        <button [class.on]="filtre()==='impayes'" (click)="filtre.set('impayes')">Non payés</button>
        <button [class.on]="filtre()==='payes'" (click)="filtre.set('payes')">Payés</button>
      </div>
      @for (r of view(); track r.id) {
        <div class="card row">
          <div class="rtop">
            <div class="info"><div class="nm">{{ r.name }}</div><div class="sub">{{ r.logement }} · {{ fcfa(r.loyer) }} FCFA</div></div>
            <span class="badge" [style.background]="r.paye ? '#E7F1EC' : (r.premierMois ? '#FBF3E6' : '#FBE3E0')" [style.color]="r.paye ? 'var(--ok)' : (r.premierMois ? 'var(--gold)' : 'var(--bad)')">
              {{ r.paye ? 'Payé' : (r.premierMois ? 'Mois d\'entrée' : 'Non payé') }}
            </span>
          </div>

          @if (r.premierMois && !r.paye) { <div class="info-mois">Couvert par la caution versée à la signature — vous pouvez quand même enregistrer un paiement ci-dessous si besoin.</div> }
          @if (r.annuleMotif) { <div class="annule">↺ Dernier paiement annulé : « {{ r.annuleMotif }} »</div> }

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
                  <button class="btn btn-gold" [disabled]="busy()" (click)="confirmer(r)">Confirmer le paiement</button>
                  <button class="lien" (click)="formOuvert.set(null)">Annuler</button>
                </div>
              </div>
            } @else {
              <button class="btn btn-ink small" (click)="ouvrirForm(r)">Confirmer le paiement</button>
            }
          }

          @if (r.paye && r.paiementId) {
            <div class="apres">
              <span class="envoye">{{ r.recuEnvoye ? '✓ Reçu envoyé par email' : '⚠ Reçu non envoyé (pas d\\'email de contact)' }}</span>
              @if (r.recuEnvoye) { <button class="lien" [disabled]="busy()" (click)="renvoyerRecu(r)">Renvoyer</button> }
              @if (annulationOuverte() === r.id) {
                <div class="mini">
                  <textarea class="input" rows="2" placeholder="Motif de l'annulation (obligatoire)" [(ngModel)]="motifAnnulation"></textarea>
                  <div class="mini-actions">
                    <button class="btn btn-ink" [disabled]="busy()" (click)="confirmerAnnulation(r)">Confirmer l'annulation</button>
                    <button class="lien" (click)="annulationOuverte.set(null)">Fermer</button>
                  </div>
                </div>
              } @else {
                <button class="lien danger" (click)="ouvrirAnnulation(r)">Annuler ce paiement</button>
              }
            </div>
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
    .search{margin-bottom:12px;max-width:420px}
    .chips{display:flex;gap:8px;margin-bottom:14px}
    .chips button{border:1px solid var(--line);background:#fff;border-radius:99px;padding:7px 14px;cursor:pointer;color:var(--ink)}
    .chips button.on{background:var(--ink);color:#fff;border-color:var(--ink)}
    .row{margin-bottom:10px}
    .rtop{display:flex;justify-content:space-between;align-items:center}
    .nm{font-weight:600;color:var(--ink)}.sub{color:var(--muted);font-size:13px}
    .small{padding:7px 12px;font-size:13px;margin-top:10px}
    .mini{margin-top:10px;display:flex;flex-direction:column;gap:8px}
    .mini-actions{display:flex;align-items:center;gap:12px}
    .lien{background:none;border:none;color:var(--gold);font-weight:600;cursor:pointer;font-size:13px}
    .lien.danger{color:var(--bad)}
    .envoye{font-size:12px;color:var(--muted)}
    .apres{margin-top:10px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
    .annule{margin-top:8px;color:var(--bad);font-size:12px;font-style:italic}
    .info-mois{margin-top:8px;color:var(--muted);font-size:12px;font-style:italic}
    .err{margin-top:8px;color:var(--bad);font-size:13px}
    textarea.input{resize:vertical}
  `],
})
export class Loyers implements OnInit {
  rows = signal<any[]>([]);
  loading = signal(true);
  busy = signal(false);
  filtre = signal<'tous' | 'impayes' | 'payes'>('tous');
  periode = new Date().toISOString().slice(0, 7);
  fcfa = fcfa;
  q = '';

  formOuvert = signal<number | null>(null);
  montantForm = 0;
  modeForm: 'especes' | 'wave' | 'orange_money' = 'especes';

  annulationOuverte = signal<number | null>(null);
  motifAnnulation = '';

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
        // Le mois d'entree est deja couvert par la caution versee a la
        // signature : jamais signale comme impaye.
        const premierMois = !!c?.date_debut && String(c.date_debut).slice(0, 7) === this.periode;
        return {
          id: l.id, name: l.name, loyer: c?.montant_loyer || 0,
          logement: lg ? `${im?.nom || ''} - ${lg.reference || ''}` : '—',
          contratId: c?.id ?? null,
          paiementId: paiement?.id ?? null,
          // Statut reel : seul un vrai paiement confirme compte comme "Paye".
          // Le mois d'entree n'affiche plus d'alerte, mais n'empeche plus
          // d'enregistrer un paiement si vous le souhaitez (utile pour tester,
          // ou si l'agence veut quand meme tracer ce premier versement).
          paye: paiement?.statut === 'paye',
          premierMois,
          recuEnvoye: !!paiement?.recu_envoye_at,
          annuleMotif: paiement?.statut === 'annule' ? paiement.motif_annulation : null,
        };
      }).filter(r => r.loyer > 0);
      this.rows.set(rows);
    } finally { this.loading.set(false); }
  }

  view() {
    const f = this.filtre();
    const q = this.q.toLowerCase().trim();
    return this.rows()
      .filter(r => f === 'tous' || (f === 'payes' ? r.paye : !r.paye))
      .filter(r => !q || r.name.toLowerCase().includes(q));
  }

  ouvrirForm(r: any) {
    this.montantForm = r.loyer;
    this.modeForm = 'especes';
    this.erreur.set(null);
    this.formOuvert.set(r.id);
  }

  async confirmer(r: any) {
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

  async renvoyerRecu(r: any) {
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

  ouvrirAnnulation(r: any) {
    this.motifAnnulation = '';
    this.erreur.set(null);
    this.annulationOuverte.set(r.id);
  }

  async confirmerAnnulation(r: any) {
    if (this.motifAnnulation.trim().length < 5) {
      this.erreur.set(r.id);
      this.erreurMsg.set('Merci de préciser le motif (au moins 5 caractères).');
      return;
    }
    this.busy.set(true);
    this.erreur.set(null);
    try {
      await this.api.post(`/paiements/${r.paiementId}/annuler`, { motif: this.motifAnnulation.trim() });
      this.annulationOuverte.set(null);
      await this.charger();
    } catch (e: any) {
      this.erreur.set(r.id);
      this.erreurMsg.set(e?.error?.message || "Impossible d'annuler ce paiement.");
    } finally {
      this.busy.set(false);
    }
  }
}
