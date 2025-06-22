import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable, of } from "rxjs";
import { DepartmentInterface } from "../../application/repositories/department.interface";
import { DepartmentEntity } from "../../domain/entities/departament.entity";
import { ProvinceInterface } from "../../application/repositories/province.interface";
import { ProvinceEntity } from "../../domain/entities/province.entity";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";

@Injectable({
    providedIn: 'root',
})
export class ProvinceRepository implements ProvinceInterface {
    private url = `${environment.apiUrlBase}/Provincias`;
    private _http = inject(HttpClient);

    getByPagination(sIdDepartamento: string): Observable<ResponseEntity<ProvinceEntity>> {
        return this._http.get<ResponseEntity<ProvinceEntity>>(`${this.url}/GetByPagination/${sIdDepartamento}`);
    }
    
}
