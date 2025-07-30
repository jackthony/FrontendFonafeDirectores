/*******************************************************************************************************
 * Nombre del archivo:  auth.service.ts
 * Descripción:          Servicio que maneja las operaciones de autenticación en la aplicación, incluyendo 
 *                       el inicio de sesión, registro, cambio de contraseña, verificación de tokens y 
 *                       manejo de la sesión del usuario.
 *                       Además, gestiona el estado de la sesión, la validación del token y la asignación 
 *                       de permisos de usuario.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del servicio de autenticación con funcionalidades de login, 
 *                         logout, verificación de token y cambio de contraseña.
 *******************************************************************************************************/
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthUtils } from 'app/core/utils/auth.utils';
import { UserService } from 'app/modules/user/domain/services/auth/user.service';
import { BehaviorSubject, catchError, Observable, of, shareReplay, switchMap, take, tap, throwError } from 'rxjs';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { environment } from 'environments/environment';
import { ResponseLogin } from '@models/responde-login.interface';
import { ResponseEntity } from '@models/response.entity';
import { ForgotPasswordEntity } from '../../entities/auth/forgot-password.entity';
import { ResetPasswordEntity } from '../../entities/auth/reset-password.entity';
import { SignInEntity } from '../../entities/auth/sign-in.entity';
import { ChangePasswordEntity } from '../../entities/auth/change-password.entity';
import { SuccessPasswordEntity } from '../../entities/auth/sucess-password.entity';
@Injectable({ providedIn: 'root' })
export class AuthService {
    _authenticated: boolean = false;
    _check$: Observable<boolean> | null = null;
    private _authenticatedLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _sessionState = signal<'ACTIVE' | 'FORCE_PASSWORD_UPDATE' | null>(null);
    private _authorizationService = inject(AuthorizationService);
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private url = `${environment.apiUrlBase}/Auth`;
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }
    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }
    set authenticatedLogin(value: boolean) {
        this._authenticatedLogin.next(value);
    }
    get _authenticatedLogin$(): Observable<any> {
        return this._authenticatedLogin.asObservable();
    }
    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(credentials: ForgotPasswordEntity ): Observable<SuccessPasswordEntity> {
        return this._httpClient.post<SuccessPasswordEntity>(`${this.url}/forgot-password`, credentials);
    }
    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(credentials: ResetPasswordEntity): Observable<SuccessPasswordEntity> {
        return this._httpClient.post<SuccessPasswordEntity>(`${this.url}/reset-password`, credentials);
    }
    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: SignInEntity): Observable<ResponseLogin> {
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }
        return this._httpClient.post(`${this.url}/login`, credentials).pipe(
            switchMap((response: ResponseLogin) => {
                this.accessToken = response.accessToken;
                this._authenticated = true;
                this.authenticatedLogin = true;
                this._check$ = of(true);
                this._userService.user = response.usuarioResult;
                this._authorizationService.setPermissions(response.modulos);
                return of(response);
            })
        );
    }
    changePassword(credentials: ChangePasswordEntity): Observable<ResponseEntity<boolean>> {
        if (!this._authenticated) {
            return throwError('El usuario aún no ha iniciado sesión');
        }
        return this._httpClient.post<ResponseEntity<boolean>>(`${this.url}/change-password`, credentials);
    }
    verifyToken(accessToken: string): Observable<boolean> {
        return this._httpClient
        .post(`${this.url}/verify-token`, {
            token: accessToken,
        })
        .pipe(
            catchError((error) => {
                return of(false)
            }),
            switchMap((response: ResponseLogin | boolean) => {
                console.log('response', response);
                
                if(!response) return of(false);
                return of(true);
            })
        )
    }
    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<boolean> {
        //debugger;
        // Sign in using the token
        return this._httpClient
            .post(`${this.url}/verify-token`, {
                token: this.accessToken,
            })
            .pipe(
                catchError((error) =>{
                    return of(false)
                }),
                switchMap((response: ResponseLogin) => {
                    if(!response) return of(false);
                    if (response.accessToken) {
                        this.accessToken = response.accessToken;
                    }
                    this._authenticated = true;
                    this.authenticatedLogin = true;
                    this._userService.user = response.usuarioResult;
                    this._authorizationService.setPermissions(response.modulos);
                    return of(true);
                })
            );
    }
    /**
     * Sign out
     */
    signOut(): Observable<any> {
        localStorage.removeItem('accessToken');
        this._authenticated = false;
        this._userService.user = null;
        this._authorizationService.setPermissions([]);
        this._sessionState.set(null);
        this._check$ = null;
        this.authenticatedLogin = false;
        return of(true);
    }
    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }
    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }
    check(): Observable<boolean> {
        if (this._check$) {
            return this._check$;
        } 
        if (!this.accessToken) {
            return of(false);
        }
        
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }
        this._check$ = this.signInUsingToken().pipe(
            take(1),
            tap((valid) => {
                if (!valid) {
                    this.signOut();
                    this._check$ = null;
                }
            }),
            shareReplay(1)
        );
        return this._check$;
    }
    getSessionState(): 'ACTIVE' | 'FORCE_PASSWORD_UPDATE' | null {
        return this._sessionState();
    }
}