import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { PositionInterface } from '../../application/repositories/position.interface';
import { PositionFactory } from '../../infrastructure/position.factory';
import { PositionEntity } from '../entities/position.entity';

@Injectable({
    providedIn: 'root',
})
export class PositionService {
    private _positionInterface: PositionInterface;

    constructor(private _industryFactory : PositionFactory){ 
        this._positionInterface = this._industryFactory.injectRepository(); //Inyección del Factory
    }

    getAll(): Observable<ResponseEntity<PositionEntity>> {
        return this._positionInterface.getAll();
    }

    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<PositionEntity>> {
        return this._positionInterface.getByPagination(param, pageIndex, pageSize, filterState);
    }

    create(object: PositionEntity): Observable<ResponseEntity<number>> {
        return this._positionInterface.create(object);
    }

    update(object: PositionEntity): Observable<ResponseEntity<boolean>> {
        return this._positionInterface.update(object);
    }

    delete(object: PositionEntity): Observable<ResponseEntity<boolean>> {
        return this._positionInterface.delete(object);
    }
}
