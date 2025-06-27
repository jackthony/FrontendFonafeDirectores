/*******************************************************************************************************
 * Nombre del archivo:  role.service.ts
 * Descripción:          Servicio encargado de gestionar operaciones relacionadas a los Roles del sistema.
 *                       Utiliza un patrón de factoría para inyectar dinámicamente el repositorio correspondiente.
 * 
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Corrección del nombre de la propiedad inyectada y documentación formal.
 *******************************************************************************************************/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { RoleInterface } from '../../application/repositories/role.interface';
import { RoleFactory } from '../../infrastructure/role.factory';
import { RoleEntity } from '../entities/role.entity';
import { ModuleInterface } from '../../application/repositories/module.interface';
import { ModuleFactory } from '../../infrastructure/module.factory';
import { ModuleEntity } from '../entities/module.entity';
@Injectable({
    providedIn: 'root',
})
export class ModuleService {
    private _moduleInterface: ModuleInterface;
    /**
     * Constructor que inyecta dinámicamente el repositorio mediante la factoría RoleFactory.
     * @param _roleFactory Instancia de la factoría que provee la implementación de RoleInterface.
     */
    constructor(private _moduleFactory : ModuleFactory){ 
        this._moduleInterface = this._moduleFactory.injectRepository(); //Inyección del Factory
    }
    /**
     * Obtiene todos los modulos y acciones disponibles en el sistema.
     * @param rolId Código del rol para filtrar.
     * @returns Observable con la respuesta que contiene todos los modulos.
     */
    getAllActionsModules(rolId: number): Observable<ResponseEntity<ModuleEntity>> {
        return this._moduleInterface.getAllActionsModules(rolId);
    }
}
