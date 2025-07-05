import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyAllowanceInterface } from '../../application/repositories/company-allowance.interface';
import { CompanyAllowanceFactory } from '../../infrastructure/company-allowance.factory';
import { CompanyAllowanceEntity } from '../entities/companyAllowance.entity';
import { ResponseEntity } from '@models/response.entity';

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
