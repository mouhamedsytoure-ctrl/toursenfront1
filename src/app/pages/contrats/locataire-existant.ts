import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Api } from '../../core/api.service';

@Component({
  selector: 'app-locataire-existant',
  standalone: true,
  imports: [FormsModule],
  template: `
    <a (click)="back()" class="back">← Locataires</a>
    <h1 class="ptitle">Locataire déjà en place</h1>
    <p class="hint">Pour quelqu'un qui loue déjà chez SITS avant l'application — juste de quoi lui créer un espace et retrouver son loyer. Pas de contrat PDF généré, pas de mail « bienvenue, nouveau contrat ».</p>

    <div class="card">
      <h3>Logement</h3>
      <select class="input" [(ngModel)]="immeubleId" (ngModelChange)="onImmeuble($event)">
        <option [ngValue]="null">— Choisir un immeuble —</option>
        @for (im of immeubles(); track im.id) { <option [ngValue]="im.id">{{ im.nom }}</option> }
      </select>
      @if (immeubleId) {
        <select class="input" [(ngModel)]="etage" (ngModelChange)="chambre=null">
          <option [ngValue]="null">— Étage —</option>
          @for (e of etages(); track e) { <option [ngValue]="e">{{ etageLabel(e) }}</option> }
        </select>
      }
      @if (etage !== null) {
        <select class="input" [(ngModel)]="chambre" (ngModelChange)="onChambre($event)">
          <option [ngValue]="null">— Logement —</option>
          @for (l of logementsOf(); track l.id) { <option [ngValue]="l">{{ l.reference }} - {{ l.type }} ({{ l.statut }})</option> }
        </select>
        <p class="hint">Tous les logements de l'étage sont listés, même ceux déjà marqués « loué ».</p>
      }
    </div>

    <div class="card">
      <h3>Locataire</h3>
      <label class="flabel">Nom <span class="req">*</span></label>
      <input class="input" [class.inp-err]="submitted&&!f.preneur_nom" placeholder="Nom" [(ngModel)]="f.preneur_nom"/>
      <label class="flabel">Prénom</label>
      <input class="input" placeholder="Prénom" [(ngModel)]="f.preneur_prenom"/>
      <label class="flabel">Email de contact <span class="req">*</span></label>
      <input class="input" [class.inp-err]="submitted&&!f.preneur_email" placeholder="email@exemple.com" [(ngModel)]="f.preneur_email"/>
      <p class="hint">C'est ici qu'il recevra ses identifiants et, plus tard, ses reçus.</p>
    </div>

    <div class="card">
      <h3>Location</h3>
      <label class="flabel">Date de début du bail <span class="req">*</span></label>
      <input class="input" [class.inp-err]="submitted&&!f.date_debut" type="date" [(ngModel)]="f.date_debut"/>
      <label class="flabel">Date de fin du bail <span class="req">*</span></label>
      <input class="input" [class.inp-err]="submitted&&!f.date_fin" type="date" [(ngModel)]="f.date_fin"/>
      <label class="flabel">Loyer (FCFA) <span class="req">*</span></label>
      <input class="input" [class.inp-err]="submitted&&!f.montant_loyer" type="number" placeholder="ex: 150000" [(ngModel)]="f.montant_loyer"/>
      <label class="flabel">Jour d'échéance</label>
      <input class="input" type="number" placeholder="5 par défaut" [(ngModel)]="f.jour_echeance"/>
    </div>

    @if (error()) { <div class="err">{{ error() }}</div> }
    @if (emailConnexion()) {
      <div class="ok">
        Compte créé.
        @if (emailEnvoye()) {
          Un email va être envoyé à {{ f.preneur_email }} (sous quelques minutes).
        } @else {
          <b>⚠ L'email n'a pas pu être mis en attente d'envoi</b> (à communiquer vous-même pour l'instant).
        }
        <br/>
        Identifiant de connexion : <b>{{ emailConnexion() }}</b><br/>
        Mot de passe : <b>{{ motDePasse() }}</b>
      </div>
      <button class="btn btn-ink full" (click)="continuer()">Continuer</button>
    } @else {
      <button class="btn btn-ink full" [disabled]="saving()" (click)="save()">
        {{ saving() ? 'Création...' : 'Créer' }}
      </button>
    }
  `,
  styles: [`
    .back{color:var(--ink);text-decoration:none;font-weight:600;cursor:pointer;display:inline-block;margin-bottom:8px}
    .ptitle{color:var(--ink);margin:6px 0 6px}
    .hint{color:var(--muted);font-size:12px;margin:0 0 14px}
    .card{margin-bottom:14px}
    h3{color:var(--ink);margin:0 0 10px;font-size:15px}
    .input{margin-bottom:10px}
    .full{width:100%;margin-top:6px}
    .err{color:var(--bad);margin:10px 0}
    .ok{color:var(--ok);margin:10px 0;background:#E7F1EC;padding:10px;border-radius:10px}
    .flabel{display:block;font-size:12px;color:var(--muted);font-weight:600;margin:8px 0 4px}
    .req{color:var(--bad)}
    .inp-err{border-color:var(--bad)!important;background:#fff8f8}
  `],
})
export class LocataireExistant implements OnInit {
  immeubles = signal<any[]>([]);
  logements = signal<any[]>([]);
  immeubleId: number | null = null;
  etage: number | null = null;
  chambre: any = null;
  saving = signal(false);
  error = signal<string | null>(null);
  motDePasse = signal<string | null>(null);
  emailConnexion = signal<string | null>(null);
  emailEnvoye = signal(true);
  contratCreeId: number | null = null;
  submitted = false;

