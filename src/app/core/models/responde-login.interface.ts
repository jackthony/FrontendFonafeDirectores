/*******************************************************************************************************
 * Nombre del archivo:  response-login.interface.ts
 * Descripción:          Interfaz que define la estructura de la respuesta al realizar un inicio de sesión,
 *                       incluyendo los detalles del usuario, los tokens de acceso y actualización, y los permisos
 *                       asociados con el usuario (modulos).
 *                       Esta interfaz es útil para manejar los datos que se retornan después de una autenticación
 *                       exitosa, permitiendo su procesamiento y almacenamiento en la aplicación.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial para definir la respuesta del login de un usuario.
 *******************************************************************************************************/
import { Permission } from "./permission.interface";
import { User } from "../../modules/user/domain/entities/auth/user.entity";

export interface ResponseLogin {
    usuarioResult: User; 
    accessToken: string;
    refreshToken: string;
    modulos: Permission[];
}