import { inject, Injectable } from "@angular/core"
import { ConstantRepository } from "./repositories/constant.repository";
import { ConstantInterface } from "../application/repositories/constant.interface";

@Injectable({
    providedIn: 'root',  // Hace que el Factory esté disponible en toda la aplicación
})
export class ConstantFactory {
    private _constantRepository = inject(ConstantRepository);

    injectRepository(): ConstantInterface {
        return this._constantRepository;
    }
}