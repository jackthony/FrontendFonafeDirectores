import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { TypeDirectorInterface } from '../../application/repositories/type-director.interface';
import { TypeDirectorEntity } from '../entities/type-director.entity';
import { TypeDirectorFactory } from '../../infrastructure/type-director.factory';

@Injectable({
    providedIn: 'root',
})
export class TypeDirectorService {
    private _typeDirectorInterface: TypeDirectorInterface;

    constructor(private _industryFactory : TypeDirectorFactory){ 
        this._typeDirectorInterface = this._industryFactory.injectRepository(); //Inyección del Factory
    }

    getAll(): Observable<ResponseEntity<TypeDirectorEntity>> {
        return this._typeDirectorInterface.getAll();
    }

    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<TypeDirectorEntity>> {
        return this._typeDirectorInterface.getByPagination(param, pageIndex, pageSize, filterState);
    }

    create(object: TypeDirectorEntity): Observable<ResponseEntity<number>> {
        return this._typeDirectorInterface.create(object);
    }

    update(object: TypeDirectorEntity): Observable<ResponseEntity<boolean>> {
        return this._typeDirectorInterface.update(object);
    }

    delete(object: TypeDirectorEntity): Observable<ResponseEntity<boolean>> {
        return this._typeDirectorInterface.delete(object);
    }
}
