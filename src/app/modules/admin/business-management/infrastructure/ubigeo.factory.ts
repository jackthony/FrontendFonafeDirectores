import { inject, Injectable } from "@angular/core"
import { UbigeoRepository } from "./repositories/ubigeo.repository";
import { UbigeoInterface } from "../application/repositories/ubigeo.interface";

@Injectable({
    providedIn: 'root',  // Hace que el Factory esté disponible en toda la aplicación
})
export class UbigeoFactory {
    private _ubigeoRepository = inject(UbigeoRepository);

    injectRepository(): UbigeoInterface {
        return this._ubigeoRepository;
    }
}