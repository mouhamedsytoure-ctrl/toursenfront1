import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Api } from '../../core/api.service';

@Component({
  selector: 'app-vitrine',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="top">
      <a class="brandbox" routerLink="/apropos"><img [src]="logo" alt="SITS"/></a>
      <a class="lien" routerLink="/login">Mon espace →</a>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-badge">Toursen Immobilier</div>
        <h1 class="hero-title">Bienvenue dans votre espace locataire</h1>
        <p class="hero-sub">Gérez votre logement, payez votre loyer et suivez vos réclamations — tout en ligne, depuis votre téléphone.</p>
        <a class="hero-btn" routerLink="/login">Accéder à mon espace</a>
      </div>
    </section>

    <!-- Comment ça marche -->
    <section class="features">
      <div class="wrap">
        <h2 class="sec-title">Vous êtes locataire chez Toursen ?</h2>
        <p class="sec-sub">Voici ce que vous pouvez faire depuis votre espace personnel.</p>
        <div class="feat-grid">
          <div class="feat">
            <div class="feat-icon">📄</div>
            <h3>Votre contrat</h3>
            <p>Consultez votre contrat de bail, les détails de votre logement et votre date d'échéance.</p>
          </div>
          <div class="feat">
            <div class="feat-icon">💰</div>
            <h3>Payer votre loyer</h3>
            <p>Effectuez vos paiements directement depuis l'application. Recevez une quittance à chaque paiement.</p>
          </div>
          <div class="feat">
            <div class="feat-icon">🛠</div>
            <h3>Réclamations</h3>
            <p>Signalez un problème dans votre logement. Suivez l'avancement de votre demande en temps réel.</p>
          </div>
        </div>
        <div class="cta-box">
          <p>Votre identifiant vous a été remis lors de la signature de votre contrat.</p>
          <a class="hero-btn" routerLink="/login">Se connecter</a>
        </div>
      </div>
    </section>

    <!-- Logements -->
    <section class="wrap">
      <h2 class="sec-title">Nos immeubles</h2>
      <p class="sec-sub">Découvrez nos biens disponibles à la location.</p>
      @if (loading()) { <p class="muted">Chargement...</p> }
      @else if (items().length === 0) { <p class="muted">Aucun logement disponible pour le moment.</p> }
      @else {
        <div class="grid">
          @for (im of items(); track im.id) {
            <a class="card" [routerLink]="['/vitrine', im.id]">
              @if (cover(im); as c) { <img [src]="c" alt=""/> } @else { <div class="noimg">🏢</div> }
              <div class="ov">
                <div class="nm">{{ im.nom }}</div>
                <div class="vl">{{ im.ville }}</div>
                <span class="badge" [style.background]="(im.disponibles_count||0) > 0 ? 'var(--gold)' : '#ffffff55'"
                      [style.color]="(im.disponibles_count||0) > 0 ? 'var(--ink)' : '#fff'">
                  {{ (im.disponibles_count||0) > 0 ? im.disponibles_count + ' dispo' : 'Complet' }}
                </span>
              </div>
            </a>
          }
        </div>
      }
    </section>

    <footer class="footer">
      <p>© 2025 Toursen Immobilier — Rue 13x12 Médina, Dakar &nbsp;|&nbsp; 33 882 27 28 / 77 566 03 77</p>
    </footer>
  `,
  styles: [`
    :host{display:block;min-height:100vh;background:var(--bg)}
    .top{display:flex;justify-content:space-between;align-items:center;background:var(--ink);padding:14px 20px}
    .brandbox{background:#fff;border-radius:8px;padding:5px 10px}.brandbox img{height:26px;display:block}
    .lien{color:var(--gold);text-decoration:none;font-weight:700;font-size:14px}

    /* Hero */
    .hero{background:linear-gradient(135deg,var(--ink) 0%,#1a3a32 100%);padding:60px 20px 70px;text-align:center}
    .hero-inner{max-width:640px;margin:0 auto}
    .hero-badge{display:inline-block;background:var(--gold);color:var(--ink);font-size:12px;font-weight:700;padding:4px 14px;border-radius:99px;margin-bottom:16px;letter-spacing:.5px}
    .hero-title{color:#fff;font-size:clamp(24px,5vw,42px);font-weight:800;margin:0 0 14px;line-height:1.2}
    .hero-sub{color:#b0cdc5;font-size:16px;margin:0 0 28px;line-height:1.6}
    .hero-btn{display:inline-block;background:var(--gold);color:var(--ink);font-weight:700;padding:14px 32px;border-radius:12px;text-decoration:none;font-size:15px;transition:opacity .2s}
    .hero-btn:hover{opacity:.85}

    /* Features */
    .features{background:#f0f4f2;padding:48px 20px}
    .wrap{max-width:1100px;margin:0 auto;padding:40px 16px}
    .sec-title{color:var(--ink);font-size:22px;font-weight:800;margin:0 0 6px;text-align:center}
    .sec-sub{color:var(--muted);text-align:center;margin:0 0 32px}
    .feat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px;margin-bottom:36px}
    .feat{background:#fff;border-radius:16px;padding:24px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.06)}
    .feat-icon{font-size:36px;margin-bottom:12px}
    .feat h3{color:var(--ink);margin:0 0 8px;font-size:16px}
    .feat p{color:var(--muted);font-size:13px;line-height:1.6;margin:0}
    .cta-box{text-align:center;padding:28px;background:var(--ink);border-radius:16px;color:#fff}
    .cta-box p{margin:0 0 16px;color:#b0cdc5;font-size:14px}

    /* Logements */
    .muted{color:var(--muted)}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
    .card{position:relative;height:200px;border-radius:18px;overflow:hidden;background:var(--ink);text-decoration:none;display:block;transition:transform .2s}
    .card:hover{transform:translateY(-3px)}
    .card img{width:100%;height:100%;object-fit:cover}
    .noimg{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:42px}
    .ov{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:16px;background:linear-gradient(to bottom,transparent,rgba(0,0,0,.8))}
    .nm{color:#fff;font-weight:bold;font-size:17px} .vl{color:#cfe0d9;font-size:13px;margin-bottom:8px}
    .badge{align-self:flex-start;font-size:12px;font-weight:700;padding:3px 10px;border-radius:99px}

    /* Footer */
    .footer{background:var(--ink);color:#7a9e94;text-align:center;padding:20px;font-size:12px}
  `],
})
export class Vitrine implements OnInit {
  items = signal<any[]>([]);
  logo = environment.apiUrl.replace('/api', '') + '/logo-toursen.jpeg';
  loading = signal(true);
  constructor(private api: Api) {}
  async ngOnInit() {
    try { this.items.set(await this.api.get('/public/immeubles')); }
    finally { this.loading.set(false); }
  }
  cover(im: any): string | null {
    const m = (im.medias || []).find((x: any) => x.type === 'photo' && x.url);
    return m?.url || null;
  }
}
