/*******************************************************************************************************
 * Nombre del archivo:  auth.interface.ts
 * Descripción:          Interfaz que define las operaciones necesarias para la autenticación y gestión de 
 *                       contraseñas en la aplicación. Establece las firmas de los métodos que deben implementar 
 *                       los servicios encargados de manejar el inicio de sesión, el cambio de contraseña, 
 *                       el restablecimiento de contraseña y la verificación de tokens.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial de la interfaz para manejar los procesos de autenticación.
 *******************************************************************************************************/
import { ResponseLogin } from "@models/responde-login.interface";
import { ResponseEntity } from "@models/response.entity";
import { ChangePasswordEntity } from "app/modules/user/domain/entities/auth/change-password.entity";
import { ForgotPasswordEntity } from "app/modules/user/domain/entities/auth/forgot-password.entity";
import { ResetPasswordEntity } from "app/modules/user/domain/entities/auth/reset-password.entity";
import { SignInEntity } from "app/modules/user/domain/entities/auth/sign-in.entity";
import { SuccessPasswordEntity } from "app/modules/user/domain/entities/auth/sucess-password.entity";
import { Observable } from "rxjs";
export interface AuthInterface {
    forgotPassword(credentials: ForgotPasswordEntity ): Observable<SuccessPasswordEntity>;
    resetPassword(credentials: ResetPasswordEntity): Observable<SuccessPasswordEntity>;
    signIn(credentials: SignInEntity): Observable<ResponseLogin>;
    changePassword(credentials: ChangePasswordEntity): Observable<ResponseEntity<boolean>>;
    verifyToken(accessToken: string): Observable<ResponseLogin>;
}