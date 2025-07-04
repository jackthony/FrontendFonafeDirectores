/*******************************************************************************************************
 * Nombre del archivo:  seg-user.repository.ts  
 * Descripción:          Implementación concreta del repositorio de usuarios (SegUser) que interactúa
 *                       con el backend mediante HttpClient para ejecutar operaciones CRUD y cambio de
 *                       contraseña. Forma parte del patrón de diseño Repository del módulo de seguridad.
 * Autor:                Daniel Alva
 * Fecha de creación:    23/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    - Implementación de métodos de cambio de contraseña forzada y administrada.
 *                       - Estandarización del manejo de parámetros Http.
 *******************************************************************************************************/
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { SegUserInterface } from '../../application/repositories/seg-user.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SegUserEntity } from '../../domain/entities/seg-user.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { SegUserChangePassForceEntity } from '../../domain/entities/seg-user-change-pass-force.entity';
import { SegUserChangePasswordEntity } from '../../domain/entities/seg-user-change-password.entity';
@Injectable({
    providedIn: 'root',
})
export class SegUserRepository implements SegUserInterface {
    private url = `${environment.apiUrlBase}/User`; //  URL base del endpoint de usuarios
    private _http = inject(HttpClient); // Inyección directa de HttpClient para llamadas HTTP
    /**
     * Recupera un listado paginado de usuarios, con soporte de búsqueda por nombre.
     * @param param Texto de búsqueda (nombre de usuario).
     * @param pageIndex Índice de la página solicitada (base 0).
     * @param pageSize Tamaño de la página (cantidad de registros por página).
     * @returns Observable con una ResponseEntity que contiene la lista de usuarios.
     */
    getByPagination(param: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<SegUserEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize);
        if(param) {
            params = params.append('sNombreCompleto', param)
        }
        return this._http.get<ResponseEntity<SegUserEntity>>(`${this.url}/listar-paginado`, { params }); 
    }
    /**
     * Crea un nuevo usuario en el sistema.
     * @param object Objeto de tipo SegUserEntity con los datos del nuevo usuario.
     * @returns Observable con ResponseEntity que contiene el ID del nuevo usuario creado.
     */
    create(object: SegUserEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }
    /**
     * Actualiza los datos de un usuario existente.
     * @param object Objeto de tipo SegUserEntity con los nuevos datos.
     * @returns Observable con ResponseEntity que indica si la operación fue exitosa.
     */
    update(object: SegUserEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }
    /**
     * Cambia la contraseña de un usuario desde el administrador (con privilegios).
     * @param object Objeto con los datos necesarios para cambiar la contraseña.
     * @returns Observable con ResponseEntity que indica si la operación fue exitosa.
     */
    updatePasswordByAdmin(object: SegUserChangePasswordEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${environment.apiUrlBase}/Auth/admin/reset-password`, object);
    }
    /**
     * Fuerza el cambio de contraseña del usuario autenticado.
     * @param object Objeto con la contraseña antigua y nueva.
     * @returns Observable con ResponseEntity que indica si la operación fue exitosa.
     */
    updateForcePassword(object: SegUserChangePassForceEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/ChangePassword`, object);
    }
}