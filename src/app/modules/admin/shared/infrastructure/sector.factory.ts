import { inject, Injectable } from "@angular/core"
import { SectorInterface } from "../application/repositories/sector.interface";
import { SectorRepository } from "./repositories/sector.repository";

@Injectable({
    providedIn: 'root',  // Hace que el Factory esté disponible en toda la aplicación
})
export class SectorFactory {
    private _sectorRepository = inject(SectorRepository);

    injectRepository(): SectorInterface {
        return this._sectorRepository;
    }
}