import { inject, Injectable } from "@angular/core"
import { RoleRepository } from "./repositories/role.repository";
import { RoleInterface } from "../application/repositories/role.interface";

@Injectable({
    providedIn: 'root',  // Hace que el Factory esté disponible en toda la aplicación
})
export class RoleFactory {
    private _roleRepository = inject(RoleRepository);

    injectRepository(): RoleInterface {
        return this._roleRepository;
    }
}