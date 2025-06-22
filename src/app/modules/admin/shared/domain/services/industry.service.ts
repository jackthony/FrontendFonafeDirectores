import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { IndustryInterface } from '../../application/repositories/industry.interface';
import { IndustryFactory } from '../../infrastructure/industry.factory';
import { IndustryEntity } from '../entities/industry.entity';

@Injectable({
    providedIn: 'root',
})
export class IndustryService {
    private _industryInterface: IndustryInterface;

    constructor(private _industryFactory : IndustryFactory){ 
        this._industryInterface = this._industryFactory.injectRepository(); //Inyección del Factory
    }

    getAll(): Observable<ResponseEntity<IndustryEntity>> {
        return this._industryInterface.getAll();
    }

    getByPagination(param: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<IndustryEntity>> {
        return this._industryInterface.getByPagination(param, pageIndex, pageSize);
    }

    create(object: IndustryEntity): Observable<ResponseEntity<number>> {
        return this._industryInterface.create(object);
    }

    update(object: IndustryEntity): Observable<ResponseEntity<boolean>> {
        return this._industryInterface.update(object);
    }

    delete(nId: number): Observable<ResponseEntity<boolean>> {
        return this._industryInterface.delete(nId);
    }
}
