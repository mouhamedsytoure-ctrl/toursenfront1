import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Api } from '../../core/api.service';

@Component({
  selector: 'app-nouveau-contrat',
  standalone: true,
  imports: [FormsModule],
  template: `
    <a (click)="back()" class="back">← Contrats</a>
    <h1 class="ptitle">Nouveau contrat / locataire</h1>

    <div class="card">
      <h3>1. Logement</h3>
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
          <option [ngValue]="null">— Chambre disponible —</option>
          @for (l of chambresOf(); track l.id) { <option [ngValue]="l">{{ l.reference }} - {{ l.type }} ({{ l.loyer }} FCFA)</option> }
        </select>
      }
    </div>

    <div class="card">
      <h3>2. Identité du preneur</h3>
      <p class="hint">Seuls Nom, Email de contact, Loyer et les dates sont obligatoires — le reste est utile pour le contrat mais peut être laissé vide et complété plus tard (pratique pour ressaisir vite un locataire déjà en place).</p>
      <label class="flabel">Civilité</label>
      <select class="input" [(ngModel)]="f.preneur_civilite">
        <option value="">— Choisir —</option>
        <option value="Monsieur">Monsieur</option>
        <option value="Madame">Madame</option>
        <option value="Mademoiselle">Mademoiselle</option>
      </select>
      <label class="flabel">Nom <span class="req">*</span></label>
      <input class="input" [class.inp-err]="submitted&&!f.preneur_nom" placeholder="Nom du locataire" [(ngModel)]="f.preneur_nom"/>
      <label class="flabel">Prénom</label>
      <input class="input" placeholder="Prénom" [(ngModel)]="f.preneur_prenom"/>
      <label class="flabel">Téléphone</label>
      <input class="input" placeholder="77 000 00 00" [(ngModel)]="f.preneur_telephone"/>
      <label class="flabel">Email de contact <span class="req">*</span></label>
      <input class="input" [class.inp-err]="submitted&&!f.preneur_email" placeholder="email@exemple.com" [(ngModel)]="f.preneur_email"/>
      <p class="hint">C'est ici que le locataire recevra ses messages (bienvenue, reçus...). Son identifiant de connexion à l'application sera généré automatiquement.</p>
      <label class="flabel">Adresse</label>
      <input class="input" placeholder="Adresse actuelle" [(ngModel)]="f.preneur_adresse"/>
      <label class="flabel">Profession</label>
      <input class="input" placeholder="Profession" [(ngModel)]="f.preneur_profession"/>
      <label class="flabel">Nationalité</label>
      <input class="input" placeholder="Nationalité" [(ngModel)]="f.preneur_nationalite"/>
      <label class="flabel">Lieu de naissance</label>
      <input class="input" placeholder="Lieu de naissance" [(ngModel)]="f.preneur_lieu_naissance"/>
      <label class="flabel">Date de naissance</label>
      <div class="row3">
        <select class="input" [(ngModel)]="dnJour">
          <option value="">Jour</option>
          @for (j of jours; track j) { <option [value]="j">{{ j }}</option> }
        </select>
        <select class="input" [(ngModel)]="dnMois">
          <option value="">Mois</option>
          @for (m of mois; track m.v) { <option [value]="m.v">{{ m.l }}</option> }
        </select>
        <select class="input" [(ngModel)]="dnAnnee">
          <option value="">Année</option>
          @for (a of annees; track a) { <option [value]="a">{{ a }}</option> }
        </select>
      </div>
    </div>

    <div class="card">
      <h3>3. Pièce d'identité</h3>
      <label class="flabel">Type de pièce</label>
      <select class="input" [(ngModel)]="f.preneur_piece_type">
        <option value="cni">CNI</option>
        <option value="passeport">Passeport</option>
        <option value="permis">Permis</option>
        <option value="autre">Autre</option>
      </select>
      <label class="flabel">Numéro de pièce</label>
      <input class="input" placeholder="Numéro de pièce" [(ngModel)]="f.preneur_piece_numero"/>
    </div>

    <div class="card">
      <h3>4. Contrat</h3>
      <label class="flabel">Composition</label>
      <input class="input" placeholder="ex: 01 Séjour, 01 Chambre..." [(ngModel)]="f.composition"/>
      <label class="flabel">Usage <span class="req">*</span></label>
      <select class="input" [(ngModel)]="f.usage">
        <option value="domestique">Usage domestique</option>
        <option value="commercial">Usage commercial</option>
      </select>
      <label class="flabel">Date de début <span class="req">*</span></label>
      <input class="input" [class.inp-err]="submitted&&!f.date_debut" type="date" [(ngModel)]="f.date_debut"/>
      <label class="flabel">Date de fin <span class="req">*</span></label>
      <input class="input" [class.inp-err]="submitted&&!f.date_fin" type="date" [(ngModel)]="f.date_fin"/>
      <label class="flabel">Loyer (FCFA) <span class="req">*</span></label>
      <input class="input" [class.inp-err]="submitted&&!f.montant_loyer" type="number" placeholder="ex: 150000" [(ngModel)]="f.montant_loyer" (ngModelChange)="onLoyerChange($event)"/>
      <label class="flabel">Caution — nombre de mois de loyer</label>
      <select class="input" [(ngModel)]="moisCaution" (ngModelChange)="onLoyerChange(f.montant_loyer)">
        <option [ngValue]="1">1 mois</option>
        <option [ngValue]="2">2 mois</option>
        <option [ngValue]="3">3 mois</option>
        <option [ngValue]="4">4 mois</option>
        <option [ngValue]="null">Personnalisé (saisie libre)</option>
      </select>
      <label class="flabel">Caution (FCFA) <span class="req">*</span></label>
      <input class="input" [class.inp-err]="submitted&&!f.caution" type="number" placeholder="ex: 300000" [(ngModel)]="f.caution" [disabled]="moisCaution !== null"/>
      <p class="hint">@if (moisCaution !== null) { Calculée automatiquement ({{ moisCaution }} mois de loyer). } @else { Saisie libre — modifiez le montant directement. }</p>
      <label class="flabel">Jour d'échéance <span class="req">*</span></label>
      <input class="input" [class.inp-err]="submitted&&!f.jour_echeance" type="number" placeholder="1 à 31" [(ngModel)]="f.jour_echeance"/>
      <label class="flabel">Mot de passe (laisser vide = généré automatiquement)</label>
      <input class="input" placeholder="Optionnel" [(ngModel)]="f.password"/>
    </div>

    @if (error()) { <div class="err">{{ error() }}</div> }
    @if (emailConnexion()) {
      <div class="ok">
        Compte créé.
        @if (emailEnvoye()) {
          Un email de bienvenue va être envoyé à {{ f.preneur_email }} (sous quelques minutes).
        } @else {
          <b>⚠ L'email de bienvenue n'a pas pu être mis en attente d'envoi</b> (à communiquer vous-même pour l'instant).
        }
        <br/>
        Identifiant de connexion : <b>{{ emailConnexion() }}</b><br/>
        @if (motDePasse()) { Mot de passe : <b>{{ motDePasse() }}</b> }
      </div>
      <button class="btn btn-ink full" (click)="continuer()">Continuer</button>
    } @else {
      <button class="btn btn-ink full" [disabled]="saving()" (click)="save()">
        {{ saving() ? 'Création...' : 'Créer le contrat' }}
      </button>
    }
    <p class="note">Une fois créé, le contrat est figé (non modifiable).</p>
  `,
  styles: [`
    .back{color:var(--ink);text-decoration:none;font-weight:600;cursor:pointer;display:inline-block;margin-bottom:8px}
    .ptitle{color:var(--ink);margin:6px 0 16px}
    .card{margin-bottom:14px}
    h3{color:var(--ink);margin:0 0 10px;font-size:15px}
    .input{margin-bottom:10px}
    label{display:block;font-size:12px;color:var(--muted);margin:2px 0 4px}
    .full{width:100%;margin-top:6px}
    .err{color:var(--bad);margin:10px 0}
    .ok{color:var(--ok);margin:10px 0;background:#E7F1EC;padding:10px;border-radius:10px}
    .note{color:var(--muted);font-size:12px;text-align:center;margin-top:8px}
    .hint{color:var(--muted);font-size:12px;margin:-6px 0 10px}
    .row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
    .flabel{display:block;font-size:12px;color:var(--muted);font-weight:600;margin:8px 0 4px}
    .req{color:var(--bad)}
    .inp-err{border-color:var(--bad)!important;background:#fff8f8}
  `],
})
export class NouveauContrat implements OnInit {
  immeubles = signal<any[]>([]);
  dispo = signal<any[]>([]);
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

