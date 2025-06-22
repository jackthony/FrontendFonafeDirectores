import { Injectable } from '@angular/core';
import { ConstantInterface } from '../../application/repositories/constant.interface';
import { ConstantFactory } from '../../infrastructure/constant.factory';
import { Observable } from 'rxjs';
import { ConstantEntity } from '../entities/constant.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';

@Injectable({
    providedIn: 'root',
})
export class ConstantService {
    private _constantInterface: ConstantInterface;

    constructor(private _constantFactory : ConstantFactory){ 
        this._constantInterface = this._constantFactory.injectRepository(); //Inyección del Factory
    }

    getAll(code: number): Observable<ResponseEntity<ConstantEntity>> {
        return this._constantInterface.getAll(code);
    }
}
