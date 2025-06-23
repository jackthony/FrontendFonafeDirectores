import { inject, Injectable } from "@angular/core"
import { CompanyAllowanceRepository } from "./repositories/company-allowance.repository";
import { CompanyAllowanceInterface } from "../application/repositories/company-allowance.interface";

@Injectable({
    providedIn: 'root',  // Hace que el Factory esté disponible en toda la aplicación
})
export class CompanyAllowanceFactory {
    private _companyAllowanceRepository = inject(CompanyAllowanceRepository);

    injectRepository(): CompanyAllowanceInterface {
        return this._companyAllowanceRepository;
    }
}