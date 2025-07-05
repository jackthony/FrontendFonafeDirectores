import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UbigeoInterface } from '../../../application/repositories/business/ubigeo.interface';
import { UbigeoFactory } from '../../../infrastructure/business/factory/ubigeo.factory';
import { ProvinceEntity } from '../../entities/business/province.entity';
import { ResponseEntity } from '@models/response.entity';
import { DistrictEntity } from '../../entities/business/district.entity';
import { DepartmentEntity } from '../../entities/business/departament.entity';

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
