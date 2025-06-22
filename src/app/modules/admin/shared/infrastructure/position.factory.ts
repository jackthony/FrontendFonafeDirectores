import { inject, Injectable } from "@angular/core"
import { PositionRepository } from "./repositories/position.repository";
import { PositionInterface } from "../application/repositories/position.interface";

@Injectable({
    providedIn: 'root',  // Hace que el Factory esté disponible en toda la aplicación
})
export class PositionFactory {
    private _positionRepository = inject(PositionRepository);

    injectRepository(): PositionInterface {
        return this._positionRepository;
    }
}