import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DepartmentEntity } from '../entities/departament.entity';
import { UbigeoInterface } from '../../application/repositories/ubigeo.interface';
import { UbigeoFactory } from '../../infrastructure/ubigeo.factory';
import { ProvinceEntity } from '../entities/province.entity';
import { DistrictEntity } from '../entities/district.entity';
import { ResponseEntity } from '@models/response.entity';

@Injectable({
    providedIn: 'root',
})
export class UbigeoService {
    private _ubigeoInterface: UbigeoInterface;

    constructor(private _ubigeoFactory : UbigeoFactory){ 
        this._ubigeoInterface = this._ubigeoFactory.injectRepository(); //Inyección del Factory
    }

    getDepartments(): Observable<ResponseEntity<DepartmentEntity>>{
        return this._ubigeoInterface.getDepartments();
    }
    getProvinces(sDepartmentCode: string): Observable<ResponseEntity<ProvinceEntity>>{
        return this._ubigeoInterface.getProvinces(sDepartmentCode);
    }
    getDistricts(sProvinceCode: string): Observable<ResponseEntity<DistrictEntity>>{
        return this._ubigeoInterface.getDistricts(sProvinceCode);
    }
}
