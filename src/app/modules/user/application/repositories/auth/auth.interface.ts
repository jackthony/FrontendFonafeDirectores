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