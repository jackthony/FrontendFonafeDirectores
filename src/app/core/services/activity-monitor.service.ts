import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../modules/user/auth/domain/services/auth.service';
import { Router } from '@angular/router';
import { ACTIVITY_MONITOR_CONFIG } from '../config/activity-monitor.config';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ActivityMonitorService {
  private router = inject(Router);
	private _maxIdleTime: number = ACTIVITY_MONITOR_CONFIG.IDLE_TIMEOUT;
	private currentIntervalMs = ACTIVITY_MONITOR_CONFIG.LOW_FREQ_INTERVAL;

	private _idleSubject = new BehaviorSubject<boolean>(false);
	private resetTimeout: ReturnType<typeof setInterval>;
	private warningShown = false;
	private dialog = inject(MatDialog);
	private alreadyLoggedOut = signal<boolean>(false);

	constructor(private authService: AuthService) {}

	// ✅ Método público para iniciar el monitoreo
	public start(): void {
		this.alreadyLoggedOut.set(false);
		this._maxIdleTime = ACTIVITY_MONITOR_CONFIG.IDLE_TIMEOUT;
		this.warningShown = false;
		this.clearTimeout();
		this.currentIntervalMs = ACTIVITY_MONITOR_CONFIG.LOW_FREQ_INTERVAL;
		this.startIdleCheck(this.currentIntervalMs);
	}

	// Ejecutado por `start`
	private startIdleCheck(interval: number) {
		this.resetTimeout = setInterval(() => {
			this.checkInactivity();
		}, interval); // Cada segundo
	}

	// Evalúa el tiempo restante
	private checkInactivity() {
		this._maxIdleTime -= this.currentIntervalMs;
    	console.log(this._maxIdleTime);

		if (this._maxIdleTime <= ACTIVITY_MONITOR_CONFIG.WARNING_THRESHOLD && this.currentIntervalMs !== ACTIVITY_MONITOR_CONFIG.HIGH_FREQ_INTERVAL) {
			this.clearTimeout();
			this.currentIntervalMs = ACTIVITY_MONITOR_CONFIG.HIGH_FREQ_INTERVAL;
			this.startIdleCheck(this.currentIntervalMs);
			return;
		}

		if(this._maxIdleTime <= 0) {
			this._idleSubject.next(true);
			this.forceLogout();
		}

		this._idleSubject.next(false);
	}

	public forceLogout(): void {
		if (this.alreadyLoggedOut()) return; // ✅ evita logout múltiple
		this.alreadyLoggedOut.set(true);
	  
		this.clearTimeout();      // Detiene el contador
		this.dialog.closeAll();   // Limpia la UI
	  
		this.authService.signOut().subscribe(() => {
		  this.router.navigate(['/sign-in']);
		});
	  }

	// 🟡 Reiniciar el contador
	public reset() {
		this._maxIdleTime = ACTIVITY_MONITOR_CONFIG.IDLE_TIMEOUT;
		this.warningShown = false;
	}

	// Observable para escuchar cambios de estado
	public get idleStatus() {
		return this._idleSubject.asObservable();
	}

	// Configurar tiempo manualmente
	public setMaxIdleTime(time: number) {
		this._maxIdleTime = time;
	}

	public clearTimeout() {
		clearInterval(this.resetTimeout);
	}

	// 🆕 Verifica si se debe mostrar advertencia
	public shouldShowWarning(): boolean {
		return this._maxIdleTime <= ACTIVITY_MONITOR_CONFIG.WARNING_THRESHOLD && !this.warningShown;
	}

	public setWarningShown(state: boolean) {
		this.warningShown = state;
	}

	public getRemainingTime(): number {
		return this._maxIdleTime;
	}

}
