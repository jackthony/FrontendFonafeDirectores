import { Permission } from "./permission.interface";
import { User } from "../../modules/user/domain/entities/auth/user.entity";

export interface ResponseLogin {
    usuarioResult: User; 
    accessToken: string;
    refreshToken: string;
    modulos: Permission[];
}