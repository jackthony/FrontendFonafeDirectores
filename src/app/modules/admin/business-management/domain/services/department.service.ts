import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DepartmentInterface } from '../../application/repositories/department.interface';
import { DepartmentFactory } from '../../infrastructure/department.factory';
import { DepartmentEntity } from '../entities/departament.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';

@Injectable({
    providedIn: 'root',
})
export class DepartmentService {
    private _departmentInterface: DepartmentInterface;

    constructor(private _departmentFactory : DepartmentFactory){ 
        this._departmentInterface = this._departmentFactory.injectRepository(); //Inyección del Factory
    }

    getByPagination(): Observable<ResponseEntity<DepartmentEntity>> {
        return this._departmentInterface.getByPagination();
    }
}
