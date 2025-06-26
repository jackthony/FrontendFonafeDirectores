/*******************************************************************************************************
 * Nombre del archivo: director.interface.ts
 * Descripción:         Contrato de acceso a datos para la entidad Director.
 * Autor:               Daniel Alva
 * Fecha de creación:   23/06/2025
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";
import { DirectorEntity } from "../../domain/entities/director.entity";
export interface DirectorInterface {
    getByPagination(nIdEmpresa: number, pageIndex: number, pageSize: number): Observable<ResponseEntity<DirectorEntity>>;
    create(object: DirectorEntity): Observable<ResponseEntity<number>>;
    update(object: DirectorEntity): Observable<ResponseEntity<boolean>>;
}