  f: any = {
    preneur_nom: '', preneur_prenom: '', preneur_email: '',
    date_debut: '', date_fin: '', montant_loyer: null, jour_echeance: 5,
  };

  constructor(private api: Api, private router: Router) {}
  async ngOnInit() { this.immeubles.set(await this.api.get('/immeubles')); }
  back() { this.router.navigate(['/app/locataires']); }

  async onImmeuble(id: number | null) {
    this.etage = null; this.chambre = null; this.logements.set([]);
    if (id) this.logements.set(await this.api.get('/logements?immeuble_id=' + id));
  }
  etages(): number[] { const s = new Set<number>(); this.logements().forEach(l => s.add(l.etage ?? 0)); return [...s].sort((a, b) => a - b); }
  logementsOf(): any[] { return this.logements().filter(l => (l.etage ?? 0) === this.etage); }
  etageLabel(e: number) { return e === 0 ? 'Rez-de-chaussée' : (e === 1 ? '1er étage' : e + 'e étage'); }
  onChambre(l: any) {
    if (l && !this.f.montant_loyer) this.f.montant_loyer = Math.round(l.loyer);
  }

  async save() {
    this.submitted = true;
    this.error.set(null);
    if (!this.chambre) { this.error.set('Choisissez un logement.'); return; }
    const manquants = [];
    if (!this.f.preneur_nom) manquants.push('Nom');
    if (!this.f.preneur_email) manquants.push('Email');
    if (!this.f.date_debut) manquants.push('Date de début');
    if (!this.f.date_fin) manquants.push('Date de fin');
    if (!this.f.montant_loyer) manquants.push('Loyer');
    if (manquants.length > 0) { this.error.set('Champs obligatoires manquants : ' + manquants.join(', ')); return; }

    this.saving.set(true);
    try {
      const body = { ...this.f, logement_id: this.chambre.id };
      const res: any = await this.api.post('/contrats/deja-present', body);
      this.contratCreeId = res.contrat.id;
      this.motDePasse.set(res.mot_de_passe);
      this.emailEnvoye.set(res?.email_envoye !== false);
      this.emailConnexion.set(res?.email_connexion || null);
    } catch (e: any) {
      this.error.set(e?.error?.message || e?.error?.errors?.preneur_email?.[0] || 'Erreur lors de la création.');
    } finally { this.saving.set(false); }
  }

  continuer() {
    if (this.contratCreeId) { this.router.navigate(['/app/contrats', this.contratCreeId]); }
  }
}
