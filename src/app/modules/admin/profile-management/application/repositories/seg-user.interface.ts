/*******************************************************************************************************
 * Nombre de la interfaz: SegUserInterface
 * Descripción:           Define el contrato que debe cumplir cualquier implementación del servicio de
 *                        usuarios (`SegUserService`). Contiene los métodos para operaciones CRUD y 
 *                        actualización de contraseñas, tanto por parte del usuario como por un 
 *                        administrador.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 * Última modificación:   23/06/2025 por Daniel Alva
 * Cambios recientes:     - Inclusión de métodos para cambio de contraseña forzado.
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { SegUserEntity } from "../../domain/entities/seg-user.entity";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";
import { SegUserChangePasswordEntity } from "../../domain/entities/seg-user-change-password.entity";
import { SegUserChangePassForceEntity } from "../../domain/entities/seg-user-change-pass-force.entity";
export interface SegUserInterface {
    getByPagination(userName: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<SegUserEntity>>;
    create(object: SegUserEntity): Observable<ResponseEntity<number>>;
    update(object: SegUserEntity): Observable<ResponseEntity<boolean>>;
    updatePasswordByAdmin(object: SegUserChangePasswordEntity): Observable<ResponseEntity<boolean>>;
    updateForcePassword(object: SegUserChangePassForceEntity): Observable<ResponseEntity<boolean>>;
}
