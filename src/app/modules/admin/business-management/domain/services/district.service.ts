import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DistrictFactory } from '../../infrastructure/district.factory';
import { DistrictInterface } from '../../application/repositories/district.interface';
import { DistrictEntity } from '../entities/district.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';

@Injectable({
    providedIn: 'root',
})
export class DistrictService {
    private _districtInterface: DistrictInterface;

    constructor(private _districtFactory : DistrictFactory){ 
        this._districtInterface = this._districtFactory.injectRepository(); //Inyección del Factory
    }

    getByPagination(sIdProvincia: string): Observable<ResponseEntity<DistrictEntity>> {
        return this._districtInterface.getByPagination(sIdProvincia);
    }
}
