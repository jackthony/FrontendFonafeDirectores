/*******************************************************************************************************
 * Nombre del archivo:  type-director.factory.ts
 * Descripción:          Fábrica que expone la implementación concreta de la interfaz TypeDirectorInterface.
 *                       Permite desacoplar la lógica de acceso a repositorios de directores de tipo.
 *                       Facilita la inyección de dependencias sin exponer directamente la clase concreta.
 *
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    Implementación inicial de la fábrica de repositorio para TypeDirector.
 *******************************************************************************************************/
import { inject, Injectable } from "@angular/core"
import { TypeDirectorRepository } from "../repositories/type-director.repository";
import { TypeDirectorInterface } from "../../../application/repositories/maintenance/type-director.interface";
@Injectable({
    providedIn: 'root',
})
export class TypeDirectorFactory {
    private _typeDirector = inject(TypeDirectorRepository); // Inyecta el repositorio de directores de tipo, que implementa TypeDirectorInterface
    /**
     * Método para inyectar el repositorio de directores de tipo.
     * @returns Una instancia del repositorio que implementa TypeDirectorInterface.
     */
    injectRepository(): TypeDirectorInterface {
        return this._typeDirector;
    }
}