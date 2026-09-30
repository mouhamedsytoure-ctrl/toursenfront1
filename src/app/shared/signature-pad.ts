import { Component, ElementRef, EventEmitter, Output, ViewChild, signal, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-signature-pad',
  standalone: true,
  template: `
    <div class="signature-pad">
      <canvas #canvas class="signature-pad__canvas"
        (pointerdown)="commencer($event)"
        (pointermove)="dessiner($event)"
        (pointerup)="finir()"
        (pointerleave)="finir()">
      </canvas>
      @if (vide()) {
        <p class="signature-pad__hint">Signez ici avec le doigt ou la souris</p>
      }
      <div class="signature-pad__actions">
        <button type="button" class="btn ghost" (click)="effacer()">Effacer</button>
        <button type="button" class="btn btn-ink" [disabled]="vide()" (click)="valider()">
          Valider la signature
        </button>
      </div>
    </div>
  `,
  styles: [`
    .signature-pad{display:flex;flex-direction:column;gap:10px}
    .signature-pad__canvas{
      width:100%;height:170px;border:2px dashed var(--line);border-radius:12px;
      background:#fff;touch-action:none;cursor:crosshair;
    }
    .signature-pad__hint{text-align:center;color:var(--muted);font-size:13px;margin-top:-96px;pointer-events:none}
    .signature-pad__actions{display:flex;gap:10px;justify-content:flex-end}
    .ghost{background:#fff;border:1px solid var(--ink);color:var(--ink)}
  `],
})
export class SignaturePad implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() signed = new EventEmitter<string>();

  vide = signal(true);
  private ctx!: CanvasRenderingContext2D;
  private enTrain = false;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.scale(ratio, ratio);
    this.ctx.lineWidth = 2.2;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#111827';
  }

  private position(e: PointerEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  commencer(e: PointerEvent): void {
    this.enTrain = true;
    const { x, y } = this.position(e);
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  dessiner(e: PointerEvent): void {
    if (!this.enTrain) return;
    const { x, y } = this.position(e);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.vide.set(false);
  }

  finir(): void {
    this.enTrain = false;
  }

  effacer(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.vide.set(true);
  }

  valider(): void {
    if (this.vide()) return;
    this.signed.emit(this.canvasRef.nativeElement.toDataURL('image/png'));
  }
}
