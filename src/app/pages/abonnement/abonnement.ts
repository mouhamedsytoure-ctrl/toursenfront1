import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AbonnementService } from '../../core/abonnement.service';
import { AuthService } from '../../core/auth.service';

type Formule = { cle: string; nom: string; prix: number; logements: string; atouts: string[]; phare?: boolean };

@Component({
  selector: 'app-abonnement',
  standalone: true,
  template: `
  <div class="abo">
    <div class="tete">
      <span class="badge">{{ suspendu() ? 'Compte suspendu' : "Periode d'essai terminee" }}</span>
      <h1>{{ suspendu() ? 'Votre acces a ete suspendu' : 'Votre essai gratuit est termine' }}</h1>
      <p class="intro">
        @if (suspendu()) {
          Contactez-nous pour regulariser la situation et retrouver l'acces a votre espace.
        } @else {
          Vos donnees sont intactes et vous attendent. Choisissez une formule pour reprendre la gestion
          de {{ nomAgence() }}.
        }
      </p>
    </div>

    @if (!suspendu()) {
      <div class="formules">
        @for (f of formules; track f.cle) {
          <div class="f" [class.phare]="f.phare">
            @if (f.phare) { <span class="ruban">Le plus choisi</span> }
            <h2>{{ f.nom }}</h2>
            <div class="prix"><strong>{{ f.prix.toLocaleString('fr-FR') }}</strong><span> FCFA / mois</span></div>
            <p class="quota">{{ f.logements }}</p>
            <ul>
              @for (a of f.atouts; track a) { <li>{{ a }}</li> }
            </ul>
            <a class="btn" [href]="lienWhatsapp(f)" target="_blank" rel="noopener">Choisir {{ f.nom }}</a>
          </div>
        }
      </div>
    }

    <div class="contact">
      <h3>Comment regler</h3>
      <p>
        Envoyez le montant par <strong>Wave</strong> ou <strong>Orange Money</strong> au
        <strong>{{ tel }}</strong>, puis envoyez-nous la confirmation.
        Votre acces est reactive dans la journee.
      </p>
      <div class="actions">
        <a class="btn plein" [href]="'https://wa.me/' + telBrut" target="_blank" rel="noopener">Nous ecrire sur WhatsApp</a>
        <button class="btn" (click)="deconnexion()">Se deconnecter</button>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .abo { max-width:1000px; margin:0 auto; padding:48px 24px; }
    .tete { text-align:center; margin-bottom:36px; }
    .badge { display:inline-block; background:#fef3c7; color:#92400e; padding:5px 14px; border-radius:99px; font-size:13px; }
    h1 { font-size:30px; margin:14px 0 10px; }
    .intro { color:#6b7280; max-width:560px; margin:0 auto; line-height:1.6; }
    .formules { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:18px; margin-bottom:36px; }
    .f { position:relative; background:#fff; border:1px solid #e5e7eb; border-radius:16px; padding:26px 22px; display:flex; flex-direction:column; }
    .f.phare { border-color:#12291f; border-width:2px; }
    .ruban { position:absolute; top:-11px; left:50%; transform:translateX(-50%); background:#12291f; color:#e9c46a; padding:3px 12px; border-radius:99px; font-size:11px; white-space:nowrap; }
    .f h2 { font-size:17px; margin:0 0 10px; }
    .prix strong { font-size:30px; } .prix span { color:#9ca3af; font-size:13px; }
    .quota { color:#6b7280; font-size:13px; margin:8px 0 14px; }
    ul { list-style:none; padding:0; margin:0 0 20px; flex:1; }
    li { font-size:14px; padding:5px 0 5px 20px; position:relative; color:#374151; }
    li::before { content:'✓'; position:absolute; left:0; color:#16a34a; }
    .btn { display:inline-block; text-align:center; padding:11px 18px; border:1px solid #d1d5db; border-radius:10px;
           background:#fff; cursor:pointer; text-decoration:none; color:#111; font-size:14px; }
    .btn.plein { background:#12291f; color:#e9c46a; border-color:#12291f; }
    .contact { background:#fff; border:1px solid #e5e7eb; border-radius:16px; padding:26px; }
    .contact h3 { margin:0 0 10px; font-size:16px; }
    .contact p { color:#4b5563; line-height:1.7; margin:0 0 18px; }
    .actions { display:flex; gap:10px; flex-wrap:wrap; }
  `],
})
export class Abonnement {
  private abo = inject(AbonnementService);
  private auth = inject(AuthService);
  private router = inject(Router);

  tel = '77 791 76 09';
  telBrut = '221777917609';

  suspendu = computed(() => this.abo.blocage()?.motif === 'suspendu');
  nomAgence = computed(() => this.abo.blocage()?.agence?.nom || this.auth.agence()?.nom || 'votre agence');

  formules: Formule[] = [
    { cle: 'starter', nom: 'Standard', prix: 10000, logements: "Jusqu'a 2 logements",
      atouts: ['Gestion des contrats', 'Suivi des loyers', 'Quittances PDF', 'Votre vitrine en ligne'] },
    { cle: 'pro', nom: 'Pro', prix: 25000, logements: "Jusqu'a 6 logements", phare: true,
      atouts: ['Tout le Standard', 'Statistiques avancees', 'Comptes multi-utilisateurs', 'Support prioritaire'] },
    { cle: 'illimite', nom: 'VIP', prix: 50000, logements: 'Logements illimites',
      atouts: ['Tout le Pro', 'Mise en avant de vos annonces', 'Accompagnement dedie'] },
  ];

  lienWhatsapp(f: Formule): string {
    const txt = `Bonjour, je souhaite souscrire a la formule ${f.nom} pour ${this.nomAgence()}.`;
    return `https://wa.me/${this.telBrut}?text=${encodeURIComponent(txt)}`;
  }

  deconnexion() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
