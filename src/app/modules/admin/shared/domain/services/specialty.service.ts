import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { SpecialtyInterface } from '../../application/repositories/specialty.interface';
import { SpecialtyFactory } from '../../infrastructure/specialty.factory';
import { SpecialtyEntity } from '../entities/specialty.entity';

@Injectable({
    providedIn: 'root',
})
export class SpecialtyService {
    private _specialtyInterface: SpecialtyInterface;

    constructor(private _specialtyFactory : SpecialtyFactory){ 
        this._specialtyInterface = this._specialtyFactory.injectRepository(); //Inyección del Factory
    }

    getAll(): Observable<ResponseEntity<SpecialtyEntity>> {
        return this._specialtyInterface.getAll();
    }

    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<SpecialtyEntity>> {
        return this._specialtyInterface.getByPagination(param, pageIndex, pageSize, filterState);
    }

    create(object: SpecialtyEntity): Observable<ResponseEntity<number>> {
        return this._specialtyInterface.create(object);
    }

    update(object: SpecialtyEntity): Observable<ResponseEntity<boolean>> {
        return this._specialtyInterface.update(object);
    }

    delete(object: SpecialtyEntity): Observable<ResponseEntity<boolean>> {
        return this._specialtyInterface.delete(object);
    }
}
