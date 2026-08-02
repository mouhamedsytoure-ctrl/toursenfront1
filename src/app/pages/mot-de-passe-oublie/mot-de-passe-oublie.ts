import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-mot-de-passe-oublie',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
  <div class="login-wrap">
    <div class="login-card">
      <a class="logobox" routerLink="/accueil"><img src="/logo-sunnu-immo.jpeg" alt="Sunnu Immo"/></a>
      <p class="sub">Mot de passe oublie</p>

      @if (!envoye()) {
        <p class="aide">Indiquez l'email de votre compte, nous vous envoyons un lien pour choisir un nouveau mot de passe.</p>

        <label>Email</label>
        <input class="input" type="email" [(ngModel)]="email" (keyup.enter)="envoyer()" placeholder="email@exemple.com" autocomplete="email"/>

        @if (erreur()) { <div class="err">{{ erreur() }}</div> }

        <button class="btn btn-ink full" [disabled]="loading()" (click)="envoyer()">
          {{ loading() ? 'Envoi...' : 'Envoyer le lien' }}
        </button>
      } @else {
        <p class="aide ok">{{ message() }}</p>
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
    .aide { color: var(--muted); font-size: 13.5px; line-height: 1.6; margin: 0 0 18px; }
    .aide.ok { color: var(--ok); text-align: center; }
    label { display: block; font-size: 13px; color: var(--muted); margin: 14px 0 6px; font-weight: 600; }
    .full { width: 100%; margin-top: 22px; }
    .err { color: var(--bad); margin-top: 12px; font-size: 13px; background: #fff0f0; padding: 10px 12px; border-radius: 10px; }
    .vitrine-lien { display:block; text-align:center; margin-top:20px; color:var(--gold); text-decoration:none; font-weight:600; font-size:14px; }
    .vitrine-lien:hover { text-decoration: underline; }
    .logobox { display:block; text-align:center; margin-bottom:10px; }
    .logobox img { max-width:200px; width:55%; height:auto; border-radius:18px; box-shadow:0 10px 26px rgba(0,0,0,.18); }
  `],
})
export class MotDePasseOublie {
  email = '';
  loading = signal(false);
  erreur = signal<string | null>(null);
  envoye = signal(false);
  message = signal('');

  constructor(private auth: AuthService) {}

  async envoyer() {
    if (!this.email.trim()) { this.erreur.set('Entrez votre email.'); return; }
    this.erreur.set(null);
    this.loading.set(true);
    try {
      this.message.set(await this.auth.demanderReinitialisation(this.email.trim()));
      this.envoye.set(true);
    } catch (e: any) {
      this.erreur.set(e?.error?.message || 'Envoi impossible. Reessayez.');
    } finally {
      this.loading.set(false);
    }
  }
}
