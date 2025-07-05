/*******************************************************************************************************
 * Nombre del archivo:  constant.factory.ts
 * Descripción:          Fábrica encargada de exponer el repositorio concreto que implementa la interfaz
 *                       ConstantInterface. Facilita la inyección desacoplada del repositorio desde la 
 *                       capa de infraestructura hacia la capa de aplicación, siguiendo los principios
 *                       de Clean Architecture.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación inicial del factory para el repositorio de constantes.
 *******************************************************************************************************/
import { inject, Injectable } from "@angular/core"
import { ConstantRepository } from "./repositories/constant.repository";
import { ConstantInterface } from "../application/repositories/constant.interface";
@Injectable({
    providedIn: 'root',
})
export class ConstantFactory {
    private _constantRepository = inject(ConstantRepository);// Inyecta el repositorio de constantes, que implementa ConstantInterface
    /**
     * Retorna una instancia del repositorio inyectado que implementa `ConstantInterface`.
     * Este método facilita el desacoplamiento entre la lógica de aplicación y la infraestructura.
     *
     * @returns {ConstantInterface} Instancia concreta del repositorio de constantes.
     */
    injectRepository(): ConstantInterface {
        return this._constantRepository;
    }
}