import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { DirectorInterface } from '../../application/repositories/director.interface';
import { DirectorFactory } from '../../infrastructure/director.factory';
import { DirectorEntity } from '../entities/director.entity';

@Injectable({
    providedIn: 'root',
})
export class DirectorService {
    private _directorInterface: DirectorInterface;

    constructor(private _directorFactory : DirectorFactory){ 
        this._directorInterface = this._directorFactory.injectRepository(); //Inyección del Factory
    }

    getByPagination(nIdEmpresa: number, pageIndex: number, pageSize: number): Observable<ResponseEntity<DirectorEntity>> {
        return this._directorInterface.getByPagination(nIdEmpresa, pageIndex, pageSize);
    }

    create(object: DirectorEntity): Observable<ResponseEntity<number>> {
        return this._directorInterface.create(object);
    }

    update(object: DirectorEntity): Observable<ResponseEntity<boolean>> {
        return this._directorInterface.update(object);
    }
}
