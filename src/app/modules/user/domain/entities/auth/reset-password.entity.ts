export interface ResetPasswordEntity {
    token: number;
    newPassword: string;
    captchaResponse: string
}
