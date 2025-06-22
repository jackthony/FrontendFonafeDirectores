import { inject, Injectable } from "@angular/core"
import { TypeDirectorRepository } from "./repositories/type-director.repository";
import { TypeDirectorInterface } from "../application/repositories/type-director.interface";

@Injectable({
    providedIn: 'root',  // Hace que el Factory esté disponible en toda la aplicación
})
export class TypeDirectorFactory {
    private _typeDirector = inject(TypeDirectorRepository);

    injectRepository(): TypeDirectorInterface {
        return this._typeDirector;
    }
}