import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-reinitialiser-mot-de-passe',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
  <div class="login-wrap">
    <div class="login-card">
      <a class="logobox" routerLink="/accueil"><img src="/logo-sunnu-immo.jpeg" alt="Sunnu Immo"/></a>
      <p class="sub">Nouveau mot de passe</p>

      @if (!token || !email) {
        <p class="aide err-txt">Ce lien de reinitialisation est invalide. Demandez-en un nouveau.</p>
      } @else if (reussi()) {
        <p class="aide ok">Mot de passe reinitialise. Vous pouvez vous connecter.</p>
      } @else {
        <label>Nouveau mot de passe</label>
        <input class="input" type="password" [(ngModel)]="password" placeholder="8 caracteres minimum" autocomplete="new-password"/>

        <label>Confirmer le mot de passe</label>
        <input class="input" type="password" [(ngModel)]="confirmation" (keyup.enter)="valider()" placeholder="8 caracteres minimum" autocomplete="new-password"/>

        @if (erreur()) { <div class="err">{{ erreur() }}</div> }

        <button class="btn btn-ink full" [disabled]="loading()" (click)="valider()">
          {{ loading() ? 'Enregistrement...' : 'Reinitialiser le mot de passe' }}
        </button>
      }

      <a class="vitrine-lien" routerLink="/login">← Retour a la connexion</a>
    </div>
  </div>
  `,
  styles: [`
    .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, var(--ink) 0%, #1a2e28 100%); padding: 24px; }
    .login-card { width: 100%; max-width: 400px; background: #fff; border-radius: 20px; padding: 32px 28px;
      box-shadow: 0 20px 60px rgba(0,0,0,.35); }
    .sub { text-align: center; margin: 0 0 20px; color: var(--muted); font-size: 14px; }
    .aide { color: var(--muted); font-size: 13.5px; line-height: 1.6; margin: 0 0 18px; text-align: center; }
    .aide.ok { color: var(--ok); }
    .aide.err-txt { color: var(--bad); }
    label { display: block; font-size: 13px; color: var(--muted); margin: 14px 0 6px; font-weight: 600; }
    .full { width: 100%; margin-top: 22px; }
    .err { color: var(--bad); margin-top: 12px; font-size: 13px; background: #fff0f0; padding: 10px 12px; border-radius: 10px; }
    .vitrine-lien { display:block; text-align:center; margin-top:20px; color:var(--gold); text-decoration:none; font-weight:600; font-size:14px; }
    .vitrine-lien:hover { text-decoration: underline; }
    .logobox { display:block; text-align:center; margin-bottom:10px; }
    .logobox img { max-width:200px; width:55%; height:auto; border-radius:18px; box-shadow:0 10px 26px rgba(0,0,0,.18); }
  `],
})
export class ReinitialiserMotDePasse {
  token: string | null = null;
  email: string | null = null;
  password = '';
  confirmation = '';
  loading = signal(false);
  erreur = signal<string | null>(null);
  reussi = signal(false);

  constructor(private auth: AuthService, private router: Router, route: ActivatedRoute) {
    this.token = route.snapshot.queryParamMap.get('token');
    this.email = route.snapshot.queryParamMap.get('email');
  }

  async valider() {
    if (this.password.length < 8) { this.erreur.set('8 caracteres minimum.'); return; }
    if (this.password !== this.confirmation) { this.erreur.set('Les mots de passe ne correspondent pas.'); return; }
    this.erreur.set(null);
    this.loading.set(true);
    try {
      await this.auth.reinitialiserMotDePasse({
        token: this.token!, email: this.email!,
        password: this.password, password_confirmation: this.confirmation,
      });
      this.reussi.set(true);
      setTimeout(() => this.router.navigateByUrl('/login'), 2500);
    } catch (e: any) {
      this.erreur.set(e?.error?.message || e?.error?.errors?.email?.[0] || 'Reinitialisation impossible.');
    } finally {
      this.loading.set(false);
    }
  }
}
