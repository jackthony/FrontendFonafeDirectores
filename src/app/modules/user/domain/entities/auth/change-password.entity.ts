export interface ChangePasswordEntity {
    usuarioId: number; 
    passwordActual: string;
    passwordNueva: string;
    captchaResponse: string;
    token: string
}
