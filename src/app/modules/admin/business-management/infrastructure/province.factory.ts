import { inject, Injectable } from "@angular/core"
import { DepartmentRepository } from "./repositories/department.repository";
import { DepartmentInterface } from "../application/repositories/department.interface";
import { ProvinceRepository } from "./repositories/province.repository";
import { ProvinceInterface } from "../application/repositories/province.interface";

@Injectable({
    providedIn: 'root',  // Hace que el Factory esté disponible en toda la aplicación
})
export class ProvinceFactory {
    private _provinceRepository = inject(ProvinceRepository);

    injectRepository(): ProvinceInterface {
        return this._provinceRepository;
    }
}