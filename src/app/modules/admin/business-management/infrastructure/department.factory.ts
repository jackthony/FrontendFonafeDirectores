import { inject, Injectable } from "@angular/core"
import { MinistryRepository } from "../../shared/infrastructure/repositories/ministry.repository";
import { MinistryInterface } from "../../shared/application/repositories/ministry.interface";
import { DepartmentRepository } from "./repositories/department.repository";
import { DepartmentInterface } from "../application/repositories/department.interface";

@Injectable({
    providedIn: 'root',  // Hace que el Factory esté disponible en toda la aplicación
})
export class DepartmentFactory {
    private _departmentRepository = inject(DepartmentRepository);

    injectRepository(): DepartmentInterface {
        return this._departmentRepository;
    }
}