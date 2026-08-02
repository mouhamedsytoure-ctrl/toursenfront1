import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';

type FormAgence = {
  nom: string; telephone: string; whatsapp: string; email: string;
  adresse: string; ville: string; logo: string;
  representant_legal: string; representant_fonction: string; ninea: string; rccm: string;
};

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [FormsModule],
  template: `
  <div class="pm">
    <header class="pm-top">
      <h1>Parametres de l'agence</h1>
      <p class="sub">Ces informations apparaissent sur votre vitrine publique et vos documents (baux, quittances).</p>
    </header>

    @if (loading()) { <p class="muted">Chargement…</p> }
    @else {
      <div class="carte">
        <h2>Identite</h2>
        <div class="grille">
          <div>
            <label>Nom de l'agence</label>
            <input class="input" [(ngModel)]="f.nom"/>
          </div>
          <div>
            <label>Logo (URL de l'image)</label>
            <input class="input" [(ngModel)]="f.logo" placeholder="https://..."/>
          </div>
        </div>
      </div>

      <div class="carte">
        <h2>Contact</h2>
        <p class="aide-carte">Ces deux numeros sont ceux affiches sur votre vitrine publique, pour chaque logement.</p>
        <div class="grille">
          <div>
            <label>📞 Telephone</label>
            <input class="input" [(ngModel)]="f.telephone" placeholder="77 000 00 00"/>
          </div>
          <div>
            <label>💬 WhatsApp</label>
            <input class="input" [(ngModel)]="f.whatsapp" placeholder="Laisser vide = meme que le telephone"/>
          </div>
          <div>
            <label>Email</label>
            <input class="input" type="email" [(ngModel)]="f.email"/>
          </div>
          <div>
            <label>Ville</label>
            <input class="input" [(ngModel)]="f.ville"/>
          </div>
          <div class="large">
            <label>Adresse</label>
            <input class="input" [(ngModel)]="f.adresse"/>
          </div>
        </div>
      </div>

      <div class="carte">
        <h2>Identite legale <span class="opt">(optionnel, utilise sur les baux)</span></h2>
        <div class="grille">
          <div>
            <label>Representant legal</label>
            <input class="input" [(ngModel)]="f.representant_legal" placeholder="Nom du gerant"/>
          </div>
          <div>
            <label>Fonction</label>
            <input class="input" [(ngModel)]="f.representant_fonction" placeholder="Gerant"/>
          </div>
          <div>
            <label>NINEA</label>
            <input class="input" [(ngModel)]="f.ninea"/>
          </div>
          <div>
            <label>RCCM</label>
            <input class="input" [(ngModel)]="f.rccm"/>
          </div>
        </div>
      </div>

      @if (erreur()) { <p class="err">{{ erreur() }}</p> }
      @if (succes()) { <p class="ok">Enregistre.</p> }

      <button class="btn btn-ink" [disabled]="saving()" (click)="enregistrer()">
        {{ saving() ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
    }
  </div>
  `,
  styles: [`
    .pm { max-width: 780px; }
    .pm-top { margin-bottom: 22px; }
    h1 { margin: 0; font-size: 26px; }
    .sub { color: #6b7280; margin: 6px 0 0; }
    .carte { background:#fff; border:1px solid #e5e7eb; border-radius:14px; padding:22px; margin-bottom:18px; }
    .carte h2 { margin: 0 0 4px; font-size: 16px; }
    .opt { font-weight: 400; font-size: 12px; color: #9ca3af; }
    .aide-carte { color:#9ca3af; font-size:12.5px; margin: 0 0 14px; }
    .grille { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:14px; margin-top: 14px; }
    .large { grid-column: 1 / -1; }
    label { display:block; font-size:13px; color:var(--muted); margin:0 0 6px; font-weight:600; }
    .muted { color:#9ca3af; padding: 20px 0; }
    .err { color:#b91c1c; background:#fee2e2; padding:10px 14px; border-radius:8px; }
    .ok { color:#166534; background:#dcfce7; padding:10px 14px; border-radius:8px; }
  `],
})
export class Parametres implements OnInit {
  loading = signal(true);
  saving = signal(false);
  erreur = signal('');
  succes = signal(false);

  f: FormAgence = {
    nom: '', telephone: '', whatsapp: '', email: '', adresse: '', ville: '', logo: '',
    representant_legal: '', representant_fonction: '', ninea: '', rccm: '',
  };

  constructor(private api: Api, private auth: AuthService) {}

  async ngOnInit() {
    try {
      const a: any = await this.api.get('/agence');
      this.f = {
        nom: a.nom ?? '', telephone: a.telephone ?? '', whatsapp: a.whatsapp ?? '',
        email: a.email ?? '', adresse: a.adresse ?? '', ville: a.ville ?? '', logo: a.logo ?? '',
        representant_legal: a.representant_legal ?? '', representant_fonction: a.representant_fonction ?? '',
        ninea: a.ninea ?? '', rccm: a.rccm ?? '',
      };
    } catch (e: any) {
      this.erreur.set(e?.error?.message || 'Chargement impossible.');
    } finally {
      this.loading.set(false);
    }
  }

  async enregistrer() {
    this.saving.set(true); this.erreur.set(''); this.succes.set(false);
    try {
      await this.api.put('/agence', this.f);
      await this.auth.rafraichirAgence();
      this.succes.set(true);
    } catch (e: any) {
      this.erreur.set(e?.error?.message || 'Enregistrement impossible.');
    } finally {
      this.saving.set(false);
    }
  }
}
