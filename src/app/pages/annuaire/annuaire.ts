import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Api, fcfa } from '../../core/api.service';

@Component({
  selector: 'app-annuaire',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <nav class="nav">
      <a class="brand" routerLink="/accueil">← Sunnu Immo</a>
      <a class="nav-btn" routerLink="/login">Mon espace →</a>
    </nav>

    <header class="tete">
      <h1>Tous les logements disponibles</h1>
      <p>Parcourez les biens de toutes les agences partenaires, en un seul endroit.</p>
    </header>

    <div class="filtres">
      <input class="fi" type="text" [(ngModel)]="ville" placeholder="Ville / zone (ex: Dakar)" (keyup.enter)="rechercher()"/>
      <input class="fi num" type="number" min="0" [(ngModel)]="prixMin" placeholder="Prix min" (keyup.enter)="rechercher()"/>
      <input class="fi num" type="number" min="0" [(ngModel)]="prixMax" placeholder="Prix max" (keyup.enter)="rechercher()"/>
      <button class="btn-gold" (click)="rechercher()">Filtrer</button>
      @if (ville || prixMin || prixMax) {
        <button class="btn-ghost" (click)="reinitialiser()">Réinitialiser</button>
      }
    </div>

    @if (loading()) {
      <div class="grid">
        @for (s of [1,2,3,4,5,6]; track s) { <div class="skeleton"></div> }
      </div>
    } @else if (erreur()) {
      <p class="vide">{{ erreur() }}</p>
    } @else if (items().length === 0) {
      <p class="vide">Aucun logement ne correspond à votre recherche.</p>
    } @else {
      <div class="grid">
        @for (im of items(); track im.id) {
          <a class="card" [routerLink]="['/vitrine', im.agence.slug, im.id]">
            <div class="card-img">
              @if (cover(im); as c) { <img [src]="c" alt="{{ im.nom }}"/> } @else { <div class="noimg">🏢</div> }
              <div class="ov"></div>
              @if (im.mis_en_avant) { <span class="vedette">✨ En vedette</span> }
              <span class="badge" [class.dispo]="(im.disponibles_count||0)>0" [class.full]="(im.disponibles_count||0)===0">
                {{ (im.disponibles_count||0) > 0 ? im.disponibles_count + ' dispo' : 'Complet' }}
              </span>
            </div>
            <div class="body">
              <h3>{{ im.nom }}</h3>
              <p class="loc">📍 {{ im.ville || '—' }}</p>
              <div class="agence">
                @if (im.agence.logo) { <img [src]="im.agence.logo" alt=""/> }
                <span>{{ im.agence.nom }}</span>
              </div>
            </div>
          </a>
        }
      </div>
    }
  `,
  styles: [`
    :host { display:block; background:#f4f7f5; min-height:100vh; padding-bottom:40px; }
    .nav { position:sticky; top:0; z-index:10; display:flex; justify-content:space-between; align-items:center;
           background:rgba(10,28,22,.96); backdrop-filter:blur(14px); padding:13px 24px; }
    .brand { color:#fff; text-decoration:none; font-weight:700; font-size:15px; }
    .nav-btn { background:var(--gold); color:var(--ink); font-weight:700; font-size:13px; padding:9px 18px;
               border-radius:10px; text-decoration:none; }
    .tete { text-align:center; padding:40px 20px 8px; max-width:640px; margin:0 auto; }
    .tete h1 { color:var(--ink); font-size:clamp(24px,4vw,34px); margin:0 0 8px; }
    .tete p { color:var(--muted); margin:0; }
    .filtres { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; padding:24px 20px; max-width:900px; margin:0 auto; }
    .fi { padding:11px 14px; border:1px solid var(--line); border-radius:10px; font-size:14px; flex:1; min-width:160px; }
    .fi.num { max-width:130px; flex:0 0 130px; }
    .btn-gold { background:var(--gold); color:var(--ink); font-weight:700; border:none; border-radius:10px; padding:11px 22px; cursor:pointer; }
    .btn-ghost { background:#fff; color:var(--ink); border:1px solid var(--line); border-radius:10px; padding:11px 18px; cursor:pointer; }
    .vide { text-align:center; color:var(--muted); padding:60px 20px; }
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:20px; max-width:1160px; margin:0 auto; padding:0 20px; }
    .card { background:#fff; border-radius:18px; overflow:hidden; text-decoration:none; display:block;
            box-shadow:0 2px 16px rgba(0,0,0,.06); transition:transform .2s, box-shadow .2s; }
    .card:hover { transform:translateY(-4px); box-shadow:0 14px 32px rgba(0,0,0,.12); }
    .card-img { position:relative; height:180px; background:#1a2e28; }
    .card-img img { width:100%; height:100%; object-fit:cover; }
    .noimg { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:44px; }
    .ov { position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,.45), transparent 50%); }
    .vedette { position:absolute; top:12px; left:12px; font-size:10.5px; font-weight:700; padding:4px 10px; border-radius:99px;
               background:linear-gradient(90deg, var(--gold), #f0d080); color:var(--ink); }
    .badge { position:absolute; top:12px; right:12px; font-size:10.5px; font-weight:700; padding:4px 10px; border-radius:99px; }
    .badge.dispo { background:var(--gold); color:var(--ink); }
    .badge.full { background:rgba(0,0,0,.55); color:#fff; }
    .body { padding:14px 16px 16px; }
    .body h3 { margin:0 0 4px; color:var(--ink); font-size:16px; }
    .loc { color:var(--muted); font-size:12.5px; margin:0 0 10px; }
    .agence { display:flex; align-items:center; gap:6px; font-size:12px; color:var(--muted); border-top:1px solid var(--line); padding-top:10px; }
    .agence img { width:18px; height:18px; border-radius:4px; object-fit:cover; }
    .skeleton { height:260px; border-radius:18px; background:linear-gradient(90deg,#e2e9e4 25%,#d0dbd2 50%,#e2e9e4 75%);
                background-size:400% 100%; animation:skel 1.5s ease infinite; }
    @keyframes skel { 0%{background-position:100% 0} 100%{background-position:-100% 0} }
  `],
})
export class Annuaire implements OnInit {
  items = signal<any[]>([]);
  loading = signal(true);
  erreur = signal<string | null>(null);
  ville = '';
  prixMin: number | null = null;
  prixMax: number | null = null;

  constructor(private api: Api) {}

  async ngOnInit() { await this.rechercher(); }

  async rechercher() {
    this.loading.set(true);
    this.erreur.set(null);
    try {
      const params = new URLSearchParams();
      if (this.ville.trim()) params.set('ville', this.ville.trim());
      if (this.prixMin) params.set('prix_min', String(this.prixMin));
      if (this.prixMax) params.set('prix_max', String(this.prixMax));
      const qs = params.toString();
      this.items.set(await this.api.get('/public/annuaire' + (qs ? '?' + qs : '')));
    } catch {
      this.erreur.set("Impossible de charger les logements pour le moment.");
    } finally {
      this.loading.set(false);
    }
  }

  reinitialiser() {
    this.ville = ''; this.prixMin = null; this.prixMax = null;
    this.rechercher();
  }

  cover(im: any): string | null {
    const m = (im.medias || []).find((x: any) => x.type === 'photo' && x.url);
    return m?.url || null;
  }

  fcfa = fcfa;
}
