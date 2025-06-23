import { inject, Injectable } from "@angular/core"
import { DirectorRepository } from "./repositories/director.repository";
import { DirectorInterface } from "../application/repositories/director.interface";

@Injectable({
    providedIn: 'root',  // Hace que el Factory esté disponible en toda la aplicación
})
export class DirectorFactory {
    private _directorRepository = inject(DirectorRepository);

    injectRepository(): DirectorInterface {
        return this._directorRepository;
    }
}