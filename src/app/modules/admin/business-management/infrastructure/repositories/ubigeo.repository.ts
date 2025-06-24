import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { UbigeoInterface } from "../../application/repositories/ubigeo.interface";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";
import { Observable } from "rxjs";
import { DepartmentEntity } from "../../domain/entities/departament.entity";
import { DistrictEntity } from "../../domain/entities/district.entity";
import { ProvinceEntity } from "../../domain/entities/province.entity";

@Injectable({
    providedIn: 'root',
})
export class UbigeoRepository implements UbigeoInterface {
    private url = `${environment.apiUrlBase}/Ubigeo`;
    private _http = inject(HttpClient);

    getDepartments(): Observable<ResponseEntity<DepartmentEntity>> {
        return this._http.get<ResponseEntity<DepartmentEntity>>(`${this.url}/listarDepartamentos`);
    }
    getProvinces(sDepartmentCode: string): Observable<ResponseEntity<ProvinceEntity>> {
        const params = new HttpParams().append('sCode', sDepartmentCode);
        return this._http.get<ResponseEntity<ProvinceEntity>>(`${this.url}/listarProvincias`, { params } );
    }
    getDistricts(sProvinceCode: string): Observable<ResponseEntity<DistrictEntity>> {
        const params = new HttpParams().append('sCode', sProvinceCode);
        return this._http.get<ResponseEntity<DistrictEntity>>(`${this.url}/listarDistritos`, { params } );
    }
    
}
