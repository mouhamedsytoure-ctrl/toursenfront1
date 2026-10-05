import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="wrap">
      <h3 class="ttl">Mon profil</h3>
      <p class="hint">Modifiez vos informations ou votre mot de passe. Laissez le mot de passe vide pour ne pas le changer.</p>

      <label class="flabel">Nom</label>
      <input class="input" [(ngModel)]="f.name"/>
      <label class="flabel">Email</label>
      <input class="input" [(ngModel)]="f.email"/>
      <label class="flabel">Téléphone</label>
      <input class="input" [(ngModel)]="f.telephone"/>
      <label class="flabel">Nouveau mot de passe</label>
      <input class="input" type="password" placeholder="Laisser vide pour ne pas changer" [(ngModel)]="f.password"/>
      <label class="flabel">Confirmer le nouveau mot de passe</label>
      <input class="input" type="password" placeholder="Retapez le mot de passe" [(ngModel)]="f.password_confirm"/>

      @if (error()) { <div class="err">{{ error() }}</div> }
      @if (ok()) { <div class="ok">{{ ok() }}</div> }

      <button class="btn btn-ink" [disabled]="saving()" (click)="save()">
        {{ saving() ? 'Enregistrement...' : 'Enregistrer' }}
      </button>

      @if (auth.role() === 'super_admin') {
        <h3 class="ttl" style="margin-top:28px">Code de suppression</h3>
        <p class="hint">Requis pour toute suppression définitive (contrat, logement, immeuble). Toi seul peux
          le changer, en connaissant le code actuel.</p>
        <label class="flabel">Code actuel</label>
        <input class="input" type="password" [(ngModel)]="codeForm.ancien"/>
        <label class="flabel">Nouveau code</label>
        <input class="input" type="password" [(ngModel)]="codeForm.nouveau"/>
        @if (codeErr()) { <div class="err">{{ codeErr() }}</div> }
        @if (codeOk()) { <div class="ok">{{ codeOk() }}</div> }
        <button class="btn btn-ink" [disabled]="codeSaving()" (click)="changerCode()">
          {{ codeSaving() ? 'Enregistrement...' : 'Changer le code' }}
        </button>
      }
    </div>
  `,
  styles: [`
    .wrap{max-width:420px}
    .ttl{color:var(--ink);margin:0 0 4px}
    .hint{color:var(--muted);font-size:12px;margin:0 0 14px}
    .input{margin-bottom:10px;width:100%}
    .flabel{display:block;font-size:12px;color:var(--muted);font-weight:600;margin:8px 0 4px}
    .err{color:var(--bad);margin:10px 0;font-size:13px}
    .ok{color:var(--ok);margin:10px 0;background:#E7F1EC;padding:10px;border-radius:10px;font-size:13px}
    .btn{margin-top:8px}
  `],
})
export class Profil implements OnInit {
  saving = signal(false);
  error = signal<string | null>(null);
  ok = signal<string | null>(null);

  f: any = { name: '', email: '', telephone: '', password: '', password_confirm: '' };

  codeForm = { ancien: '', nouveau: '' };
  codeSaving = signal(false);
  codeErr = signal<string | null>(null);
  codeOk = signal<string | null>(null);

  constructor(private api: Api, public auth: AuthService) {}

  ngOnInit() {
    const u = this.auth.user();
    this.f.name = u?.name || '';
    this.f.email = u?.email || '';
    this.f.telephone = u?.telephone || '';
  }

  async save() {
    this.error.set(null);
    this.ok.set(null);

    if (this.f.password && this.f.password !== this.f.password_confirm) {
      this.error.set('Les deux mots de passe ne correspondent pas.');
      return;
    }

    const body: any = { name: this.f.name, email: this.f.email, telephone: this.f.telephone };
    if (this.f.password) body.password = this.f.password;

    this.saving.set(true);
    try {
      const res: any = await this.api.put('/profil', body);
      this.auth.setUser(res.user);
      this.f.password = '';
      this.f.password_confirm = '';
      this.ok.set('Profil mis à jour.' + (body.password ? ' Nouveau mot de passe pris en compte.' : ''));
    } catch (e: any) {
      this.error.set(e?.error?.message || e?.error?.errors?.email?.[0] || 'Erreur lors de la mise à jour.');
    } finally { this.saving.set(false); }
  }

  async changerCode() {
    this.codeErr.set(null); this.codeOk.set(null);
    if (!this.codeForm.ancien || !this.codeForm.nouveau) {
      this.codeErr.set('Renseigne le code actuel et le nouveau.');
      return;
    }
    this.codeSaving.set(true);
    try {
      await this.api.put('/code-suppression', {
        ancien_code: this.codeForm.ancien, nouveau_code: this.codeForm.nouveau,
      });
      this.codeOk.set('Code de suppression mis à jour.');
      this.codeForm = { ancien: '', nouveau: '' };
    } catch (e: any) {
      this.codeErr.set(e?.error?.message || 'Mise à jour impossible.');
    } finally { this.codeSaving.set(false); }
  }
}