  dnJour = ''; dnMois = ''; dnAnnee = '';
  jours = Array.from({length: 31}, (_, i) => String(i + 1).padStart(2, '0'));
  mois = [
    {v:'01',l:'Janvier'},{v:'02',l:'Février'},{v:'03',l:'Mars'},{v:'04',l:'Avril'},
    {v:'05',l:'Mai'},{v:'06',l:'Juin'},{v:'07',l:'Juillet'},{v:'08',l:'Août'},
    {v:'09',l:'Septembre'},{v:'10',l:'Octobre'},{v:'11',l:'Novembre'},{v:'12',l:'Décembre'}
  ];
  annees = Array.from({length: new Date().getFullYear() - 1919}, (_, i) => new Date().getFullYear() - 18 - i);

  f: any = {
    preneur_civilite: '', preneur_nom: '', preneur_prenom: '', preneur_telephone: '',
    preneur_email: '', preneur_adresse: '', preneur_profession: '', preneur_nationalite: 'Senegalaise',
    preneur_lieu_naissance: '', preneur_date_naissance: '',
    preneur_piece_type: 'cni', preneur_piece_numero: '',
    composition: '', usage: 'domestique',
    date_debut: '', date_fin: '', montant_loyer: null, caution: null, jour_echeance: 5, password: '',
  };
  moisCaution: number | null = 3;

