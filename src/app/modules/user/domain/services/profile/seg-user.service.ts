/*******************************************************************************************************
 * Nombre del archivo:  seg-user.service.ts
 * Descripción:          Servicio que encapsula la lógica de negocio y coordinación con el repositorio 
 *                       de usuarios (SegUser), utilizando el patrón Factory para inyectar la 
 *                       implementación concreta. Brinda operaciones de CRUD y gestión de contraseñas.
 * Autor:                Daniel Alva
 * Fecha de creación:    23/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    - Integración completa con operaciones de cambio de contraseña forzada y admin.
 *                       - Estandarización del acceso a través de la interfaz del repositorio.
 *******************************************************************************************************/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseEntity } from '@models/response.entity';
import { SegUserEntity } from '../../entities/profile/seg-user.entity';
import { SegUserChangePasswordEntity } from '../../entities/profile/seg-user-change-password.entity';
import { SegUserChangePassForceEntity } from '../../entities/profile/seg-user-change-pass-force.entity';
import { SegUserInterface } from '../../../application/repositories/profile/seg-user.interface';
import { SegUserFactory } from 'app/modules/user/infrastructure/profile/factory/seg-user.factory';
@Injectable({
    providedIn: 'root',
})
export class SegUserService {
    private _segUserInterface: SegUserInterface;
    /**
     * Constructor que inyecta el repositorio de usuario mediante el patrón Factory.
     * @param _segUserFactory Fábrica que proporciona la implementación concreta del repositorio.
     */
    constructor(private _segUserFactory : SegUserFactory){ 
        this._segUserInterface = this._segUserFactory.injectRepository(); 
    }
    /**
     * Obtiene la lista de usuarios paginada con opción de búsqueda por nombre de usuario.
     * @param userName Filtro por nombre del usuario (puede ser vacío).
     * @param pageIndex Índice de la página solicitada.
     * @param pageSize Cantidad de registros por página.
     * @returns Observable con entidad de respuesta paginada.
     */
    getByPagination(userName: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<SegUserEntity>> {
        return this._segUserInterface.getByPagination(userName, pageIndex, pageSize);
    }
    /**
     * Registra un nuevo usuario en el sistema.
     * @param object Objeto SegUserEntity con los datos del nuevo usuario.
     * @returns Observable con el ID del usuario creado.
     */
    create(object: SegUserEntity): Observable<ResponseEntity<number>> {
        return this._segUserInterface.create(object);
    }
    /**
     * Actualiza los datos de un usuario existente.
     * @param object Objeto SegUserEntity con los cambios a aplicar.
     * @returns Observable indicando si la operación fue exitosa.
     */
    update(object: SegUserEntity): Observable<ResponseEntity<boolean>> {
        return this._segUserInterface.update(object);
    }
    /**
     * Cambia la contraseña de un usuario (modo administrador).
     * @param object Objeto con los datos para el cambio de contraseña.
     * @returns Observable indicando si el cambio fue exitoso.
     */
    updatePasswordByAdmin(object: SegUserChangePasswordEntity): Observable<ResponseEntity<boolean>> {
        return this._segUserInterface.updatePasswordByAdmin(object);
    }
    /**
     * Obliga al usuario a cambiar su contraseña desde el frontend (ej. primer login).
     * @param object Objeto con los datos requeridos para forzar el cambio de clave.
     * @returns Observable indicando si la operación fue exitosa.
     */
    updateForcePassword(object: SegUserChangePassForceEntity): Observable<ResponseEntity<boolean>> {
        return this._segUserInterface.updateForcePassword(object);
    }
}
