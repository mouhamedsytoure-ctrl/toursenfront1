import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './inscription.html',
  styleUrl: './inscription.scss',
})
export class Inscription {
  agenceNom = '';
  agenceSlug = '';
  slugModifieManuellement = false;
  agenceTelephone = '';
  agenceVille = '';
  adminNom = '';
  adminEmail = '';
  adminPassword = '';
  adminTelephone = '';
  showPwd = false;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private auth: AuthService, private router: Router) {}

  // Propose un slug a partir du nom de l'agence tant que l'utilisateur ne l'a pas modifie lui-meme
  onNomChange(): void {
    if (this.slugModifieManuellement) return;
    this.agenceSlug = this.slugify(this.agenceNom);
  }

  onSlugChange(): void {
    this.slugModifieManuellement = true;
    this.agenceSlug = this.slugify(this.agenceSlug);
  }

  private slugify(v: string): string {
    // Enleve les accents (decompose puis filtre les marques diacritiques), garde a-z0-9 et tirets
    const sansAccents = v.toLowerCase().trim().normalize('NFD')
      .split('')
      .filter(ch => { const c = ch.charCodeAt(0); return c < 0x0300 || c > 0x036f; })
      .join('');
    return sansAccents.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  async submit() {
    this.error.set(null);
    this.loading.set(true);
    try {
      await this.auth.register({
        agence_nom: this.agenceNom.trim(),
        agence_slug: this.agenceSlug.trim(),
        agence_telephone: this.agenceTelephone.trim() || undefined,
        agence_ville: this.agenceVille.trim() || undefined,
        admin_nom: this.adminNom.trim(),
        admin_email: this.adminEmail.trim(),
        admin_password: this.adminPassword,
        admin_telephone: this.adminTelephone.trim() || undefined,
      });
      this.router.navigate(['/app']);
    } catch (e: any) {
      const errs = e?.error?.errors;
      const msg = e?.error?.message
        || (errs ? (Object.values(errs)[0] as string[])?.[0] : null)
        || 'Inscription impossible. Verifiez les informations ou reessayez.';
      this.error.set(msg);
    } finally {
      this.loading.set(false);
    }
  }
}