  constructor(private api: Api, private router: Router) {}
  async ngOnInit() { this.immeubles.set(await this.api.get('/immeubles')); }
  back() { this.router.navigate(['/app/contrats']); }

  async onImmeuble(id: number | null) {
    this.etage = null; this.chambre = null; this.dispo.set([]);
    if (id) this.dispo.set(await this.api.get('/logements?immeuble_id=' + id + '&statut=disponible'));
  }
  etages(): number[] { const s = new Set<number>(); this.dispo().forEach(l => s.add(l.etage ?? 0)); return [...s].sort((a, b) => a - b); }
  chambresOf(): any[] { return this.dispo().filter(l => (l.etage ?? 0) === this.etage); }
  etageLabel(e: number) { return e === 0 ? 'Rez-de-chaussée' : (e === 1 ? '1er étage' : e + 'e étage'); }
  onChambre(l: any) {
    if (!l) return;
    if (!this.f.montant_loyer) this.f.montant_loyer = Math.round(l.loyer);
    this.onLoyerChange(this.f.montant_loyer);
  }
  onLoyerChange(loyer: number | null) {
    if (loyer && this.moisCaution !== null) this.f.caution = Math.round(loyer * this.moisCaution);
  }

  async save() {
    this.submitted = true;
    this.error.set(null);
    if (!this.chambre) { this.error.set('Choisissez un logement.'); return; }
    // le reste (civilite, telephone, adresse...) est optionnel, meme regle que le serveur
    const manquants = [];
    if (!this.f.preneur_nom) manquants.push('Nom');
    if (!this.f.preneur_email) manquants.push('Email');
    if (!this.f.date_debut) manquants.push('Date de début');
    if (!this.f.date_fin) manquants.push('Date de fin');
    if (!this.f.montant_loyer) manquants.push('Loyer');
    if (!this.f.date_fin) manquants.push('Date de fin');
    if (!this.f.montant_loyer) manquants.push('Loyer');
    if (!this.f.caution) manquants.push('Caution');
    if (!this.f.jour_echeance) manquants.push("Jour d'échéance");
    if (manquants.length > 0) { this.error.set('Champs obligatoires manquants : ' + manquants.join(', ')); return; }
    if (this.dnJour && this.dnMois && this.dnAnnee) {
      this.f.preneur_date_naissance = `${this.dnAnnee}-${this.dnMois}-${this.dnJour}`;
    } else {
      this.f.preneur_date_naissance = '';
    }
    this.saving.set(true);
    try {
      const body = { ...this.f, logement_id: this.chambre.id };
      Object.keys(body).forEach(k => { if (body[k] === '' || body[k] === null) delete body[k]; });
      const res: any = await this.api.post('/contrats', body);
      this.contratCreeId = res.contrat.id;
      if (res?.mot_de_passe) { this.motDePasse.set(res.mot_de_passe); }
      this.emailEnvoye.set(res?.email_envoye !== false);
      this.emailConnexion.set(res?.email_connexion || null);
      if (!res?.email_connexion) { this.router.navigate(['/app/contrats', res.contrat.id]); }
    } catch (e: any) {
      this.error.set(e?.error?.message || e?.error?.errors?.preneur_email?.[0] || 'Erreur lors de la création.');
    } finally { this.saving.set(false); }
  }

  continuer() {
    if (this.contratCreeId) { this.router.navigate(['/app/contrats', this.contratCreeId]); }
  }
}
