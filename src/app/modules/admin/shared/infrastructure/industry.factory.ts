import { inject, Injectable } from "@angular/core"
import { IndustryRepository } from "./repositories/industry.repository";
import { IndustryInterface } from "../application/repositories/industry.interface";

@Injectable({
    providedIn: 'root',  // Hace que el Factory esté disponible en toda la aplicación
})
export class IndustryFactory {
    private _industryRepository = inject(IndustryRepository);

    injectRepository(): IndustryInterface {
        return this._industryRepository;
    }
}