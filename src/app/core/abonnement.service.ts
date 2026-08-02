import { Injectable, signal } from '@angular/core';

export type MotifBlocage = 'essai_termine' | 'abonnement_expire' | 'suspendu_paiement' | 'suspendu_autre';

export type Blocage = {
  motif: MotifBlocage | string;
  message: string;
  note_suspension: string | null;
  agence: { nom: string; plan: string; statut: string; essai_termine_le: string | null } | null;
};

@Injectable({ providedIn: 'root' })
export class AbonnementService {
  /** Renseigne par l'intercepteur quand le back renvoie 402. */
  blocage = signal<Blocage | null>(null);

  /** Quota de logements atteint : bloque un formulaire, pas l'application. */
  quota = signal<{ message: string; quota: number } | null>(null);
}
