import { inject, Injectable } from "@angular/core"
import { DistrictRepository } from "./repositories/district.repository";
import { DistrictInterface } from "../application/repositories/district.interface";

@Injectable({
    providedIn: 'root',  // Hace que el Factory esté disponible en toda la aplicación
})
export class DistrictFactory {
    private _districtRepository = inject(DistrictRepository);

    injectRepository(): DistrictInterface {
        return this._districtRepository;
    }
}