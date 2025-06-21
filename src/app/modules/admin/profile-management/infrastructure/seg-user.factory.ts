import { inject, Injectable } from "@angular/core"
import { SegUserRepository } from "./repositories/seg-user.repository"
import { SegUserInterface } from "../application/repositories/seg-user.interface";

@Injectable({
    providedIn: 'root',  // Hace que el Factory esté disponible en toda la aplicación
})
export class SegUserFactory {
    private _segUserRepository = inject(SegUserRepository);

    injectRepository(): SegUserInterface {
        return this._segUserRepository;
    }
}