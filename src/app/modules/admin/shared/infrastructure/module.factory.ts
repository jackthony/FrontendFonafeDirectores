/*******************************************************************************************************
 * Nombre del archivo:  role.factory.ts
 * Descripción:          Fábrica que inyecta la implementación concreta de la interfaz RoleInterface,
 *                       permitiendo el desacoplamiento entre la capa de aplicación y la infraestructura.
 *                       Facilita la aplicación de principios SOLID y la sustitución del repositorio en testing.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación inicial de la fábrica para la gestión de roles.
 *******************************************************************************************************/
import { inject, Injectable } from "@angular/core"
import { ModuleRepository } from "./repositories/module.repository";
import { ModuleInterface } from "../application/repositories/module.interface";
@Injectable({
    providedIn: 'root',
})
export class ModuleFactory {
    private _moduleRepository = inject(ModuleRepository); // Inyecta el repositorio de roles, que implementa RoleInterface
    /**
     * Método para inyectar el repositorio de roles.
     * @returns Una instancia del repositorio que implementa RoleInterface.
     */
    injectRepository(): ModuleInterface {
        return this._moduleRepository;
    }
}