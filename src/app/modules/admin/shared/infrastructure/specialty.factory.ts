import { inject, Injectable } from "@angular/core"
import { SpecialtyRepository } from "./repositories/specialty.repository";
import { SpecialtyInterface } from "../application/repositories/specialty.interface";

@Injectable({
    providedIn: 'root',  // Hace que el Factory esté disponible en toda la aplicación
})
export class SpecialtyFactory {
    private _specialtyRepository = inject(SpecialtyRepository);

    injectRepository(): SpecialtyInterface {
        return this._specialtyRepository;
    }
}