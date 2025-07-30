/*******************************************************************************************************
 * Nombre del archivo:  director.service.ts
 * Descripción:          Servicio encargado de gestionar las operaciones relacionadas con los directores, 
 *                       como la creación, actualización y obtención de directores mediante paginación.
 *                       Este servicio utiliza una fábrica (`DirectorFactory`) para obtener una instancia 
 *                       del repositorio que implementa la interfaz `DirectorInterface` y interactúa con 
 *                       los datos de los directores.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial del servicio de directores.
 *******************************************************************************************************/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DirectorInterface } from '../../../application/repositories/business/director.interface';
import { DirectorFactory } from '../../../infrastructure/business/factory/director.factory';
import { DirectorEntity } from '../../entities/business/director.entity';
import { ResponseEntity } from '@models/response.entity';
@Injectable({
    providedIn: 'root',
})
export class DirectorService {
    private _directorInterface: DirectorInterface;
    constructor(private _directorFactory : DirectorFactory){ 
        this._directorInterface = this._directorFactory.injectRepository(); 
    }
    getByPagination(param: string, nIdEmpresa: number, pageIndex: number, pageSize: number, dtFechaInicio: string, dtFechaFin: string): Observable<ResponseEntity<DirectorEntity>> {
        return this._directorInterface.getByPagination(param, nIdEmpresa, pageIndex, pageSize, dtFechaInicio, dtFechaFin);
    }
    create(object: DirectorEntity): Observable<ResponseEntity<number>> {
        return this._directorInterface.create(object);
    }
    update(object: DirectorEntity): Observable<ResponseEntity<boolean>> {
        return this._directorInterface.update(object);
    }
}