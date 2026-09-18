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
    <h1 class="ptitle">Guide d'utilisation — Super Admin</h1>
    <p class="lede">Tout ce que vous pouvez faire dans SITS, étape par étape.</p>

    <div class="chips">
      @for (s of sections; track s.id) {
        <button (click)="aller(s.id)">{{ s.num }} · {{ s.titre }}</button>
      }
    </div>

    @for (s of sections; track s.id) {
      <div class="card sec" [id]="s.id">
        <div class="sec-head"><span class="num">{{ s.num }}</span><h2>{{ s.titre }}</h2></div>

        @if (s.chemin) { <div class="chemin">{{ s.chemin }}</div> }

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

    .chemin{background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:8px 12px;font-size:13px;color:var(--ink2);margin-bottom:12px;font-weight:600}

    .etapes{list-style:none;margin:0;padding:0;counter-reset:step}
    .etapes li{counter-increment:step;position:relative;padding:0 0 12px 32px;font-size:13.6px;color:var(--ink2);line-height:1.5}
    .etapes li:last-child{padding-bottom:0}
    .etapes li::before{
      content:counter(step);position:absolute;left:0;top:-1px;width:21px;height:21px;border-radius:50%;
      background:var(--bg);border:1px solid var(--line);color:var(--gold);font-weight:700;font-size:11px;
      display:flex;align-items:center;justify-content:center;
    }
    .etapes li b{color:var(--ink)}
    .etapes li code, .extra code, .note code{background:var(--bg);border:1px solid var(--line);border-radius:5px;padding:1px 6px;font-size:.92em;color:var(--ink2)}

    .extra{font-size:13.6px;color:var(--ink2);margin:10px 0 0;line-height:1.5}

    .note{border-left:3px solid var(--gold);background:var(--bg);border-radius:0 8px 8px 0;padding:10px 14px;font-size:13px;color:var(--ink2);margin-top:14px;line-height:1.5}
    .note b{color:var(--ink)}
    .note.tip{border-left-color:var(--ok)}
    .note.warn{border-left-color:var(--warn)}
    .note.important{border-left-color:var(--bad)}

    .ref{width:100%;border-collapse:collapse;font-size:13px;margin-top:10px}
    .ref th{text-align:left;color:var(--muted);font-weight:600;font-size:11px;text-transform:uppercase;padding:0 8px 6px 0;border-bottom:1px solid var(--line)}
    .ref td{padding:8px 8px 8px 0;border-bottom:1px solid var(--line);color:var(--ink2);vertical-align:top}

    .fin{text-align:center;color:var(--muted);font-size:12px;margin-top:28px;padding-top:16px;border-top:1px solid var(--line)}
  `],
})
export class Guide {
  sections: Section[] = [
    {
      id: 'connexion', num: '01', titre: 'Se connecter',
      etapes: [
        { texte: "Ouvrez <b>sits-immo.com</b> dans votre navigateur." },
        { texte: "Saisissez votre email et votre mot de passe de super admin." },
        { texte: "Vous arrivez directement sur le tableau de bord." },
      ],
      note: { type: 'tip', texte: "<b>Astuce :</b> ajoutez la page à l'écran d'accueil de votre téléphone pour l'ouvrir comme une application." },
    },
    {
      id: 'tableau-de-bord', num: '02', titre: 'Le tableau de bord',
      extra: "Encaissé ce mois, attendu, taux d'occupation, impayés, réclamations ouvertes, nombre d'immeubles et de locataires — la situation en un coup d'œil dès la connexion.",
      note: { type: 'tip', texte: "<b>Impayés :</b> le mois où un locataire vient d'emménager n'est jamais compté comme impayé — il est déjà couvert par la caution versée à la signature. Voir section 04." },
    },
    {
      id: 'immeubles', num: '03', titre: 'Immeubles & logements',
      chemin: 'Immeubles → + Nouvel immeuble  ·  ouvrir un immeuble → + Logement',
      extra: "Renseignez nom/adresse/ville pour l'immeuble ; référence, étage, type et loyer pour chaque logement. Le statut d'un logement passe automatiquement à <b>Loué</b> dès qu'un contrat lui est associé, et repasse à <b>Disponible</b> à la résiliation.",
    },
    {
      id: 'nouveau-locataire', num: '04', titre: 'Ajouter un locataire',
      chemin: 'Contrats → + Nouveau contrat / locataire',
      etapes: [
        { texte: "Choisissez l'<b>immeuble</b>, l'<b>étage</b>, puis la <b>chambre</b> disponible." },
        { texte: "Remplissez l'identité. Seuls le <b>Nom</b> et l'<b>Email de contact</b> sont obligatoires — le reste peut être complété plus tard." },
        { texte: "Renseignez les <b>dates</b>, le <b>loyer</b> et le <b>jour d'échéance</b> (5 par défaut). La <b>caution se calcule automatiquement</b> à 3× le loyer, modifiable." },
        { texte: "Cliquez <b>« Créer le contrat »</b>." },
      ],
      note: { type: 'tip', texte: "Un identifiant (<code>prenom.nom&#64;sits.sn</code>) et le mot de passe provisoire <code>passer</code> sont générés automatiquement. Un email de bienvenue part vers l'<b>email de contact</b>, avec ces identifiants et le contrat en PDF joint." },
    },
    {
      id: 'identifiants', num: '04b', titre: 'Identifiant ≠ email de contact',
      extra: "<b>Email de contact</b> (saisi par vous) : reçoit tous les messages — bienvenue, reçus, contrat. C'est la vraie adresse du locataire.<br><b>Identifiant de connexion</b> (généré) : sert uniquement à se connecter à l'application, ce n'est pas une boîte mail réelle.<br><br><b>Locataire déjà en place depuis longtemps ?</b> Même formulaire, avec sa <b>vraie date de début</b> (même ancienne). Comme ce n'est pas le mois en cours, il est suivi normalement dès sa création (pas d'exemption « mois d'entrée »).",
    },
    {
      id: 'loyers', num: '05', titre: 'Suivre & confirmer les loyers',
      chemin: 'Menu → Loyers',
      etapes: [
        { texte: "Filtrez par <b>Tous / Non payés / Payés</b>, ou recherchez un nom." },
        { texte: "Sur la ligne du locataire, cliquez <b>« Confirmer le paiement »</b>." },
        { texte: "Indiquez le <b>montant</b> et le <b>mode</b> (espèces / Wave / Orange Money)." },
        { texte: "Validez." },
      ],
      note: { type: 'tip', texte: "Le statut passe à <b>Payé</b>, un reçu est généré, et l'email part automatiquement — un seul clic suffit. Si l'envoi échoue (pas d'email de contact), un bouton <b>« Renvoyer »</b> apparaît. Le mois d'entrée affiche une note grise à la place du badge « Non payé »." },
    },
    {
      id: 'annulation', num: '06', titre: 'Annuler un paiement',
      chemin: 'Loyers → sur un paiement confirmé → « Annuler ce paiement »',
      etapes: [
        { texte: "Le <b>motif est obligatoire</b> (au moins 5 caractères)." },
        { texte: "Confirmez." },
      ],
      note: { type: 'important', texte: "Un paiement annulé n'est <b>jamais supprimé</b> : motif, date et responsable restent tracés en base, même après un nouvel enregistrement pour la même période." },
    },
    {
      id: 'renouvellement', num: '07', titre: 'Renouveler un contrat',
      chemin: "Contrats → ouvrir le contrat → Renouvellement → « Renouveler »",
      etapes: [
        { texte: "Saisissez la <b>nouvelle date de fin</b>." },
        { texte: "Ajustez le <b>loyer</b>/<b>caution</b> si besoin (facultatif)." },
        { texte: "Confirmez." },
      ],
      note: { type: 'tip', texte: "Le locataire garde le <b>même compte</b> et tout son <b>historique de paiements</b> — seules la date de fin (et éventuellement le loyer/caution) changent." },
    },
    {
      id: 'acces', num: '08', titre: 'Mot de passe oublié',
      chemin: "Contrats → ouvrir le contrat → Accès du locataire → « Réinitialiser l'accès »",
      extra: "Réservé au Super Admin. Corrigez l'email de contact si besoin, confirmez : l'identifiant repart au format standard, le mot de passe redevient <code>passer</code>, et un email part automatiquement (affiché aussi à l'écran). Le contrat et l'historique de paiements ne sont jamais touchés.",
    },
    {
      id: 'fin-contrat', num: '09', titre: 'Résilier, bloquer, archiver',
      extra: `
        <table class="ref">
          <tr><th>Action</th><th>Effet</th></tr>
          <tr><td><b>Résilier</b></td><td>Met fin au contrat, libère le logement</td></tr>
          <tr><td><b>Bloquer</b></td><td>Désactive l'accès du locataire, sans toucher au contrat</td></tr>
          <tr><td><b>Archiver</b></td><td>Range le contrat hors des listes actives</td></tr>
        </table>`,
    },
    {
      id: 'equipe', num: '10', titre: 'Admins & secrétaires',
      chemin: 'Menu → Utilisateurs → + Nouvel admin',
      extra: "Renseignez nom/email/mot de passe, puis cochez module par module (Immeubles, Locataires, Loyers...) les droits <b>Voir / Créer / Modifier / Supprimer</b>. La réinitialisation d'accès d'un locataire reste réservée exclusivement au Super Admin.",
    },
    {
      id: 'reclamations', num: '11', titre: 'Réclamations',
      chemin: 'Menu → Réclamations',
      extra: "Consultez l'objet, la description et la priorité (basse/normale/haute) de chaque réclamation envoyée par un locataire, puis faites évoluer son statut jusqu'à résolution.",
    },
    {
      id: 'emails', num: '12', titre: 'Comment partent les emails',
      extra: `
        <table class="ref">
          <tr><th>Événement</th><th>Contenu envoyé</th></tr>
          <tr><td>Création d'un locataire</td><td>Bienvenue + identifiant + mot de passe + contrat PDF</td></tr>
          <tr><td>Paiement confirmé</td><td>Reçu du mois + lien vers l'onglet Paiements</td></tr>
          <tr><td>Réinitialisation d'accès</td><td>Nouveaux identifiants</td></tr>
        </table>`,
      note: { type: 'tip', texte: "Tout part depuis <code>no-reply&#64;sits-immo.com</code>, un domaine vérifié qui vous appartient." },
    },
    {
      id: 'faq', num: '13', titre: 'Pense-bête',
      extra: `
        <b>Locataire qui a perdu son mot de passe « passer » ?</b> Section 08.<br><br>
        <b>Un logement reste « Loué » après un départ ?</b> Vérifiez que le contrat a bien été résilié (section 09).<br><br>
        <b>Un impayé apparaît alors qu'il ne devrait pas ?</b> Vérifiez la date de début du contrat concerné.<br><br>
        <b>Avertissement de sécurité du navigateur ?</b> Vérifiez que vous êtes bien sur <code>sits-immo.com</code>.`,
    },
  ];

  aller(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
