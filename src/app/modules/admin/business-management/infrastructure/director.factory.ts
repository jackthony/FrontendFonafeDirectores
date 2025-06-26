import { inject, Injectable } from "@angular/core"
import { DirectorRepository } from "./repositories/director.repository";
import { DirectorInterface } from "../application/repositories/director.interface";

@Injectable({
    providedIn: 'root',
})
export class DirectorFactory {
    private _directorRepository = inject(DirectorRepository);

    injectRepository(): DirectorInterface {
        return this._directorRepository;
    }
}