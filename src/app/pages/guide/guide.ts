import { Component } from '@angular/core';

interface Etape { texte: string; }
interface Section {
  id: string;
  num: string;
  titre: string;
  chemin?: string;
  etapes?: Etape[];
  note?: { type: 'tip' | 'warn' | 'important'; texte: string };
  extra?: string;
}

@Component({
  selector: 'app-guide',
  standalone: true,
  template: `
    <h1 class="ptitle">Guide — comment utiliser l'application</h1>
    <p class="lede">Pas de jargon. Juste ce que vous devez cliquer, dans l'ordre, avec un exemple concret à chaque fois.</p>

    <div class="chips">
      @for (s of sections; track s.id) {
        <button (click)="aller(s.id)">{{ s.num }} · {{ s.titre }}</button>
      }
    </div>

    @for (s of sections; track s.id) {
      <div class="card sec" [id]="s.id">
        <div class="sec-head"><span class="num">{{ s.num }}</span><h2>{{ s.titre }}</h2></div>

        @if (s.chemin) { <div class="chemin">👉 {{ s.chemin }}</div> }

        @if (s.etapes) {
          <ol class="etapes">
            @for (e of s.etapes; track e.texte) { <li [innerHTML]="e.texte"></li> }
          </ol>
        }

        @if (s.extra) { <p class="extra" [innerHTML]="s.extra"></p> }

        @if (s.note) {
          <div class="note" [class.tip]="s.note.type==='tip'" [class.warn]="s.note.type==='warn'" [class.important]="s.note.type==='important'" [innerHTML]="s.note.texte"></div>
        }
      </div>
    }

    <div class="fin">SITS — Société Immobilière de Travaux et Services</div>
  `,
  styles: [`
    .ptitle{color:var(--ink);margin:0 0 4px}
    .lede{color:var(--muted);margin:0 0 18px;font-size:14.5px}
    .chips{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;position:sticky;top:0;background:var(--bg);padding:8px 0;z-index:5}
    .chips button{border:1px solid var(--line);background:#fff;border-radius:99px;padding:7px 14px;cursor:pointer;color:var(--ink);font-size:12.5px}
    .chips button:hover{border-color:var(--gold)}

    .sec{margin-bottom:16px;scroll-margin-top:64px}
    .sec-head{display:flex;align-items:baseline;gap:10px;margin-bottom:10px}
    .num{color:var(--gold);font-weight:700;font-size:14px}
    .sec-head h2{margin:0;font-size:17px;color:var(--ink)}

    .chemin{background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:9px 12px;font-size:13.5px;color:var(--ink);margin-bottom:12px;font-weight:600}

    .etapes{list-style:none;margin:0;padding:0;counter-reset:step}
    .etapes li{counter-increment:step;position:relative;padding:0 0 13px 32px;font-size:14px;color:var(--ink2);line-height:1.55}
    .etapes li:last-child{padding-bottom:0}
    .etapes li::before{
      content:counter(step);position:absolute;left:0;top:-1px;width:22px;height:22px;border-radius:50%;
      background:var(--bg);border:1px solid var(--line);color:var(--gold);font-weight:700;font-size:11.5px;
      display:flex;align-items:center;justify-content:center;
    }
    .etapes li b{color:var(--ink)}
    .etapes li code, .extra code, .note code{background:var(--bg);border:1px solid var(--line);border-radius:5px;padding:1px 6px;font-size:.92em;color:var(--ink2)}

    .extra{font-size:14px;color:var(--ink2);margin:10px 0 0;line-height:1.6}
    .extra .ex{display:block;background:var(--bg);border-left:3px solid var(--ink2);border-radius:0 8px 8px 0;padding:8px 12px;margin:10px 0;font-size:13.3px;color:var(--ink2)}

    .note{border-left:3px solid var(--gold);background:var(--bg);border-radius:0 8px 8px 0;padding:11px 14px;font-size:13.6px;color:var(--ink2);margin-top:14px;line-height:1.55}
    .note b{color:var(--ink)}
    .note.tip{border-left-color:var(--ok)}
    .note.warn{border-left-color:var(--warn)}
    .note.important{border-left-color:var(--bad)}

    .fin{text-align:center;color:var(--muted);font-size:12px;margin-top:28px;padding-top:16px;border-top:1px solid var(--line)}
  `],
})
export class Guide {
  sections: Section[] = [
    {
      id: 'connexion', num: '01', titre: 'Se connecter',
      etapes: [
        { texte: "Tapez <b>sits-immo.com</b> dans votre navigateur (Chrome, par exemple)." },
        { texte: "Mettez votre email et votre mot de passe, ceux que vous utilisez déjà." },
        { texte: "Vous arrivez sur la page d'accueil avec les chiffres du mois." },
      ],
      note: { type: 'tip', texte: "Sur téléphone : ouvrez le menu du navigateur (les 3 points) et choisissez « Ajouter à l'écran d'accueil ». Vous aurez une icône, comme une vraie application." },
    },
    {
      id: 'tableau-de-bord', num: '02', titre: 'La page d’accueil (tableau de bord)',
      extra: "C'est la première chose que vous voyez. Elle vous dit, pour le mois en cours : combien d'argent est déjà rentré, combien il en manque, combien de logements sont loués, et s'il y a des réclamations en attente.",
      note: { type: 'tip', texte: "Un locataire qui vient tout juste d'emménager <b>n'apparaît jamais</b> comme « n'a pas payé » — parce qu'à son arrivée, il a déjà donné une grosse somme (la caution) qui couvre ce premier mois. Voir la partie 4." },
    },
    {
      id: 'immeubles', num: '03', titre: 'Ajouter un immeuble ou une chambre',
      chemin: 'Menu Immeubles → bouton « + Nouvel immeuble »',
      extra: "Vous donnez le nom de l'immeuble et son adresse. Ensuite, vous entrez dedans et vous ajoutez chaque chambre/logement un par un, avec son loyer.",
      note: { type: 'tip', texte: "Dès qu'un locataire s'installe dans une chambre, elle passe automatiquement en « Loué ». Quand il part, elle redevient « Disponible » toute seule." },
    },
    {
      id: 'nouveau-locataire', num: '04', titre: 'Faire entrer un nouveau locataire',
      chemin: 'Menu Contrats → bouton « + Nouveau contrat / locataire »',
      etapes: [
        { texte: "Vous choisissez l'<b>immeuble</b>, puis l'<b>étage</b>, puis la <b>chambre libre</b>." },
        { texte: "Vous écrivez son <b>nom</b> et son <b>email</b> (le vrai, celui qu'il regarde). C'est tout ce qui est obligatoire — le reste (téléphone, métier, pièce d'identité...) peut attendre." },
        { texte: "Vous mettez la <b>date d'arrivée</b>, la <b>date de fin</b> du bail et le <b>loyer</b>. La caution se remplit toute seule (3 fois le loyer) — vous pouvez la changer si besoin." },
        { texte: "Vous cliquez <b>« Créer le contrat »</b>." },
      ],
      note: { type: 'tip', texte: "<span class='ex'>Exemple : vous ajoutez Kara Samb dans la chambre A2 à 125 000 FCFA. Kara reçoit tout de suite un email avec un identifiant pour se connecter, un mot de passe (« <code>passer</code> »), et son contrat en pièce jointe.</span> Cet identifiant n'est pas une vraie boîte mail — c'est juste pour se connecter à l'application. Les vrais messages arrivent sur l'email que vous avez écrit." },
    },
    {
      id: 'ancien-locataire', num: '05', titre: 'Ajouter un locataire déjà présent depuis longtemps',
      extra: "C'est exactement le même formulaire que la partie 4. La seule différence : vous mettez sa <b>vraie date d'arrivée</b>, même si c'était il y a 2 ou 3 ans.",
      note: { type: 'tip', texte: "<span class='ex'>Exemple : Moussa habite déjà dans l'immeuble depuis 2024. Vous le créez aujourd'hui avec la date de début « 2024 ». Comme ce n'est pas le mois en cours, l'application le suit normalement dès sa création — elle ne va pas attendre.</span>" },
    },
    {
      id: 'loyers', num: '06', titre: 'Confirmer qu’un locataire a payé',
      chemin: 'Menu Loyers',
      etapes: [
        { texte: "Vous cherchez le nom du locataire (ou vous filtrez sur « Non payés »)." },
        { texte: "Vous cliquez <b>« Confirmer le paiement »</b> sur sa ligne." },
        { texte: "Vous mettez le <b>montant</b> reçu et comment il a payé (espèces, Wave, Orange Money)." },
        { texte: "Vous validez." },
      ],
      note: { type: 'tip', texte: "C'est tout. La case passe en vert « Payé », et le reçu part tout seul par email au locataire. Un seul clic, rien d'autre à faire." },
    },
    {
      id: 'renvoyer-recu', num: '06b', titre: 'Si le reçu n’est pas parti',
      extra: "Un petit message « Reçu non envoyé » apparaît à côté du nom. C'est presque toujours parce que ce locataire n'a pas d'email enregistré. Allez corriger son email sur sa fiche, puis cliquez sur <b>« Renvoyer »</b>.",
    },
    {
      id: 'annulation', num: '07', titre: 'Annuler un paiement par erreur',
      chemin: 'Menu Loyers → sur le paiement concerné → « Annuler ce paiement »',
      etapes: [
        { texte: "Vous écrivez <b>pourquoi</b> vous annulez (obligatoire, quelques mots suffisent)." },
        { texte: "Vous confirmez." },
      ],
      note: { type: 'important', texte: "<span class='ex'>Exemple : vous vous êtes trompé de locataire. Vous annulez avec le motif « erreur, ce n'était pas la bonne personne ».</span> Rien n'est jamais effacé pour de vrai — l'application garde en mémoire qui a annulé, quand, et pourquoi. Personne ne peut faire disparaître un paiement sans laisser de trace." },
    },
    {
      id: 'renouvellement', num: '08', titre: 'Prolonger un bail qui se termine',
      chemin: "Menu Contrats → ouvrir le locataire → « Renouveler »",
      etapes: [
        { texte: "Vous mettez la <b>nouvelle date de fin</b>." },
        { texte: "Si le loyer change, vous le mettez à jour (sinon, laissez vide)." },
        { texte: "Vous confirmez." },
      ],
      note: { type: 'tip', texte: "Le locataire garde le même compte et tout ce qu'il a déjà payé reste dans son historique. Pas besoin de tout recréer." },
    },
    {
      id: 'acces', num: '09', titre: 'Un locataire a oublié son mot de passe',
      chemin: "Menu Contrats → ouvrir le locataire → « Réinitialiser l'accès »",
      extra: "Seul vous (le compte principal) pouvez faire ça — pas les autres membres de l'équipe. Vous cliquez, vous confirmez, et c'est réglé : un nouveau mot de passe (« <code>passer</code> ») part par email, et s'affiche aussi à l'écran pour vous.",
      note: { type: 'tip', texte: "Rien d'autre ne change : le contrat et tout l'historique des paiements du locataire restent intacts." },
    },
    {
      id: 'fin-contrat', num: '10', titre: 'Un locataire s’en va (ou pose problème)',
      extra: "Sur la fiche du contrat, 3 boutons :<br><br>— <b>Résilier</b> : le locataire est parti pour de bon. Sa chambre redevient disponible pour quelqu'un d'autre.<br>— <b>Bloquer</b> : il ne peut plus se connecter à l'application, mais son contrat reste actif (utile en cas de conflit, sans mettre fin au bail).<br>— <b>Archiver</b> : range le dossier de côté pour ne plus l'avoir dans les listes du quotidien.",
    },
    {
      id: 'equipe', num: '11', titre: 'Donner un accès à un secrétaire',
      chemin: 'Menu Utilisateurs → « + Nouvel admin »',
      extra: "Vous créez son compte (nom, email, mot de passe), puis vous cochez ce qu'il a le droit de faire, module par module : voir, créer, modifier, supprimer.",
      note: { type: 'tip', texte: "<span class='ex'>Exemple : votre secrétaire peut avoir le droit de confirmer les loyers, mais pas de supprimer un immeuble.</span> Réinitialiser l'accès d'un locataire reste réservé à vous seul, quoi qu'il arrive." },
    },
    {
      id: 'reclamations', num: '12', titre: 'Les réclamations des locataires',
      chemin: 'Menu Réclamations',
      extra: "Un locataire peut signaler un problème (robinet cassé, etc.) directement depuis son espace. Vous voyez la liste ici, avec la priorité qu'il a indiquée, et vous changez le statut au fur et à mesure que vous réglez le problème.",
    },
    {
      id: 'faq', num: '13', titre: 'Questions fréquentes',
      extra: `
        <b>Un locataire a perdu son mot de passe « passer » ?</b><br>Partie 9 — Réinitialiser l'accès.<br><br>
        <b>Une chambre reste marquée « Louée » alors que le locataire est parti ?</b><br>Vérifiez que vous avez bien cliqué « Résilier » sur son contrat (partie 10).<br><br>
        <b>Le tableau de bord dit qu'il y a un impayé qui n'en est pas un ?</b><br>Regardez la date d'arrivée du locataire dans son contrat — c'est elle qui décide si le mois compte ou pas.<br><br>
        <b>Chrome affiche un avertissement rouge « Dangereux » ?</b><br>Vérifiez bien l'adresse dans la barre du haut : elle doit être exactement <code>sits-immo.com</code>.`,
    },
  ];

  aller(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
