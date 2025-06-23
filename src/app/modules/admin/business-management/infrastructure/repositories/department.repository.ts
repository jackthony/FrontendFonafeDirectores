import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable, of } from "rxjs";
import { DepartmentInterface } from "../../application/repositories/department.interface";
import { DepartmentEntity } from "../../domain/entities/departament.entity";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";

@Injectable({
    providedIn: 'root',
})
export class DepartmentRepository implements DepartmentInterface {
    
    private url = `${environment.apiUrlBase}/Departamentos`;
    private _http = inject(HttpClient);

    getByPagination(): Observable<ResponseEntity<DepartmentEntity>> {
        return this._http.get<ResponseEntity<DepartmentEntity>>(`${this.url}/GetByPagination`);
    }
    
}
