/*******************************************************************************************************
 * Nombre de clase:       SegUserFactory
 * Descripción:           Fábrica responsable de inyectar la implementación del repositorio de usuario.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 *******************************************************************************************************/
import { inject, Injectable } from "@angular/core"
import { SegUserInterface } from "app/modules/user/application/repositories/profile/seg-user.interface";
import { SegUserRepository } from "../repositories/seg-user.repository";
@Injectable({
    providedIn: 'root',
})
export class SegUserFactory {
    private _segUserRepository = inject(SegUserRepository);
    injectRepository(): SegUserInterface {
        return this._segUserRepository;
    }
}