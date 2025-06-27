/*******************************************************************************************************
 * Nombre de archivo:   seg-user-change-password.entity.ts
 * Descripción:          Entidad utilizada para representar el cambio de contraseña de un usuario
 *                       desde el panel administrativo (forzado por el administrador).
 * Autor:                Daniel Alva
 * Fecha de creación:    23/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    - Creación de estructura para soporte de cambio de contraseña administrativo.
 *******************************************************************************************************/
export interface SegUserChangePasswordEntity {
	usuarioId: number;
    newPassword: string;
    token: string;
}