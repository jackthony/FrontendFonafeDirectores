import { Injectable } from '@angular/core';
import { Department } from '@models/business/departament.interface';
import { environment } from 'app/environments/environment';
import { HttpGenericService } from 'app/shared/services/http-generic.service';

@Injectable({
    providedIn: 'root',
})
export class DepartmentService extends HttpGenericService<Department> {

    constructor() {
        super(`${environment.apiUrlBase}/Departamentos`);
    }

}
