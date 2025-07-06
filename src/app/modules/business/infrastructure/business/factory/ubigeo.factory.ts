import { inject, Injectable } from "@angular/core"
import { UbigeoRepository } from "../repositories/ubigeo.repository";
import { UbigeoInterface } from "../../../application/repositories/business/ubigeo.interface";

@Injectable({
    providedIn: 'root',  
})
export class UbigeoFactory {
    private _ubigeoRepository = inject(UbigeoRepository);

    injectRepository(): UbigeoInterface {
        return this._ubigeoRepository;
    }
}