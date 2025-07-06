import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyAllowanceInterface } from '../../../application/repositories/business/company-allowance.interface';
import { CompanyAllowanceFactory } from '../../../infrastructure/business/factory/company-allowance.factory';
import { ResponseEntity } from '@models/response.entity';
import { CompanyAllowanceEntity } from '../../entities/business/companyAllowance.entity';

@Injectable({
    providedIn: 'root',
})
export class CompanyAllowanceService {
    private _companyAllowanceInterface: CompanyAllowanceInterface;

    constructor(private _companyAllowanceFactory : CompanyAllowanceFactory){ 
        this._companyAllowanceInterface = this._companyAllowanceFactory.injectRepository(); //Inyección del Factory
    }

    getByRuc(sRuc: string, position: number): Observable<ResponseEntity<CompanyAllowanceEntity>> {
        return this._companyAllowanceInterface.getByRuc(sRuc, position);
    }
}
