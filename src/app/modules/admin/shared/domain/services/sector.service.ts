import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { SectorInterface } from '../../application/repositories/sector.interface';
import { SectorFactory } from '../../infrastructure/sector.factory';
import { SectorEntity } from '../entities/sector.entity';

@Injectable({
    providedIn: 'root',
})
export class SectorService {
    private _sectorInterface: SectorInterface;

    constructor(private _sectorFactory : SectorFactory){ 
        this._sectorInterface = this._sectorFactory.injectRepository(); //Inyección del Factory
    }

    getAll(): Observable<ResponseEntity<SectorEntity>> {
        return this._sectorInterface.getAll();
    }

    getByPagination(param: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<SectorEntity>> {
        return this._sectorInterface.getByPagination(param, pageIndex, pageSize);
    }

    create(object: SectorEntity): Observable<ResponseEntity<number>> {
        return this._sectorInterface.create(object);
    }

    update(object: SectorEntity): Observable<ResponseEntity<boolean>> {
        return this._sectorInterface.update(object);
    }

    delete(nId: number): Observable<ResponseEntity<boolean>> {
        return this._sectorInterface.delete(nId);
    }
}
