/*******************************************************************************************************
 * Nombre de archivo:   seg-user-change-pass-force.entity.ts
 * Descripción:          Entidad utilizada para forzar el cambio de contraseña por parte del propio usuario.
 *                       Se utiliza generalmente al momento de primer inicio de sesión o cuando el sistema
 *                       exige renovación obligatoria de credenciales.
 * Autor:                Daniel Alva
 * Fecha de creación:    23/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    - Estructura inicial para soporte de cambio forzado de contraseña.
 *******************************************************************************************************/
export interface SegUserChangePassForceEntity {
	nIdUsuario: number;
    nuevaClave: string;
    repetirClave: string;
    nUsuarioModificacion: number;
}