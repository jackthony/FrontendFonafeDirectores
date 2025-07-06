/*******************************************************************************************************
 * Nombre del archivo:  industry.factory.ts
 * Descripción:          Fábrica encargada de exponer el repositorio concreto que implementa la interfaz
 *                       IndustryInterface. Permite desacoplar la infraestructura de la capa de aplicación
 *                       siguiendo el principio de inversión de dependencias (DIP).
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación inicial del factory para el repositorio de rubros.
 *******************************************************************************************************/
import { inject, Injectable } from "@angular/core"
import { IndustryRepository } from "../repositories/industry.repository";
import { IndustryInterface } from "../../../application/repositories/maintenance/industry.interface";
@Injectable({
    providedIn: 'root',
})
export class IndustryFactory {
    private _industryRepository = inject(IndustryRepository);
    /**
     * Retorna una instancia del repositorio inyectado que implementa `IndustryInterface`.
     * Este método facilita el desacoplamiento entre la lógica de aplicación y la infraestructura.
     *
     * @returns {IndustryInterface} Instancia concreta del repositorio de rubros.
     */
    injectRepository(): IndustryInterface {
        return this._industryRepository;
    }
}