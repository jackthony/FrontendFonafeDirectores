/*******************************************************************************************************
 * Nombre del archivo:  ministry.factory.ts
 * Descripción:          Fábrica encargada de exponer el repositorio concreto que implementa la interfaz
 *                       MinistryInterface. Permite la inyección controlada de dependencias en la capa 
 *                       de aplicación, promoviendo el principio de inversión de dependencias (DIP) y 
 *                       facilitando el desacoplamiento entre capas.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación inicial de la fábrica para la gestión de ministerios.
 *******************************************************************************************************/
import { inject, Injectable } from "@angular/core"
import { MinistryRepository } from "./repositories/ministry.repository";
import { MinistryInterface } from "../application/repositories/ministry.interface";
@Injectable({
    providedIn: 'root',
})
export class MinistryFactory {
    private _ministryRepository = inject(MinistryRepository); // Inyecta el repositorio de ministerios, que implementa MinistryInterface
    /**
     * Método para inyectar el repositorio de ministerios.
     * @returns Una instancia del repositorio que implementa MinistryInterface.
     */
    injectRepository(): MinistryInterface {
        return this._ministryRepository;
    }
}