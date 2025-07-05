/*******************************************************************************************************
 * Nombre del archivo:  specialty.factory.ts
 * Descripción:          Fábrica que proporciona la implementación concreta de la interfaz SpecialtyInterface.
 *                       Facilita el desacoplamiento entre la capa de aplicación y la infraestructura,
 *                       permitiendo inyectar el repositorio de especialidades sin exponer su implementación.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación inicial de la fábrica de repositorio para Specialty.
 *******************************************************************************************************/
import { inject, Injectable } from "@angular/core"
import { SpecialtyRepository } from "../repositories/specialty.repository";
import { SpecialtyInterface } from "../../../application/repositories/maintenance/specialty.interface";
@Injectable({
    providedIn: 'root',
})
export class SpecialtyFactory {
    private _specialtyRepository = inject(SpecialtyRepository); // Inyecta el repositorio de especialidades, que implementa SpecialtyInterface
    /**
     * Método para inyectar el repositorio de especialidades.
     * @returns Una instancia del repositorio de especialidades que implementa SpecialtyInterface.
     */
    injectRepository(): SpecialtyInterface {
        return this._specialtyRepository;
    }
}