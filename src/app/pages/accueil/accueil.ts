import { AfterViewInit, Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet],
  template: `
  <ng-template #icone let-type="type">
    @switch (type) {
      @case ('book') {
        <div class="ic-book">
          <span class="spine"></span>
          <span class="page p1"></span>
          <span class="page p2"></span>
        </div>
      }
      @case ('coin') {
        <div class="ic-coin"><span class="coin"></span></div>
      }
      @case ('receipt') {
        <div class="ic-receipt">
          <span class="slot"></span>
          <span class="paper"></span>
          <span class="check">✓</span>
        </div>
      }
      @case ('house') {
        <div class="ic-house">
          <span class="roof"></span>
          <span class="wall">
            <span class="window"></span>
            <span class="door"></span>
          </span>
        </div>
      }
      @case ('bell') {
        <div class="ic-bell">
          <span class="cloche">🔔</span>
          <span class="badge"></span>
        </div>
      }
      @case ('chart') {
        <div class="ic-chart">
          <span class="bar b1"></span>
          <span class="bar b2"></span>
          <span class="bar b3"></span>
          <span class="bar b4"></span>
        </div>
      }
    }
  </ng-template>

  <div class="ac">
    <nav class="nav">
      <span class="marque">Sunnu Immo</span>
      <div class="nav-l">
        <a href="#fonctionnalites" (click)="allerA('fonctionnalites', $event)">Fonctionnalites</a>
        <a href="#histoire" (click)="allerA('histoire', $event)">Notre histoire</a>
        <a href="#formules" (click)="allerA('formules', $event)">Tarifs</a>
        <a routerLink="/login">Connexion</a>
        <a class="btn plein" routerLink="/inscription">Essai gratuit</a>
      </div>
    </nav>

    <header class="hero">
      <span class="pill">14 jours d'essai, sans engagement</span>
      <h1>Gerez vos immeubles<br><em>sans un seul cahier</em></h1>
      <p>
        Contrats, loyers, quittances, relances, reclamations. Tout au meme endroit,
        accessible depuis votre telephone. Que vous ayez un immeuble ou cinquante.
      </p>
      <div class="cta">
        <a class="btn plein grand" routerLink="/inscription">Commencer gratuitement</a>
        <a class="btn grand" routerLink="/login">J'ai deja un compte</a>
      </div>
      <p class="fine">Aucune carte bancaire demandee</p>
    </header>

    <div class="mini-icones">
      @for (a of atouts; track a.titre) {
        <div class="mini">
          <div class="ic-wrap"><ng-container *ngTemplateOutlet="icone; context:{ type: a.type }"></ng-container></div>
          <span>{{ a.titre }}</span>
        </div>
      }
    </div>

    <section class="fonctions" id="fonctionnalites">
      @for (a of atouts; track a.titre; let i = $index) {
        <div class="feature-row reveal" [class.reverse]="i % 2 === 1"
             [class.from-left]="i % 2 === 0" [class.from-right]="i % 2 === 1">
          <div class="feature-visual">
            <div class="ic-wrap"><ng-container *ngTemplateOutlet="icone; context:{ type: a.type }"></ng-container></div>
          </div>
          <div class="feature-text">
            <span class="num">0{{ i + 1 }}</span>
            <h3>{{ a.titre }}</h3>
            <p class="lead">{{ a.texte }}</p>
            <p>{{ a.detail }}</p>
          </div>
        </div>
      }
    </section>

    <section class="histoire reveal" id="histoire">
      <div class="histoire-photo">
        @if (photoOk) {
          <img src="/photo-fondateur.jpg" alt="Mouhamed Sy Toure, fondateur de Sunnu Immo" (error)="photoOk = false">
        } @else {
          <div class="avatar-secours">MST</div>
        }
      </div>
      <div class="histoire-texte">
        <span class="eyebrow">Notre histoire</span>
        <h2>Pourquoi Sunnu Immo</h2>
        <p class="nom">Mouhamed Sy Toure</p>
        <p class="role">Fondateur — Titulaire d'une Licence de l'Universite Amadou Hampathe Ba</p>
        <p>
          Titulaire d'une Licence de l'Universite Amadou Hampathe Ba, j'ai observe les agences
          immobilieres autour de moi jongler avec des cahiers, des carnets de quittances et des
          messages eparpilles sur WhatsApp pour suivre des dizaines de logements. Cela m'a donne envie de
          proposer une solution plus simple.
        </p>
        <p>
          Sunnu Immo est ne de cette envie : donner aux agences senegalaises, petites ou grandes, un
          outil pense pour leur realite du terrain, accessible depuis un simple telephone et sans
          formation compliquee. Je continue de faire evoluer la plateforme chaque semaine, avec la
          meme motivation qu'au premier jour — faire gagner du temps a celles et ceux qui gerent des
          biens au quotidien.
        </p>
      </div>
    </section>

    <section class="formules reveal" id="formules">
      <h2>Des tarifs clairs</h2>
      <p class="st">Payez selon la taille de votre parc. Changez de formule quand vous voulez.</p>

      <div class="grille">
        @for (f of formules; track f.nom) {
          <div class="f" [class.phare]="f.phare">
            @if (f.phare) { <span class="ruban">Le plus choisi</span> }
            <h3>{{ f.nom }}</h3>
            <div class="prix"><strong>{{ f.prix }}</strong><span> FCFA / mois</span></div>
            <p class="q">{{ f.quota }}</p>
            <ul>@for (x of f.atouts; track x) { <li>{{ x }}</li> }</ul>
            <a class="btn" [routerLink]="['/inscription']" [queryParams]="{ plan: f.cle }">Essayer</a>
          </div>
        }
      </div>
    </section>

    <section class="fin reveal">
      <h2>Pret a arreter les cahiers ?</h2>
      <p>Creez votre espace en deux minutes. Vos donnees restent les votres.</p>
      <a class="btn plein grand" routerLink="/inscription">Creer mon espace</a>
    </section>

    <footer class="pied">
      <span>Sunnu Immo — plateforme de gestion immobiliere</span>
      <a href="#histoire" (click)="allerA('histoire', $event)">A propos</a>
    </footer>
  </div>
  `,
  styles: [`
    .ac { background:#faf9f6; min-height:100vh; }
    .nav { display:flex; justify-content:space-between; align-items:center; padding:18px 32px; max-width:1140px; margin:0 auto; }
    .marque { font-size:20px; font-weight:700; color:#12291f; }
    .nav-l { display:flex; gap:16px; align-items:center; }
    .nav-l a { text-decoration:none; color:#374151; font-size:14px; }

    .hero { text-align:center; padding:64px 24px 40px; max-width:820px; margin:0 auto; }
    .pill { display:inline-block; background:#e9f5ee; color:#12291f; padding:6px 15px; border-radius:99px; font-size:13px; }
    .hero h1 { font-size:clamp(30px,5vw,50px); line-height:1.15; margin:20px 0 18px; color:#12291f; }
    .hero h1 em { font-style:normal; color:#c9922f; }
    .hero p { color:#4b5563; font-size:17px; line-height:1.7; max-width:600px; margin:0 auto 28px; }
    .cta { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
    .fine { font-size:12px; color:#9ca3af; margin-top:14px; }

    .btn { display:inline-block; padding:11px 20px; border:1px solid #d1d5db; border-radius:10px;
           background:#fff; text-decoration:none; color:#111; font-size:14px; cursor:pointer; }
    .btn.plein { background:#12291f; color:#e9c46a; border-color:#12291f; }
    .btn.grand { padding:14px 28px; font-size:15px; }

    /* --- bandeau d'icones visible des l'arrivee, sans avoir a descendre --- */
    .mini-icones { display:flex; flex-wrap:wrap; justify-content:center; gap:30px;
                   max-width:920px; margin:0 auto 64px; padding:0 24px; }
    .mini { display:flex; flex-direction:column; align-items:center; gap:9px; width:100px; }
    .mini .ic-wrap { margin-bottom:0; }
    .mini span { font-size:12px; color:#6b7280; text-align:center; line-height:1.3; }

    .ic-wrap { width:48px; height:40px; display:flex; align-items:center; justify-content:center; margin-bottom:14px; }

    /* --- livre qui s'ouvre : Contrats en un clic --- */
    .ic-book { position:relative; width:36px; height:28px; }
    .ic-book .spine { position:absolute; left:50%; top:0; bottom:0; width:2px; margin-left:-1px; background:#12291f; border-radius:1px; z-index:1; }
    .ic-book .page { position:absolute; top:1px; bottom:1px; width:16px; background:#fdfaf3; border:1px solid #e2dbc9;
                      box-shadow:0 1px 2px rgba(0,0,0,.06); }
    .ic-book .p1 { left:2px; border-radius:3px 1px 1px 3px; transform-origin:right center; animation:flipL 3.4s ease-in-out infinite; }
    .ic-book .p2 { right:2px; border-radius:1px 3px 3px 1px; transform-origin:left center; animation:flipR 3.4s ease-in-out infinite; }
    @keyframes flipL { 0%,100% { transform:rotateY(0deg) skewY(0deg); } 50% { transform:rotateY(28deg) skewY(-4deg); } }
    @keyframes flipR { 0%,100% { transform:rotateY(0deg) skewY(0deg); } 50% { transform:rotateY(-28deg) skewY(4deg); } }

    /* --- piece qui tourne : Loyers suivis --- */
    .ic-coin { width:30px; height:30px; perspective:160px; display:flex; align-items:center; justify-content:center; }
    .ic-coin .coin { width:26px; height:26px; border-radius:50%; background:linear-gradient(135deg,#e9c46a,#c9922f);
                      box-shadow:inset 0 0 0 2px rgba(255,255,255,.45); animation:coinSpin 2.6s linear infinite; }
    @keyframes coinSpin { 0% { transform:rotateY(0deg); } 100% { transform:rotateY(360deg); } }

    /* --- quittance qui sort : Quittances automatiques --- */
    .ic-receipt { position:relative; width:32px; height:32px; }
    .ic-receipt .slot { position:absolute; bottom:5px; left:3px; right:3px; height:2px; background:#d7d2c4; border-radius:2px; z-index:1; }
    .ic-receipt .paper { position:absolute; left:6px; right:6px; bottom:6px; height:0; background:#fff; border:1px solid #e2dbc9;
                          border-radius:2px 2px 0 0; overflow:hidden; animation:receiptOut 3.2s ease-in-out infinite; }
    .ic-receipt .paper::before, .ic-receipt .paper::after { content:''; position:absolute; left:3px; right:3px; height:1px; background:#e5e7eb; }
    .ic-receipt .paper::before { top:5px; } .ic-receipt .paper::after { top:9px; }
    .ic-receipt .check { position:absolute; bottom:8px; left:50%; color:#16a34a; font-size:12px; font-weight:700;
                          transform:translateX(-50%) scale(0); animation:checkPop 3.2s ease-in-out infinite; }
    @keyframes receiptOut { 0%,10% { height:0; } 45%,80% { height:18px; } 100% { height:0; } }
    @keyframes checkPop { 0%,48% { transform:translateX(-50%) scale(0); } 60%,75% { transform:translateX(-50%) scale(1); } 95%,100% { transform:translateX(-50%) scale(0); } }

    /* --- maison, porte qui s'ouvre : Vitrine en ligne --- */
    .ic-house { position:relative; width:36px; height:32px; }
    .ic-house .roof { position:absolute; top:0; left:0; right:0; height:0;
                       border-left:18px solid transparent; border-right:18px solid transparent; border-bottom:13px solid #12291f; }
    .ic-house .wall { position:absolute; top:12px; left:4px; right:4px; bottom:0; background:#e9c46a; border-radius:0 0 2px 2px; overflow:hidden; }
    .ic-house .window { position:absolute; top:3px; right:4px; width:6px; height:6px; background:#fff8e6; border-radius:1px; animation:winGlow 3.6s ease-in-out infinite; }
    .ic-house .door { position:absolute; bottom:0; left:5px; width:8px; height:13px; background:#12291f; border-radius:3px 3px 0 0;
                       transform-origin:left bottom; animation:doorSwing 3.6s ease-in-out infinite; }
    @keyframes doorSwing { 0%,20%,100% { transform:rotateY(0deg); } 45%,65% { transform:rotateY(55deg); } }
    @keyframes winGlow { 0%,100% { background:#fff8e6; box-shadow:none; } 50% { background:#ffe08a; box-shadow:0 0 6px 1px rgba(255,214,120,.75); } }

    /* --- cloche qui sonne : Reclamations centralisees --- */
    .ic-bell { position:relative; width:36px; height:32px; display:flex; align-items:center; justify-content:center; font-size:24px; }
    .ic-bell .cloche { display:inline-block; transform-origin:top center; animation:bellRing 3.8s ease-in-out infinite; }
    .ic-bell .badge { position:absolute; top:2px; right:6px; width:7px; height:7px; background:#e04f4f; border-radius:50%;
                       animation:badgePulse 3.8s ease-in-out infinite; }
    @keyframes bellRing { 0%,80%,100% { transform:rotate(0deg); } 82% { transform:rotate(-14deg); } 84% { transform:rotate(12deg); }
                           86% { transform:rotate(-9deg); } 88% { transform:rotate(6deg); } 90% { transform:rotate(0deg); } }
    @keyframes badgePulse { 0%,75%,100% { transform:scale(1); } 82% { transform:scale(1.5); } }

    /* --- barres qui pulsent : Statistiques reelles --- */
    .ic-chart { display:flex; align-items:flex-end; gap:4px; width:32px; height:28px; }
    .ic-chart .bar { width:5px; height:30%; background:linear-gradient(180deg,#12291f,#2f5943); border-radius:2px 2px 0 0;
                      animation:barGrow 2.6s ease-in-out infinite; }
    .ic-chart .b1 { animation-delay:0s; } .ic-chart .b2 { animation-delay:.2s; }
    .ic-chart .b3 { animation-delay:.4s; } .ic-chart .b4 { animation-delay:.6s; }
    @keyframes barGrow { 0%,100% { height:30%; } 50% { height:100%; } }

    @media (prefers-reduced-motion: reduce) {
      .ic-book .page, .ic-coin .coin, .ic-receipt .paper, .ic-receipt .check,
      .ic-house .door, .ic-house .window, .ic-bell .cloche, .ic-bell .badge, .ic-chart .bar { animation:none !important; }
    }

    /* --- animation d'apparition au defilement --- */
    .reveal { opacity:0; transform:translateY(28px); transition:opacity .7s ease, transform .7s ease; }
    .reveal.from-left { transform:translate(-46px,0); }
    .reveal.from-right { transform:translate(46px,0); }
    .reveal.in { opacity:1; transform:none; }
    @media (prefers-reduced-motion: reduce) {
      .reveal { opacity:1; transform:none; transition:none; }
    }

    /* --- sections fonctionnalites, alternees gauche/droite --- */
    .fonctions { max-width:1000px; margin:0 auto; padding:20px 24px 40px; display:flex; flex-direction:column; gap:6px; }
    .feature-row { display:flex; align-items:center; gap:52px; padding:44px 0; }
    .feature-row.reverse { flex-direction:row-reverse; }
    .feature-row + .feature-row { border-top:1px solid #eceae4; }
    .feature-visual { flex:0 0 160px; width:160px; height:160px; border-radius:28px; background:#fff;
                       border:1px solid #eceae4; display:flex; align-items:center; justify-content:center;
                       box-shadow:0 14px 30px rgba(18,41,31,.06); }
    .feature-visual .ic-wrap { margin-bottom:0; transform:scale(2.5); }
    .feature-text { flex:1; }
    .feature-text .num { font-size:13px; font-weight:700; color:#c9922f; letter-spacing:.05em; }
    .feature-text h3 { font-size:22px; margin:8px 0 10px; color:#12291f; }
    .feature-text .lead { color:#374151; font-weight:600; margin:0 0 8px; }
    .feature-text p { color:#6b7280; font-size:15px; line-height:1.75; margin:0 0 8px; }

    /* --- notre histoire --- */
    .histoire { max-width:980px; margin:0 auto; padding:60px 24px 76px; display:flex; gap:48px; align-items:center; }
    .histoire-photo { flex:0 0 220px; }
    .histoire-photo img, .avatar-secours { width:220px; height:220px; border-radius:24px; object-fit:cover; display:block; }
    .avatar-secours { display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#12291f,#2f5943);
                       color:#e9c46a; font-size:46px; font-weight:700; }
    .histoire-texte .eyebrow { color:#c9922f; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.07em; }
    .histoire-texte h2 { font-size:28px; margin:8px 0 16px; color:#12291f; }
    .histoire-texte .nom { font-weight:700; margin:0; color:#12291f; font-size:15px; }
    .histoire-texte .role { color:#6b7280; font-size:13px; margin:2px 0 16px; }
    .histoire-texte p { color:#4b5563; line-height:1.75; margin:0 0 12px; }

    .formules { max-width:1140px; margin:0 auto; padding:0 24px 72px; text-align:center; }
    .formules h2 { font-size:30px; margin:0 0 8px; color:#12291f; }
    .st { color:#6b7280; margin:0 0 34px; }
    .grille { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:18px; text-align:left; }
    .f { position:relative; background:#fff; border:1px solid #eceae4; border-radius:16px; padding:28px 24px; display:flex; flex-direction:column; }
    .f.phare { border:2px solid #12291f; }
    .ruban { position:absolute; top:-11px; left:50%; transform:translateX(-50%); background:#12291f; color:#e9c46a;
             padding:3px 12px; border-radius:99px; font-size:11px; white-space:nowrap; }
    .f h3 { margin:0 0 10px; font-size:17px; }
    .prix strong { font-size:30px; color:#12291f; } .prix span { color:#9ca3af; font-size:13px; }
    .q { color:#6b7280; font-size:13px; margin:8px 0 16px; }
    ul { list-style:none; padding:0; margin:0 0 22px; flex:1; }
    li { font-size:14px; padding:5px 0 5px 20px; position:relative; color:#374151; }
    li::before { content:'✓'; position:absolute; left:0; color:#16a34a; }

    .fin { background:#12291f; color:#fff; text-align:center; padding:64px 24px; }
    .fin h2 { font-size:30px; margin:0 0 10px; }
    .fin p { color:#9db3a8; margin:0 0 26px; }

    .pied { display:flex; justify-content:space-between; max-width:1140px; margin:0 auto;
            padding:24px; font-size:13px; color:#9ca3af; }
    .pied a { color:#6b7280; text-decoration:none; }

    @media (max-width:720px) {
      .mini-icones { gap:20px; }
      .mini { width:80px; }
      .feature-row, .feature-row.reverse { flex-direction:column; text-align:center; gap:24px; }
      .histoire { flex-direction:column; text-align:center; }
    }
  `],
})
export class Accueil implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  photoOk = true;

  atouts = [
    { type: 'book', titre: 'Contrats en un clic', texte: "Generez le bail au nom de votre agence, pret a signer.",
      detail: "Fini les modeles Word retapes a chaque nouveau locataire. Renseignez les informations une seule fois : le contrat se genere automatiquement avec le logo et les coordonnees de votre agence, pret a etre signe et archive." },
    { type: 'coin', titre: 'Loyers suivis', texte: 'Voyez qui a paye, qui est en retard, et depuis combien de temps.',
      detail: "Chaque loyer encaisse est rattache au bon logement et au bon locataire. Vous savez en un coup d'oeil qui est a jour et qui accumule du retard, sans ressortir un seul cahier." },
    { type: 'receipt', titre: 'Quittances automatiques', texte: 'Chaque paiement genere sa quittance PDF numerotee.',
      detail: "Des qu'un paiement est enregistre, la quittance PDF est generee et numerotee automatiquement, prete a etre envoyee ou imprimee. Un vrai gain de temps a chaque fin de mois." },
    { type: 'house', titre: 'Vitrine en ligne', texte: 'Vos logements disponibles, visibles par vos futurs locataires.',
      detail: "Vos logements disponibles sont visibles en ligne avec photos et details, accessibles a tout futur locataire meme en dehors des heures de bureau. Votre agence continue de prospecter pendant que vous dormez." },
    { type: 'bell', titre: 'Reclamations centralisees', texte: 'Vos locataires signalent, vous suivez le traitement.',
      detail: "Un robinet qui fuit, une serrure bloquee : vos locataires signalent le probleme depuis leur espace, et vous suivez chaque reclamation jusqu'a sa resolution, sans message perdu dans WhatsApp." },
    { type: 'chart', titre: 'Statistiques reelles', texte: 'Taux de recouvrement, occupation, revenus par immeuble.',
      detail: "Taux de recouvrement, occupation par immeuble, revenus mensuels : les chiffres qui comptent pour votre agence sont calcules automatiquement et mis a jour en temps reel." },
  ];

  formules = [
    { cle: 'starter', nom: 'Standard', prix: '10 000', quota: "Jusqu'a 2 logements",
      atouts: ['Contrats et baux', 'Suivi des loyers', 'Quittances PDF', 'Vitrine en ligne'] },
    { cle: 'pro', nom: 'Pro', prix: '25 000', quota: "Jusqu'a 6 logements", phare: true,
      atouts: ['Tout le Standard', 'Statistiques avancees', 'Plusieurs utilisateurs', 'Support prioritaire'] },
    { cle: 'illimite', nom: 'VIP', prix: '50 000', quota: 'Logements illimites',
      atouts: ['Tout le Pro', 'Annonces mises en avant', 'Accompagnement dedie'] },
  ];

  ngAfterViewInit() {
    const root = this.el.nativeElement as HTMLElement;
    const items = root.querySelectorAll<HTMLElement>('.reveal');
    this.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          this.observer?.unobserve(entry.target);
        }
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    items.forEach((item) => this.observer!.observe(item));
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  // Defilement explicite vers une section : le href="#id" reste en repli
  // (accessibilite, clic droit "ouvrir dans un nouvel onglet"), mais on
  // pilote nous-memes le scroll pour ne pas dependre du comportement natif
  // du navigateur, peu fiable dans une SPA avec routing.
  allerA(id: string, event: Event): void {
    const cible = (this.el.nativeElement as HTMLElement).querySelector('#' + id);
    if (!cible) return;
    event.preventDefault();
    cible.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#' + id);
  }
}
