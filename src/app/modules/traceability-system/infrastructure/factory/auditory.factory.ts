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
import { AuditoryRepository } from "../repositories/auditory.repository";
import { AuditoryInterface } from "../../application/auditory.interface";
@Injectable({
    providedIn: 'root',
})
export class AuditoryFactory {
    private _auditoryRepository = inject(AuditoryRepository); // Inyecta el repositorio de auditoria
    /**
     * Método para inyectar el repositorio de auditoria.
     * @returns Una instancia del repositorio que implementa AuditoryInterface.
     */
    injectRepository(): AuditoryInterface {
        return this._auditoryRepository;
    }
}