import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { RoleInterface } from '../../application/repositories/role.interface';
import { RoleFactory } from '../../infrastructure/role.factory';
import { RoleEntity } from '../entities/role.entity';

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    private _typeDirectorInterface: RoleInterface;

    constructor(private _industryFactory : RoleFactory){ 
        this._typeDirectorInterface = this._industryFactory.injectRepository(); //Inyección del Factory
    }

    getAll(): Observable<ResponseEntity<RoleEntity>> {
        return this._typeDirectorInterface.getAll();
    }

    getByPagination(param: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<RoleEntity>> {
        return this._typeDirectorInterface.getByPagination(param, pageIndex, pageSize);
    }

    create(object: RoleEntity): Observable<ResponseEntity<number>> {
        return this._typeDirectorInterface.create(object);
    }

    update(object: RoleEntity): Observable<ResponseEntity<boolean>> {
        return this._typeDirectorInterface.update(object);
    }

    delete(nId: number): Observable<ResponseEntity<boolean>> {
        return this._typeDirectorInterface.delete(nId);
    }
}
