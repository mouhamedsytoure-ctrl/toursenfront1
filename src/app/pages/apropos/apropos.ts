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

      <div class="credit">
        <p class="credit-label">Site développé par <b>Mouhamed Sy Touré</b></p>
        <div class="credit-links">
          <a class="clink" href="mailto:mouhamedsy.toure&#64;uahb.sn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
            <span>Email</span>
          </a>
          <a class="clink" href="https://www.linkedin.com/in/mouhamed-sy-toure-17bbb4385" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            <span>LinkedIn</span>
          </a>
          <a class="clink" href="https://github.com/mouhamedsytoure-ctrl" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
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
    .credit{margin-top:10px}
    .credit-label{color:var(--muted);font-size:12px;margin:0 0 10px}
    .credit-links{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
    .clink{
      display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:99px;
      border:1px solid var(--line);background:#fff;color:var(--ink);text-decoration:none;
      font-size:13px;font-weight:600;transition:border-color .15s,color .15s;
    }
    .clink svg{width:16px;height:16px;flex:none}
    .clink:hover{border-color:var(--gold);color:var(--gold)}
  `],
})
export class Apropos {
  logo = new URL(environment.apiUrl).origin + '/logo-toursen.jpeg';
  constructor(private location: Location) {}
  retour() { this.location.back(); }
}
