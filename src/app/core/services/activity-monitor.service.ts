/*******************************************************************************************************
 * Nombre del archivo:  activity-monitor.service.ts
 * Descripción:          Servicio encargado de monitorear la inactividad del usuario en la aplicación. 
 *                       Si el usuario permanece inactivo durante un período determinado, se muestra una 
 *                       advertencia y, si la inactividad continúa, se fuerza el cierre de sesión.
 *                       El servicio utiliza un temporizador para verificar la actividad del usuario en 
 *                       intervalos regulares. El tiempo de inactividad se puede configurar, y el estado 
 *                       de la inactividad se emite a través de un observable.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial para el monitoreo de la inactividad del usuario y 
 *                         cierre de sesión automático después de un período de inactividad.
 *******************************************************************************************************/
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../modules/user/domain/services/auth/auth.service';
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
	public start(): void {
		this.alreadyLoggedOut.set(false);
		this._maxIdleTime = ACTIVITY_MONITOR_CONFIG.IDLE_TIMEOUT;
		this.warningShown = false;
		this.clearTimeout();
		this.currentIntervalMs = ACTIVITY_MONITOR_CONFIG.LOW_FREQ_INTERVAL;
		this.startIdleCheck(this.currentIntervalMs);
	}

	private startIdleCheck(interval: number) {
		this.resetTimeout = setInterval(() => {
			this.checkInactivity();
		}, interval);
	}
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
		if (this.alreadyLoggedOut()) return;
		this.alreadyLoggedOut.set(true);
		this.clearTimeout(); 
		this.dialog.closeAll(); 
		this.authService.signOut().subscribe(() => {
		this.router.navigate(['/sign-in']);
		});
	}
	public reset() {
		this._maxIdleTime = ACTIVITY_MONITOR_CONFIG.IDLE_TIMEOUT;
		this.warningShown = false;
	}
	public get idleStatus() {
		return this._idleSubject.asObservable();
	}
	public setMaxIdleTime(time: number) {
		this._maxIdleTime = time;
	}
	public clearTimeout() {
		clearInterval(this.resetTimeout);
	}
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