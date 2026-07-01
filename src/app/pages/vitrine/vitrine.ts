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
      <a class="nav-btn" routerLink="/login">Mon espace →</a>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-orb orb1"></div>
      <div class="hero-orb orb2"></div>
      <div class="hero-content">
        <h1><span class="txt-white anim-1">Votre logement</span><br/><span class="gold-txt anim-2">à Dakar</span></h1>
        <p class="hero-p anim-3">Des appartements modernes à votre portée. Payez votre loyer, consultez votre contrat et signalez vos problèmes — tout depuis votre téléphone.</p>
        <div class="hero-btns anim-4">
          <a class="btn-gold" href="#logements">Voir les logements ↓</a>
          <a class="btn-ghost" routerLink="/login">Mon espace locataire</a>
        </div>
      </div>
      <div class="hero-stats anim-5">
        <div class="stat"><span class="stat-n">{{ items().length }}</span><span class="stat-l">Immeubles</span></div>
        <div class="stat-sep"></div>
        <div class="stat"><span class="stat-n">{{ totalDispo() }}</span><span class="stat-l">Dispo</span></div>
        <div class="stat-sep"></div>
        <div class="stat"><span class="stat-n">Dakar</span><span class="stat-l">Sénégal</span></div>
      </div>
    </section>

    <!-- LOGEMENTS -->
    <section class="section" id="logements">
      <div class="wrap">
        <p class="eyebrow">Nos biens</p>
        <h2 class="stitle">Logements disponibles</h2>

        @if (loading()) {
          <div class="grid">
            @for (s of [1,2,3,4,5,6]; track s) { <div class="skeleton"></div> }
          </div>
        } @else if (items().length === 0) {
          <p class="empty">Aucun logement disponible pour le moment.</p>
        } @else {
          <div class="grid">
            @for (im of items(); track im.id; let i = $index) {
              <a class="card reveal" [routerLink]="['/vitrine', im.id]" [style.animation-delay]="(i*100)+'ms'">
                <div class="card-img">
                  @if (cover(im); as c) {
                    <img [src]="c" alt="{{ im.nom }}"/>
                  } @else {
                    <div class="noimg">🏢</div>
                  }
                  <div class="card-overlay"></div>
                  <span class="cbadge" [class.dispo]="(im.disponibles_count||0)>0" [class.full]="(im.disponibles_count||0)===0">
                    {{ (im.disponibles_count||0) > 0 ? (im.disponibles_count) + ' logement(s) dispo' : 'Complet' }}
                  </span>
                </div>
                <div class="card-body">
                  <h3>{{ im.nom }}</h3>
                  <p class="cloc">📍 {{ im.ville || 'Dakar' }}</p>
                  <div class="card-footer">
                    <span class="voir">Voir les détails →</span>
                  </div>
                  <div class="card-phones" (click)="$event.stopPropagation(); $event.preventDefault()">
                    <a class="phone-link" href="tel:+221775660377">📞 77 566 03 77</a>
                    <a class="phone-link" href="tel:+221777353772">📞 77 735 37 72</a>
                  </div>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </section>

    <!-- LOCATAIRE -->
    <section class="section-dark">
      <div class="wrap">
        <p class="eyebrow gold">Espace locataire</p>
        <h2 class="stitle light">Déjà locataire ?</h2>
        <div class="feats">
          <div class="feat reveal">
            <div class="feat-ico">📄</div>
            <h3>Votre contrat</h3>
            <p>Consultez votre bail et les détails de votre logement à tout moment.</p>
          </div>
          <div class="feat reveal" style="animation-delay:120ms">
            <div class="feat-ico">💰</div>
            <h3>Payer le loyer</h3>
            <p>Réglez votre loyer en ligne et téléchargez votre quittance immédiatement.</p>
          </div>
          <div class="feat reveal" style="animation-delay:240ms">
            <div class="feat-ico">🛠</div>
            <h3>Réclamations</h3>
            <p>Signalez un problème et suivez son traitement en temps réel.</p>
          </div>
        </div>
        <div class="cta-strip reveal">
          <p>Vos identifiants de connexion vous seront communiqués dès la signature de votre contrat de location.</p>
          <a class="btn-gold" routerLink="/login">Se connecter →</a>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-grid">
        <div>
          <img [src]="logo" alt="Toursen" class="flogo"/>
          <p class="fdesc">Votre partenaire immobilier à Dakar.</p>
        </div>
        <div>
          <p class="ftitle">Contact</p>
          <p>📍 Rue 13x12 Médina, Dakar</p>
          <p>📞 77 566 03 77 / 77 735 37 72</p>
          <p>✉️ toursen.immo&#64;gmail.com</p>
        </div>
      </div>
      <p class="fcopy">© 2025 Toursen Immobilier. Tous droits réservés.</p>
    </footer>
  `,
  styles: [`
    :host { display:block; background:#f4f7f5; }

    /* NAV */
    .nav {
      position:sticky; top:0; z-index:100;
      display:flex; justify-content:space-between; align-items:center;
      background:rgba(10,28,22,.96); backdrop-filter:blur(14px);
      padding:13px 24px; box-shadow:0 1px 0 rgba(255,255,255,.06);
    }
    .brand { background:#fff; border-radius:8px; padding:5px 10px; display:block; }
    .brand img { height:28px; display:block; }
    .nav-btn {
      background:var(--gold); color:var(--ink); font-weight:700; font-size:13px;
      padding:9px 18px; border-radius:10px; text-decoration:none;
      transition:transform .15s, box-shadow .15s;
      box-shadow: 0 2px 10px rgba(198,163,96,.35);
    }
    .nav-btn:hover { transform:translateY(-1px); box-shadow:0 4px 18px rgba(198,163,96,.5); }

    /* HERO */
    .hero {
      position:relative; min-height:92vh; display:flex; flex-direction:column;
      align-items:center; justify-content:center; text-align:center;
      background:linear-gradient(150deg,#071410 0%,#0f2318 45%,#071c14 100%);
      padding:90px 20px 48px; overflow:hidden;
    }
    .hero-orb {
      position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none;
    }
    .orb1 {
      width:500px; height:500px; top:-100px; left:-150px;
      background:radial-gradient(circle, rgba(198,163,96,.18) 0%, transparent 70%);
      animation:float 8s ease-in-out infinite;
    }
    .orb2 {
      width:400px; height:400px; bottom:-80px; right:-100px;
      background:radial-gradient(circle, rgba(34,120,80,.2) 0%, transparent 70%);
      animation:float 10s ease-in-out infinite reverse;
    }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-30px)} }

    .hero-content { position:relative; max-width:720px; }
    h1 {
      font-size:clamp(38px,8vw,72px); font-weight:900; margin:0 0 22px;
      line-height:1.05; letter-spacing:-1px;
    }
    .txt-white { color:#fff; }
    .gold-txt {
      color:var(--gold);
      background:linear-gradient(90deg, var(--gold), #f0d080, var(--gold));
      background-size:200%;
      -webkit-background-clip:text; -webkit-text-fill-color:transparent;
      background-clip:text;
      animation:shimmer 3s linear infinite;
    }
    @keyframes shimmer { 0%{background-position:0%} 100%{background-position:200%} }

    .hero-p {
      color:#8dbdaa; font-size:clamp(14px,2.2vw,17px); line-height:1.75;
      margin:0 0 36px; max-width:560px; margin-left:auto; margin-right:auto;
    }
    .hero-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-bottom:56px; }
    .btn-gold {
      background:var(--gold); color:var(--ink); font-weight:700; font-size:15px;
      padding:14px 30px; border-radius:12px; text-decoration:none;
      transition:transform .15s, box-shadow .15s;
      box-shadow:0 4px 24px rgba(198,163,96,.45);
    }
    .btn-gold:hover { transform:translateY(-3px); box-shadow:0 8px 32px rgba(198,163,96,.6); }
    .btn-ghost {
      background:rgba(255,255,255,.07); color:#fff; font-weight:600; font-size:15px;
      padding:14px 30px; border-radius:12px; text-decoration:none;
      border:1px solid rgba(255,255,255,.18); transition:background .15s;
    }
    .btn-ghost:hover { background:rgba(255,255,255,.14); }

    .hero-stats {
      position:relative; display:flex; align-items:center;
      background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.09);
      border-radius:18px; padding:18px 36px; gap:0; backdrop-filter:blur(10px);
    }
    .stat { padding:0 28px; text-align:center; }
    .stat-n { display:block; color:#fff; font-size:28px; font-weight:800; line-height:1; }
    .stat-l { display:block; color:#5a9a80; font-size:12px; margin-top:4px; letter-spacing:.3px; }
    .stat-sep { width:1px; height:40px; background:rgba(255,255,255,.12); }

    /* ANIMATIONS HERO */
    @keyframes fadeSlideUp {
      from { opacity:0; transform:translateY(32px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .anim-1 { opacity:0; animation:fadeSlideUp .7s cubic-bezier(.16,1,.3,1) forwards; animation-delay:.1s; }
    .anim-2 { opacity:0; animation:fadeSlideUp .7s cubic-bezier(.16,1,.3,1) forwards; animation-delay:.3s; }
    .anim-3 { opacity:0; animation:fadeSlideUp .7s cubic-bezier(.16,1,.3,1) forwards; animation-delay:.5s; }
    .anim-4 { opacity:0; animation:fadeSlideUp .7s cubic-bezier(.16,1,.3,1) forwards; animation-delay:.65s; }
    .anim-5 { opacity:0; animation:fadeSlideUp .7s cubic-bezier(.16,1,.3,1) forwards; animation-delay:.8s; }

    /* CARDS ANIMATION */
    @keyframes cardReveal {
      from { opacity:0; transform:translateY(24px) scale(.98); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    .reveal { opacity:0; animation:cardReveal .6s cubic-bezier(.16,1,.3,1) forwards; }

    /* SECTIONS */
    .section { padding:72px 0; }
    .section-dark {
      background:linear-gradient(150deg,#071410 0%,#0f2318 100%);
      padding:72px 0;
    }
    .wrap { max-width:1160px; margin:0 auto; padding:0 20px; }
    .eyebrow { color:var(--gold); font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin:0 0 8px; }
    .eyebrow.gold { color:var(--gold); }
    .stitle { color:var(--ink); font-size:clamp(24px,4vw,36px); font-weight:800; margin:0 0 40px; }
    .stitle.light { color:#fff; }
    .empty { color:var(--muted); text-align:center; padding:60px 0; }

    /* GRID */
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:24px; }

    /* CARD */
    .card {
      background:#fff; border-radius:22px; overflow:hidden; text-decoration:none;
      display:flex; flex-direction:column;
      box-shadow:0 2px 20px rgba(0,0,0,.07);
      transition:transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s;
    }
    .card:hover { transform:translateY(-8px); box-shadow:0 20px 50px rgba(0,0,0,.14); }
    .card-img { position:relative; height:220px; background:#1a2e28; overflow:hidden; flex-shrink:0; }
    .card-img img { width:100%; height:100%; object-fit:cover; transition:transform .5s ease; }
    .card:hover .card-img img { transform:scale(1.08); }
    .card-overlay {
      position:absolute; inset:0;
      background:linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 50%);
    }
    .noimg { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:56px; }
    .cbadge {
      position:absolute; top:14px; right:14px; font-size:11px; font-weight:700;
      padding:5px 12px; border-radius:99px; letter-spacing:.2px;
    }
    .cbadge.dispo { background:var(--gold); color:var(--ink); }
    .cbadge.full { background:rgba(0,0,0,.55); color:#fff; backdrop-filter:blur(4px); }
    .card-body { padding:20px 22px 22px; flex:1; display:flex; flex-direction:column; }
    .card-body h3 { color:var(--ink); font-size:19px; font-weight:700; margin:0 0 6px; }
    .cloc { color:var(--muted); font-size:13px; margin:0 0 16px; flex:1; }
    .card-footer { display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap; }
    .voir { color:var(--gold); font-weight:700; font-size:13px; }
    .card-phones { display:flex; gap:8px; flex-wrap:wrap; padding:0 22px 18px; }
    .phone-link {
      flex:1; text-align:center; background:var(--ink); color:#fff;
      font-size:13px; font-weight:600; padding:9px 10px; border-radius:10px;
      text-decoration:none; transition:background .15s; white-space:nowrap;
    }
    .phone-link:hover { background:var(--gold); color:var(--ink); }

    /* SKELETON */
    .skeleton {
      height:300px; border-radius:22px;
      background:linear-gradient(90deg,#e2e9e4 25%,#d0dbd2 50%,#e2e9e4 75%);
      background-size:400% 100%;
      animation:skel 1.5s ease infinite;
    }
    @keyframes skel { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

    /* FEATS */
    .feats { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:20px; margin-bottom:32px; }
    .feat {
      background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.09);
      border-radius:18px; padding:28px 24px;
      transition:background .2s, transform .2s;
    }
    .feat:hover { background:rgba(255,255,255,.09); transform:translateY(-4px); }
    .feat-ico { font-size:36px; margin-bottom:14px; }
    .feat h3 { color:#fff; font-size:16px; font-weight:700; margin:0 0 10px; }
    .feat p { color:#7aaa94; font-size:14px; line-height:1.7; margin:0; }

    .cta-strip {
      display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;
      background:rgba(198,163,96,.1); border:1px solid rgba(198,163,96,.25);
      border-radius:16px; padding:24px 28px; margin-top:8px;
    }
    .cta-strip p { color:#9dc4b4; font-size:14px; margin:0; }

    /* FOOTER */
    .footer { background:#060f0c; color:#4d7a68; padding:48px 20px 24px; }
    .footer-grid { max-width:1160px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:40px; padding-bottom:32px; border-bottom:1px solid rgba(255,255,255,.07); margin-bottom:20px; }
    .flogo { height:34px; filter:brightness(0) invert(1); opacity:.65; display:block; margin-bottom:12px; }
    .fdesc { font-size:13px; line-height:1.6; }
    .ftitle { color:#fff; font-weight:700; margin:0 0 12px; }
    .footer-grid p { font-size:13px; margin:0 0 8px; }
    .fcopy { text-align:center; font-size:11px; max-width:1160px; margin:0 auto; }

    @media(max-width:600px) {
      .hero-stats { flex-direction:column; padding:18px 20px; gap:14px; }
      .stat-sep { width:100%; height:1px; }
      .stat { padding:0; }
      .footer-grid { grid-template-columns:1fr; gap:24px; }
      .grid { grid-template-columns:1fr; }
    }
  `],
})
export class Vitrine implements OnInit {
  items = signal<any[]>([]);
  logo = environment.apiUrl.replace('/api', '') + '/logo-toursen.jpeg';
  loading = signal(true);
  contactOpen: number | null = null;

  toggleContact(id: number) { this.contactOpen = this.contactOpen === id ? null : id; }

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
