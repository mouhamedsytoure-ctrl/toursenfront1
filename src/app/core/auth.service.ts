import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AppAgence {
  nom: string;
  slug: string;
  logo: string | null;
  telephone: string | null;
  ville: string | null;
  plan: string;
  plan_souhaite: string | null;
  statut: string;
  active: boolean;
  essai_termine_le: string | null;
  jours_restants: number | null;
  quota_logements: number;
  nb_logements: number;
  max_utilisateurs: number;
  nb_utilisateurs: number;
}

export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'locataire' | string;
  telephone?: string | null;
  agence_id?: number | null;
  is_platform_admin?: boolean;
  agence?: AppAgence | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _user = signal<AppUser | null>(this.readUser());

  token = computed(() => this._token());
  user = computed(() => this._user());
  isAuthenticated = computed(() => !!this._token());
  role = computed(() => this._user()?.role ?? '');
  agence = computed(() => this._user()?.agence ?? null);

  constructor(private http: HttpClient) {}

  private readUser(): AppUser | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  private setSession(res: { token: string; user: AppUser }): void {
    this._token.set(res.token);
    this._user.set(res.user);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
  }

  async login(email: string, password: string): Promise<void> {
    const res: any = await firstValueFrom(
      this.http.post(`${environment.apiUrl}/login`, { email, password })
    );
    this.setSession(res);
  }

  async register(data: {
    agence_nom: string; agence_slug: string; agence_telephone?: string; agence_ville?: string;
    plan_souhaite?: string;
    admin_nom: string; admin_email: string; admin_password: string; admin_telephone?: string;
  }): Promise<void> {
    const res: any = await firstValueFrom(
      this.http.post(`${environment.apiUrl}/register`, data)
    );
    this.setSession(res);
  }

  // Recharge le bloc agence (quota, nb utilisateurs, jours restants) depuis /me.
  // A appeler quand on entre dans l'espace de gestion, pour ne pas afficher
  // des chiffres d'usage perimes depuis la connexion.
  async rafraichirAgence(): Promise<void> {
    try {
      const res: any = await firstValueFrom(this.http.get(`${environment.apiUrl}/me`));
      const courant = this._user();
      if (courant && res?.agence !== undefined) {
        const maj = { ...courant, agence: res.agence };
        this._user.set(maj);
        localStorage.setItem('user', JSON.stringify(maj));
      }
    } catch {
      // silencieux : le bandeau garde les dernieres donnees connues
    }
  }

  logout(): void {
    this._token.set(null);
    this._user.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
