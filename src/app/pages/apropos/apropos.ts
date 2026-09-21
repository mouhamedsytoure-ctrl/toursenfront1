import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-apropos',
  standalone: true,
  template: `
    <header class="top">
      <button class="back" (click)="retour()">← Retour</button>
      <span class="ttl">À propos</span>
    </header>

    <div class="wrap">
      <div class="logobox"><img [src]="logo" alt="SITS"/></div>

      <h1>Société Immobilière de Travaux et Services</h1>
      <p class="baseline">« SITS » SUARL</p>

      <div class="card">
        <p>
          À Dakar, la gestion d'un bien immobilier rime trop souvent avec paperasse
          égarée, appels sans réponse et quittances griffonnées à la main. C'est
          précisément ce que <b>SITS</b> (Société Immobilière de Travaux et Services)
          a voulu changer : une gestion locative sérieuse, où chaque immeuble,
          appartement, studio, local commercial ou terrain est suivi avec la même
          rigueur, du premier jour de location jusqu'au renouvellement du bail.
        </p>
        <p>
          Fondée et dirigée par <b>Moustapha Touré</b>, l'agence s'est bâtie sur une
          conviction simple : un propriétaire mérite de savoir exactement où en est
          son bien, et un locataire mérite un interlocuteur clair et joignable.
          Contrats limpides, quittances en règle, loyers suivis de près, réclamations
          traitées sans délai — c'est cette exigence qui fait la réputation de SITS
          depuis ses débuts.
        </p>
        <p>
          Cette plateforme prolonge cette même exigence dans le numérique : chaque
          paiement est enregistré et confirmé en temps réel, chaque contrat et chaque
          reçu partent automatiquement par email, et une vitrine en ligne permet de
          découvrir à tout moment les logements disponibles — pour que la confiance
          entre SITS, ses propriétaires et ses locataires se construise sur des faits,
          pas sur des promesses.
        </p>
      </div>

      <div class="card coords">
        <h3>Coordonnées</h3>
        <p>📍 Médina, rue 13 X 12, Dakar, Sénégal</p>
        <p>📞 77 566 03 77 / 77 735 37 72</p>
        <p>✉️ sitssuarl&#64;gmail.com</p>
      </div>

      <p class="credit">
        Site développé par <b>Mouhamed Sy Touré</b>
        · <a href="mailto:mouhamedsy.toure&#64;uahb.sn">mouhamedsy.toure&#64;uahb.sn</a>
        · <a href="https://www.linkedin.com/in/mouhamed-sy-toure-17bbb4385" target="_blank" rel="noopener">LinkedIn</a>
      </p>
    </div>
  `,
  styles: [`
    :host{display:block;min-height:100vh;background:var(--bg)}
    .top{display:flex;align-items:center;gap:14px;background:var(--ink);color:#fff;padding:12px 18px}
    .back{background:none;border:none;color:#fff;font-size:15px;cursor:pointer;font-weight:600}
    .ttl{font-weight:bold}
    .wrap{max-width:760px;margin:0 auto;padding:24px 16px;text-align:center}
    .logobox{background:#fff;border-radius:14px;padding:14px;display:inline-block;margin-bottom:14px}
    .logobox img{max-height:70px}
    h1{color:var(--ink);margin:6px 0 2px;font-size:22px}
    .baseline{color:var(--gold);font-weight:600;margin:0 0 18px}
    .card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:18px;text-align:left;margin-bottom:14px}
    .card p{color:var(--ink);line-height:1.6;margin:0 0 10px}
    .coords h3{color:var(--ink);margin:0 0 8px}
    .coords p{margin:4px 0;color:var(--ink)}
    .credit{color:var(--muted);font-size:12px;margin-top:6px}
    .credit a{color:var(--gold);font-weight:600;text-decoration:none}
    .credit a:hover{text-decoration:underline}
  `],
})
export class Apropos {
  logo = new URL(environment.apiUrl).origin + '/logo-toursen.jpeg';
  constructor(private location: Location) {}
  retour() { this.location.back(); }
}
