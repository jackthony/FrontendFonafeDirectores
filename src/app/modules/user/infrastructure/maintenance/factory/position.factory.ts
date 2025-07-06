/*******************************************************************************************************
 * Nombre del archivo:  position.factory.ts
 * Descripción:          Fábrica encargada de proporcionar la implementación concreta de la interfaz
 *                       PositionInterface, permitiendo la inversión de dependencias entre capas y la
 *                       aplicación de principios SOLID. Facilita la inyección del repositorio correspondiente
 *                       en la capa de aplicación o dominio.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación inicial de la fábrica para la gestión de cargos/puestos.
 *******************************************************************************************************/
import { inject, Injectable } from "@angular/core"
import { PositionRepository } from "../repositories/position.repository";
import { PositionInterface } from "../../../application/repositories/maintenance/position.interface";
@Injectable({
    providedIn: 'root',
})
export class PositionFactory {
    private _positionRepository = inject(PositionRepository); // Inyecta el repositorio de posiciones, que implementa PositionInterface
    /**
     * Método para inyectar el repositorio de posiciones.
     * @returns Una instancia del repositorio que implementa PositionInterface.
     */
    injectRepository(): PositionInterface {
        return this._positionRepository;
    }
}