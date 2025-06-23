import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProvinceInterface } from '../../application/repositories/province.interface';
import { ProvinceFactory } from '../../infrastructure/province.factory';
import { ProvinceEntity } from '../entities/province.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';

@Injectable({
    providedIn: 'root',
})
export class ProvinceService {
    private _provinceInterface: ProvinceInterface;

    constructor(private _provinceFactory : ProvinceFactory){ 
        this._provinceInterface = this._provinceFactory.injectRepository(); //Inyección del Factory
    }

    getByPagination(sIdDepartamento: string): Observable<ResponseEntity<ProvinceEntity>> {
        return this._provinceInterface.getByPagination(sIdDepartamento);
    }
}
