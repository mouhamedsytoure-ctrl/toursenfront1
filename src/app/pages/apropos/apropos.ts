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
          On n'est pas une grosse structure avec des bureaux un peu partout à
          Dakar. <b>SITS</b> (Société Immobilière de Travaux et Services), c'est
          avant tout <b>Moustapha Touré</b> et son équipe, qui s'occupent des
          immeubles, appartements, studios, locaux commerciaux et terrains qu'on
          nous confie. Du dépôt de garantie jusqu'au jour où le locataire s'en
          va, quelqu'un suit le dossier. Pas de papier qui traîne trois semaines
          dans un tiroir.
        </p>
        <p>
          L'idée de départ est simple, et franchement elle devrait l'être pour
          n'importe quelle agence. Si vous êtes propriétaire, vous devez pouvoir
          savoir où en est votre bien sans relancer dix fois. Si vous êtes
          locataire, vous devez pouvoir joindre quelqu'un, pas tomber sur une
          boîte vocale. Un contrat qu'on comprend en le lisant une fois, une
          quittance dès que le loyer est payé, une réclamation traitée dans la
          semaine : c'est comme ça qu'on travaille depuis le début.
        </p>
        <p>
          Cette application, c'est la continuité de tout ça en version
          numérique. Le paiement est enregistré le jour même, le contrat et le
          reçu arrivent par email sans que personne ait à y penser, et la
          vitrine en ligne montre ce qui est disponible à l'instant où vous
          regardez, pas la semaine dernière.
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
