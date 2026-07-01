import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Api } from '../../core/api.service';

@Component({
  selector: 'app-vitrine',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- NAV -->
    <nav class="nav">
      <a class="brand" routerLink="/apropos"><img [src]="logo" alt="Toursen"/></a>
      <a class="nav-btn" routerLink="/login">Mon espace locataire →</a>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <span class="pill anim-1">🏢 Toursen Immobilier — Dakar</span>
        <h1 class="anim-2">Trouvez votre<br/><span class="gold-txt">logement idéal</span></h1>
        <p class="hero-p anim-3">Des appartements modernes à Dakar. Gérez tout depuis votre téléphone — loyer, contrat, réclamations.</p>
        <div class="hero-btns anim-4">
          <a class="btn-gold" href="#logements">Voir les logements</a>
          <a class="btn-ghost" routerLink="/login">Mon espace</a>
        </div>
      </div>
      <div class="hero-stats anim-5">
        <div class="stat"><span class="stat-n">{{ items().length }}</span><span class="stat-l">Immeubles</span></div>
        <div class="stat-sep"></div>
        <div class="stat"><span class="stat-n">{{ totalDispo() }}</span><span class="stat-l">Logements dispo</span></div>
        <div class="stat-sep"></div>
        <div class="stat"><span class="stat-n">Dakar</span><span class="stat-l">Sénégal</span></div>
      </div>
    </section>

    <!-- LOGEMENTS -->
    <section class="section" id="logements">
      <div class="wrap">
        <div class="sec-head">
          <div>
            <p class="sec-eyebrow">Disponible maintenant</p>
            <h2 class="sec-title">Nos immeubles</h2>
          </div>
        </div>

        @if (loading()) {
          <div class="skeletons">
            @for (s of [1,2,3]; track s) { <div class="skeleton"></div> }
          </div>
        } @else if (items().length === 0) {
          <p class="empty">Aucun logement disponible pour le moment.</p>
        } @else {
          <div class="grid">
            @for (im of items(); track im.id; let i = $index) {
              <a class="card" [routerLink]="['/vitrine', im.id]" [style.animation-delay]="(i*80)+'ms'">
                <div class="card-img">
                  @if (cover(im); as c) { <img [src]="c" alt="{{ im.nom }}"/> }
                  @else { <div class="noimg">🏢</div> }
                  <span class="card-badge"
                    [class.dispo]="(im.disponibles_count||0)>0"
                    [class.complet]="(im.disponibles_count||0)===0">
                    {{ (im.disponibles_count||0) > 0 ? im.disponibles_count + ' logement(s) dispo' : 'Complet' }}
                  </span>
                </div>
                <div class="card-body">
                  <h3 class="card-nom">{{ im.nom }}</h3>
                  <p class="card-ville">📍 {{ im.ville }}</p>
                  <span class="card-link">Voir les détails →</span>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </section>

    <!-- SERVICES LOCATAIRE -->
    <section class="section section-dark">
      <div class="wrap">
        <p class="sec-eyebrow light">Espace locataire</p>
        <h2 class="sec-title light">Déjà locataire chez nous ?</h2>
        <p class="sec-sub light">Votre espace en ligne vous permet de tout gérer, 24h/24.</p>
        <div class="feats">
          <div class="feat">
            <div class="feat-ico">📄</div>
            <h3>Votre contrat</h3>
            <p>Consultez votre bail, les détails de votre logement et votre échéance en un clic.</p>
          </div>
          <div class="feat">
            <div class="feat-ico">💰</div>
            <h3>Payer le loyer</h3>
            <p>Réglez votre loyer en ligne et recevez instantanément votre quittance de paiement.</p>
          </div>
          <div class="feat">
            <div class="feat-ico">🛠</div>
            <h3>Réclamations</h3>
            <p>Signalez un problème et suivez son traitement en temps réel depuis l'application.</p>
          </div>
        </div>
        <div class="connect-box">
          <div>
            <p class="connect-txt">Votre identifiant vous a été remis à la signature du contrat.</p>
          </div>
          <a class="btn-gold" routerLink="/login">Se connecter →</a>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <img [src]="logo" alt="Toursen" class="footer-logo"/>
          <p>Votre partenaire immobilier à Dakar depuis des années.</p>
        </div>
        <div class="footer-contact">
          <p class="footer-ttl">Contact</p>
          <p>📍 Rue 13x12 Médina, Dakar</p>
          <p>📞 33 882 27 28 / 77 566 03 77</p>
          <p>✉️ toursen.immo&#64;gmail.com</p>
        </div>
      </div>
      <p class="footer-copy">© 2025 Toursen Immobilier. Tous droits réservés.</p>
    </footer>
  `,
  styles: [`
    :host { display:block; min-height:100vh; background:#f7f9f8; font-family:inherit }

    /* ── NAV ── */
    .nav {
      position:sticky; top:0; z-index:100;
      display:flex; justify-content:space-between; align-items:center;
      background:rgba(18,38,32,.97); backdrop-filter:blur(12px);
      padding:12px 24px; box-shadow:0 2px 20px rgba(0,0,0,.3);
    }
    .brand img { height:30px; display:block; filter:brightness(0) invert(1); }
    .nav-btn {
      background:var(--gold); color:var(--ink); font-weight:700; font-size:13px;
      padding:9px 18px; border-radius:10px; text-decoration:none; transition:transform .15s, opacity .15s;
      white-space:nowrap;
    }
    .nav-btn:hover { opacity:.88; transform:translateY(-1px); }

    /* ── HERO ── */
    .hero {
      position:relative; min-height:88vh; display:flex; flex-direction:column;
      align-items:center; justify-content:center; text-align:center;
      background:linear-gradient(160deg,#0d2118 0%,#1b3d2e 55%,#0f2b20 100%);
      overflow:hidden; padding:80px 20px 40px;
    }
    .hero-bg {
      position:absolute; inset:0;
      background:radial-gradient(ellipse 70% 60% at 50% 40%, rgba(198,163,96,.12) 0%, transparent 70%);
      pointer-events:none;
    }
    .hero-content { position:relative; max-width:700px; }
    .pill {
      display:inline-block; background:rgba(198,163,96,.18); color:var(--gold);
      border:1px solid rgba(198,163,96,.35); font-size:13px; font-weight:600;
      padding:6px 16px; border-radius:99px; margin-bottom:24px; letter-spacing:.3px;
    }
    h1 {
      color:#fff; font-size:clamp(32px,7vw,64px); font-weight:900;
      margin:0 0 20px; line-height:1.1; letter-spacing:-.5px;
    }
    .gold-txt { color:var(--gold); }
    .hero-p { color:#9dc4b4; font-size:clamp(15px,2.5vw,18px); margin:0 0 36px; line-height:1.7; max-width:540px; margin-left:auto; margin-right:auto; }
    .hero-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-bottom:60px; }
    .btn-gold {
      background:var(--gold); color:var(--ink); font-weight:700; font-size:15px;
      padding:14px 28px; border-radius:12px; text-decoration:none; transition:transform .15s,box-shadow .15s;
      box-shadow:0 4px 20px rgba(198,163,96,.4);
    }
    .btn-gold:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(198,163,96,.5); }
    .btn-ghost {
      background:rgba(255,255,255,.08); color:#fff; font-weight:600; font-size:15px;
      padding:14px 28px; border-radius:12px; text-decoration:none; border:1px solid rgba(255,255,255,.2);
      transition:background .15s;
    }
    .btn-ghost:hover { background:rgba(255,255,255,.15); }
    .hero-stats {
      position:relative; display:flex; gap:0; background:rgba(255,255,255,.06);
      border:1px solid rgba(255,255,255,.1); border-radius:16px; padding:20px 32px;
      backdrop-filter:blur(8px);
    }
    .stat { text-align:center; padding:0 24px; }
    .stat-n { display:block; color:#fff; font-size:26px; font-weight:800; }
    .stat-l { display:block; color:#7aab96; font-size:12px; margin-top:2px; }
    .stat-sep { width:1px; background:rgba(255,255,255,.15); margin:4px 0; }

    /* ── ANIMATIONS ── */
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(28px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity:0; } to { opacity:1; }
    }
    @keyframes cardIn {
      from { opacity:0; transform:translateY(20px) scale(.97); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    .anim-1 { animation:fadeUp .6s ease both; animation-delay:.1s; }
    .anim-2 { animation:fadeUp .6s ease both; animation-delay:.25s; }
    .anim-3 { animation:fadeUp .6s ease both; animation-delay:.4s; }
    .anim-4 { animation:fadeUp .6s ease both; animation-delay:.55s; }
    .anim-5 { animation:fadeUp .6s ease both; animation-delay:.7s; }
    .card  { animation:cardIn .5s ease both; }

    /* ── SECTION ── */
    .section { padding:64px 0; }
    .section-dark { background:linear-gradient(160deg,#0d2118,#1b3d2e); }
    .wrap { max-width:1140px; margin:0 auto; padding:0 20px; }
    .sec-head { margin-bottom:36px; }
    .sec-eyebrow { color:var(--gold); font-size:12px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin:0 0 6px; }
    .sec-eyebrow.light { color:var(--gold); }
    .sec-title { color:var(--ink); font-size:clamp(22px,4vw,34px); font-weight:800; margin:0; }
    .sec-title.light { color:#fff; }
    .sec-sub { color:#8ab0a4; margin:10px 0 40px; font-size:15px; }
    .sec-sub.light { color:#8ab0a4; }
    .empty { color:var(--muted); text-align:center; padding:40px 0; }

    /* ── GRID LOGEMENTS ── */
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:24px; }
    .card {
      background:#fff; border-radius:20px; overflow:hidden; text-decoration:none;
      box-shadow:0 2px 16px rgba(0,0,0,.07); transition:transform .2s, box-shadow .2s;
      display:flex; flex-direction:column;
    }
    .card:hover { transform:translateY(-6px); box-shadow:0 16px 40px rgba(0,0,0,.13); }
    .card-img { position:relative; height:210px; background:var(--ink); overflow:hidden; flex-shrink:0; }
    .card-img img { width:100%; height:100%; object-fit:cover; transition:transform .4s; }
    .card:hover .card-img img { transform:scale(1.05); }
    .noimg { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:52px; }
    .card-badge {
      position:absolute; top:12px; left:12px; font-size:11px; font-weight:700;
      padding:4px 12px; border-radius:99px; backdrop-filter:blur(6px);
    }
    .card-badge.dispo { background:var(--gold); color:var(--ink); }
    .card-badge.complet { background:rgba(0,0,0,.5); color:#fff; }
    .card-body { padding:18px 20px 20px; flex:1; display:flex; flex-direction:column; }
    .card-nom { color:var(--ink); font-size:18px; font-weight:700; margin:0 0 6px; }
    .card-ville { color:var(--muted); font-size:13px; margin:0 0 14px; flex:1; }
    .card-link { color:var(--gold); font-weight:700; font-size:13px; }

    /* ── SKELETONS ── */
    .skeletons { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:24px; }
    .skeleton { height:290px; border-radius:20px; background:linear-gradient(90deg,#e8ede8 25%,#d8e2d8 50%,#e8ede8 75%); background-size:200%; animation:shimmer 1.4s infinite; }
    @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }

    /* ── FEATURES ── */
    .feats { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:20px; margin-bottom:36px; }
    .feat { background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); border-radius:18px; padding:28px 22px; transition:background .2s; }
    .feat:hover { background:rgba(255,255,255,.1); }
    .feat-ico { font-size:34px; margin-bottom:14px; }
    .feat h3 { color:#fff; font-size:16px; font-weight:700; margin:0 0 10px; }
    .feat p { color:#8ab0a4; font-size:14px; line-height:1.65; margin:0; }
    .connect-box {
      display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;
      background:rgba(198,163,96,.12); border:1px solid rgba(198,163,96,.3);
      border-radius:16px; padding:24px 28px;
    }
    .connect-txt { color:#c0d8ce; font-size:14px; margin:0; }

    /* ── FOOTER ── */
    .footer { background:#081410; color:#5a8a78; padding:48px 20px 24px; }
    .footer-inner { max-width:1140px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:40px; padding-bottom:32px; border-bottom:1px solid rgba(255,255,255,.08); margin-bottom:20px; }
    .footer-logo { height:36px; filter:brightness(0) invert(1); opacity:.7; display:block; margin-bottom:12px; }
    .footer-brand p { font-size:13px; line-height:1.6; }
    .footer-ttl { color:#fff; font-weight:700; margin:0 0 12px; }
    .footer-contact p { font-size:13px; margin:0 0 8px; }
    .footer-copy { text-align:center; font-size:12px; max-width:1140px; margin:0 auto; }

    @media(max-width:640px) {
      .hero-stats { flex-direction:column; gap:16px; padding:20px; }
      .stat-sep { width:100%; height:1px; margin:0; }
      .stat { padding:0; }
      .footer-inner { grid-template-columns:1fr; gap:24px; }
    }
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
  totalDispo(): number {
    return this.items().reduce((s, im) => s + (im.disponibles_count || 0), 0);
  }
}
