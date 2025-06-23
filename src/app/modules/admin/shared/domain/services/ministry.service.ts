import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MinistryInterface } from '../../application/repositories/ministry.interface';
import { MinistryFactory } from '../../infrastructure/ministry.factory';
import { MinistryEntity } from '../../../business-management/domain/entities/ministry.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';

@Injectable({
    providedIn: 'root',
})
export class MinistryService {
    private _ministryInterface: MinistryInterface;

    constructor(private _ministryFactory : MinistryFactory){ 
        this._ministryInterface = this._ministryFactory.injectRepository(); //Inyección del Factory
    }

    getAll(): Observable<ResponseEntity<MinistryEntity>> {
        return this._ministryInterface.getAll();
    }

    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<MinistryEntity>> {
        return this._ministryInterface.getByPagination(param, pageIndex, pageSize, filterState);
    }

    create(object: MinistryEntity): Observable<ResponseEntity<number>> {
        return this._ministryInterface.create(object);
    }

    update(object: MinistryEntity): Observable<ResponseEntity<boolean>> {
        return this._ministryInterface.update(object);
    }

    delete(object: MinistryEntity): Observable<ResponseEntity<boolean>> {
        return this._ministryInterface.delete(object);
    }
}
