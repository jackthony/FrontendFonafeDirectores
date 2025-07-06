import { CommonModule } from '@angular/common';
import { Component, Inject, inject, Output, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'app-session-warning',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatProgressBarModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './session-warning.component.html',
    styleUrl: './session-warning.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class SessionWarningComponent {
	private dialogRef = inject(MatDialogRef<SessionWarningComponent>);

  readonly intervalMs = 1000;
  timeLeft!: number;
  initialTime!: number;
  percentage = 100;

  private intervalId!: ReturnType<typeof setInterval>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { remaining: number }) {
    this.initialTime = data.remaining;
    this.timeLeft = data.remaining;
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.timeLeft -= this.intervalMs;

      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.percentage = 0;
        this.dialogRef.close(); // Tiempo agotado
        return;
      }

      this.percentage = (this.timeLeft / this.initialTime) * 100;
    }, this.intervalMs);
  }

  stay(): void {
    this.dialogRef.close(true); // Usuario desea permanecer
  }

  logOut(): void {
    this.dialogRef.close(false); // Usuario desea cerrar sesión
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
