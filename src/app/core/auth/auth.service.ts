import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { BehaviorSubject, catchError, Observable, of, ReplaySubject, shareReplay, switchMap, take, tap, throwError } from 'rxjs';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { SegUserService } from 'app/modules/admin/profile-management/domain/services/seg-user.service';
import { environment } from 'environments/environment';
import { ResponseLogin } from '@models/responde-login.interface';
import { ResponseModel } from '@models/IResponseModel';

@Injectable({ providedIn: 'root' })
export class AuthService {
    _authenticated: boolean = false;
    _check$: Observable<boolean> | null = null;
    private _authenticatedLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _sessionState = signal<'ACTIVE' | 'FORCE_PASSWORD_UPDATE' | null>(null);
    private _authorizationService = inject(AuthorizationService);
    private _httpClient = inject(HttpClient);
    private _ngxToastrService = inject(NgxToastrService);
    private _segUserService = inject(SegUserService);
    private _userService = inject(UserService);
    private _GenJWT=inject(AuthMockApi);
    private url = `${environment.apiUrlBase}/Auth`;
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    /**
     * Setter & getter for authenticated
     */

    set authenticatedLogin(value: boolean) {
        this._authenticatedLogin.next(value);
    }

    get _authenticatedLogin$(): Observable<any> {
        return this._authenticatedLogin.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(credentials: {email: string, captchaResponse: string} ): Observable<any> {
        return this._httpClient.post(`${this.url}/forgot-password`, credentials);
    }

    /**
     * Reset password
     *
     * @param password
     */

    resetPassword(credentials: { token: number,newPassword: string, captchaResponse: string }): Observable<any> {
        //return this._httpClient.post('api/auth/reset-password', password);
        //return this._segUserService.updateForcePassword(credentials)
        return this._httpClient.post(`${this.url}/reset-password`, credentials);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string, recaptcha: string }): Observable<ResponseLogin> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }
        return this._httpClient.post(`${this.url}/login`, credentials).pipe(
            switchMap((response: ResponseLogin) => {
                
                // Store the access token in the local storage
                this.accessToken = response.accessToken;
                // Set the authenticated flag to true
                this._authenticated = true;
                this.authenticatedLogin = true;
                this._check$ = of(true);
                //this._sessionState.set(response.item.sessionState);

                // Store the user on the user service
                this._userService.user = response.usuarioResult;
                this._authorizationService.setPermissions(response.modulos);
                return of(response);
            })
        );
    }

    changePassword(credentials: { usuarioId: number; passwordActual: string, passwordNueva: string, captchaResponse: string, token: string }): Observable<ResponseModel<boolean>> {
        // Throw error, if the user is already logged in
        if (!this._authenticated) {
            return throwError('El usuario aún no ha iniciado sesión');
        }
        return this._httpClient.post<ResponseModel<boolean>>(`${this.url}/change-password`, credentials);
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

                    // Set the authenticated flag to true
                    this._authenticated = true;
                    this.authenticatedLogin = true;

                    // Store the user on the user service
                    //this._userService.user = response.user;
                    this._userService.user = response.usuarioResult;

                    this._authorizationService.setPermissions(response.modulos);

                    // Return true
                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;
        this._userService.user = null;
        this._authorizationService.setPermissions([]);
        this._sessionState.set(null);
        this._check$ = null;
        this.authenticatedLogin = false;

        // Return the observable
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

    /**
     * Check the authentication status
     */
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
            take(1), // ✅ Solo emite una vez
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
