import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { NgxToastrService } from 'app/shared/services/ngx-toastr.service';
import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { AuthorizationService } from 'app/shared/services/authorization.service';
import { SegUserService } from 'app/modules/admin/profile-management/domain/services/seg-user.service';
import { environment } from 'environments/environment';
import { ResponseLogin } from '@models/responde-login.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(credentials: { nIdUsuario: number,nuevaClave: string, repetirClave: string, nUsuarioModificacion: number }): Observable<any> {
        //return this._httpClient.post('api/auth/reset-password', password);
        return this._segUserService.updateForcePassword(credentials)
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
                /* if(!response || !response.item){
                    this._ngxToastrService.showError('Credenciales inválidas');
                    return throwError(() => new Error('Error validación'))
                }
                 */
                // Store the access token in the local storage
                //this.accessToken = response.accessToken;
                this.accessToken =  this._GenJWT._generateJWTToken();
                //this.accessToken =  this._GenJWT._generateJWTToken();
                // Set the authenticated flag to true
                this._authenticated = true;

                //this._sessionState.set(response.item.sessionState);

                // Store the user on the user service
                this._userService.user = response.usuarioResult;
                localStorage.setItem("user", JSON.stringify(response.usuarioResult));

                localStorage.setItem("permission", JSON.stringify(response.modulos));

                this._authorizationService.setPermissions(response.modulos)

                // Return a new observable with the response
                return of(response);
            })
        );

        /* return this._httpClient.post('api/auth/sign-in', credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        ); */
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient
            .post('api/auth/sign-in-with-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap((response: any) => {
                    // Replace the access token with the new one if it's available on
                    // the response object.
                    //
                    // This is an added optional step for better security. Once you sign
                    // in using the token, you should generate a new one on the server
                    // side and attach it to the response object. Then the following
                    // piece of code can replace the token with the refreshed one.
                    if (response.accessToken) {
                        this.accessToken = response.accessToken;
                    }

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    //this._userService.user = response.user;
                    this._userService.user = JSON.parse(localStorage.getItem("user"));

                    //this._userService.user = 
                    this._sessionState.set(JSON.parse(localStorage.getItem("user")).sessionState);
                    this._authorizationService.setPermissions(JSON.parse(localStorage.getItem("permission")));

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

        localStorage.removeItem('user');
        this._userService.user = null;
        this._sessionState.set(null);

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
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        const token = this.accessToken;
        if(token) this.accessToken = token;

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    getSessionState(): 'ACTIVE' | 'FORCE_PASSWORD_UPDATE' | null {
        return this._sessionState();
    }

}
