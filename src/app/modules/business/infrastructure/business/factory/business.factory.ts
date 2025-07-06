import { inject, Injectable } from "@angular/core"
import { BusinessRepository } from "../repositories/business.repository";
import { BusinessInterface } from "../../../application/repositories/business/business.interface";

@Injectable({
    providedIn: 'root',
})
export class BusinessFactory {
    private _businessRepository = inject(BusinessRepository);

    injectRepository(): BusinessInterface {
        return this._businessRepository;
    }
}