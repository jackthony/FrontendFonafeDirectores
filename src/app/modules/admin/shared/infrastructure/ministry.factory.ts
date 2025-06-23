import { inject, Injectable } from "@angular/core"
import { MinistryRepository } from "./repositories/ministry.repository";
import { MinistryInterface } from "../application/repositories/ministry.interface";

@Injectable({
    providedIn: 'root',  // Hace que el Factory esté disponible en toda la aplicación
})
export class MinistryFactory {
    private _ministryRepository = inject(MinistryRepository);

    injectRepository(): MinistryInterface {
        return this._ministryRepository;
    }
}