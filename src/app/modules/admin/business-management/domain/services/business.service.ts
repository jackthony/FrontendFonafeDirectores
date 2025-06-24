import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BusinessInterface } from '../../application/repositories/business.interface';
import { BusinessFactory } from '../../infrastructure/business.factory';
import { BusinessEntity } from '../entities/business.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';

@Injectable({
    providedIn: 'root',
})
export class BusinessService {
    private _businessInterface: BusinessInterface;

    constructor(private _businessFactory : BusinessFactory){ 
        this._businessInterface = this._businessFactory.injectRepository(); //Inyección del Factory
    }

    getByPagination(nameEnterprise: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<BusinessEntity>> {
        return this._businessInterface.getByPagination(nameEnterprise, pageIndex, pageSize, filterState);
    }

    getById(nIdEmpresa: number): Observable<ResponseEntity<BusinessEntity>> {
        return this._businessInterface.getById(nIdEmpresa);
    }

    create(object: BusinessEntity): Observable<ResponseEntity<number>> {
        return this._businessInterface.create(object);
    }

    update(object: BusinessEntity): Observable<ResponseEntity<boolean>> {
        return this._businessInterface.update(object);
    }

    delete(object: BusinessEntity): Observable<ResponseEntity<boolean>> {
        return this._businessInterface.delete(object);
    }

    exportExcelEnterprise(): Observable<ArrayBuffer> {
        return this._businessInterface.exportExcelEnterprise();
    }
    
    exportPdfEnterprise(): Observable<ArrayBuffer> {
        return this._businessInterface.exportPdfEnterprise();
    }
}
