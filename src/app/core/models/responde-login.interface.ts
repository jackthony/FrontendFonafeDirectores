import { Permission } from "./permission.interface";
import { User } from "../../modules/user/auth/domain/entities/user.entity";

export interface ResponseLogin {
    usuarioResult: User; 
    accessToken: string;
    refreshToken: string;
    modulos: Permission[];
}