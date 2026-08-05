import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-apropos',
  standalone: true,
  template: `
    <header class="top">
      <button class="back" (click)="retour()">← Retour</button>
      <span class="ttl">À propos de Sunnu Immo</span>
    </header>

    <div class="wrap">
      <div class="photobox">
        @if (photoOk) {
          <img src="/photo-fondateur.jpeg" alt="Mouhamed Sy Toure, fondateur de Sunnu Immo" (error)="photoOk = false">
        } @else {
          <div class="avatar-secours">MST</div>
        }
      </div>

      <h1>Mouhamed Sy Toure</h1>
      <p class="baseline">Fondateur de Sunnu Immo</p>

      <div class="card">
        <h3>Notre histoire</h3>
        <p>
          Tout est parti d'un constat simple : a Dakar comme ailleurs au Senegal, gerer des
          immeubles en location reste encore, pour beaucoup d'agences, une affaire de cahiers,
          de carnets de quittances manuscrites et de messages WhatsApp eparpilles pour suivre
          des dizaines de logements, de locataires et de paiements.
        </p>
        <p>
          Titulaire d'une Licence de l'Universite Amadou Hampathe Ba, j'ai observe ce quotidien
          de pres en echangeant avec plusieurs agences immobilieres de la place. Le meme probleme
          revenait a chaque fois : aucun outil simple, accessible depuis un telephone, pense pour
          la realite du terrain senegalais.
        </p>
        <p>
          C'est de ce constat qu'est ne <b>Sunnu Immo</b> — « notre immobilier » en wolof. Le nom
          porte l'intention du projet : donner aux agences senegalaises, petites comme grandes,
          un outil qui leur appartient vraiment, pense pour elles plutot qu'adapte tant bien que
          mal d'une solution etrangere.
        </p>
        <p>
          La plateforme telle que vous l'utilisez aujourd'hui est en ligne depuis le
          <b>1er aout 2026</b>, apres plusieurs mois de developpement et d'echanges avec de
          premieres agences partenaires. Depuis, elle continue d'evoluer chaque semaine —
          nouvelles fonctionnalites, corrections, ajustements — avec la meme motivation qu'au
          premier jour.
        </p>
      </div>

      <div class="card">
        <h3>Pourquoi Sunnu Immo</h3>
        <p>
          Sunnu Immo veut rendre la gestion locative aussi simple qu'un echange WhatsApp : suivre
          ses immeubles, encaisser les loyers, delivrer une quittance, gerer les contrats et
          presenter ses logements disponibles — le tout depuis un telephone, sans formation
          compliquee ni frais caches.
        </p>
        <p>
          Chaque agence qui rejoint Sunnu Immo dispose de son propre espace, entierement prive
          et securise, ainsi que d'une vitrine publique pour presenter ses biens aux futurs
          locataires. Faire gagner du temps a celles et ceux qui gerent des biens immobiliers au
          quotidien, voila ce qui motive chaque nouvelle version de la plateforme.
        </p>
      </div>

      <p class="note">Merci de faire confiance a Sunnu Immo.</p>
    </div>
  `,
  styles: [`
    :host{display:block;min-height:100vh;background:var(--bg)}
    .top{display:flex;align-items:center;gap:14px;background:var(--ink);color:#fff;padding:12px 18px}
    .back{background:none;border:none;color:#fff;font-size:15px;cursor:pointer;font-weight:600}
    .ttl{font-weight:bold}
    .wrap{max-width:760px;margin:0 auto;padding:32px 16px;text-align:center}
    .photobox{margin-bottom:16px}
    .photobox img,.avatar-secours{width:140px;height:140px;border-radius:24px;object-fit:cover;display:inline-block}
    .avatar-secours{display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--ink),#2f5943);color:var(--gold);font-size:36px;font-weight:700}
    h1{color:var(--ink);margin:6px 0 2px;font-size:22px}
    .baseline{color:var(--gold);font-weight:600;margin:0 0 22px}
    .card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:20px;text-align:left;margin-bottom:14px}
    .card h3{color:var(--ink);margin:0 0 12px}
    .card p{color:var(--ink);line-height:1.7;margin:0 0 12px}
    .card p:last-child{margin-bottom:0}
    .note{color:var(--muted);font-size:13px;margin-top:4px}
  `],
})
export class Apropos {
  photoOk = true;
  constructor(private location: Location) {}
  retour() { this.location.back(); }
}
