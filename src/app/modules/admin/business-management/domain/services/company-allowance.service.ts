import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { CompanyAllowanceInterface } from '../../application/repositories/company-allowance.interface';
import { CompanyAllowanceFactory } from '../../infrastructure/company-allowance.factory';
import { CompanyAllowanceEntity } from '../entities/companyAllowance.entity';

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
