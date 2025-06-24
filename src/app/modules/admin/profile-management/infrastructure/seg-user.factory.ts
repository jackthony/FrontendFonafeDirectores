/*******************************************************************************************************
 * Nombre de clase:       SegUserFactory
 * Descripción:           Fábrica responsable de inyectar la implementación del repositorio de usuario.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
import { inject, Injectable } from "@angular/core"
import { SegUserRepository } from "./repositories/seg-user.repository"
import { SegUserInterface } from "../application/repositories/seg-user.interface";
@Injectable({
    providedIn: 'root',
})
export class SegUserFactory {
    private _segUserRepository = inject(SegUserRepository);
    injectRepository(): SegUserInterface {
        return this._segUserRepository;
    }
}