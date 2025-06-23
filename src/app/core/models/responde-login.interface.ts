import { Permission } from "./permission.interface";
import { User } from "./user.interface";

export interface ResponseLogin {
    usuarioResult: User; 
    accessToken: string;
    refreshToken: string;
    modulos: Permission[];
}