/*******************************************************************************************************
 * Nombre del archivo:  sector.factory.ts
 * Descripción:          Fábrica que proporciona la implementación concreta de la interfaz SectorInterface.
 *                       Permite desacoplar la capa de aplicación de la infraestructura, inyectando de forma
 *                       segura y controlada el repositorio de sectores sin exponer su implementación.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación inicial de la fábrica de repositorio para Sector.
 *******************************************************************************************************/
import { inject, Injectable } from "@angular/core"
import { SectorRepository } from "../repositories/sector.repository";
import { SectorInterface } from "../../../application/repositories/maintenance/sector.interface";
@Injectable({
    providedIn: 'root',
})
export class SectorFactory {
    private _sectorRepository = inject(SectorRepository); // Inyecta el repositorio de sectores, que implementa SectorInterface
    /**
     * Método para inyectar el repositorio de sectores.
     * @returns Una instancia del repositorio que implementa SectorInterface.
     */
    injectRepository(): SectorInterface {
        return this._sectorRepository;
    }
}