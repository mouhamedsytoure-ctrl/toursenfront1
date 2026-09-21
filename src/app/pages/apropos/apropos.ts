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
          Gérer un immeuble à Dakar, ça peut vite tourner à la course : papiers
          égarés, appels qui restent sans réponse, quittance griffonnée sur un
          bout de papier. <b>SITS</b> (Société Immobilière de Travaux et Services)
          a été créée pour éviter tout ça. Ici, chaque immeuble, appartement,
          studio, local commercial ou terrain est suivi sérieusement, du jour où
          le locataire s'installe jusqu'au renouvellement de son bail.
        </p>
        <p>
          L'agence est dirigée par <b>Moustapha Touré</b>, avec une idée assez
          simple en tête : un propriétaire doit savoir où en est son bien, et un
          locataire doit pouvoir joindre quelqu'un facilement. Contrats clairs,
          quittances en règle, loyers suivis de près, réclamations traitées
          rapidement. C'est ce qui a fait la réputation de SITS depuis le début.
        </p>
        <p>
          Cette application n'est que le prolongement de cette façon de
          travailler. Les paiements sont enregistrés au fur et à mesure, les
          contrats et les reçus partent par email automatiquement, et une
          vitrine en ligne permet de voir les logements encore disponibles.
          Rien de plus : juste un moyen de garder la confiance entre SITS, ses
          propriétaires et ses locataires, sur des faits plutôt que sur des
          promesses.
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
