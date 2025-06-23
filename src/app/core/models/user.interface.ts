import { Permission } from "./permission.interface";

export interface User {
    usuarioId: number;
    email: string;
    nombreCompleto: string;
    primerNombre: string;
    status: string;
    sessionState: 'ACTIVE' | 'FORCE_PASSWORD_UPDATE';
    permissions: Permission[];
}
