import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { DistrictInterface } from "../../application/repositories/district.interface";
import { DistrictEntity } from "../../domain/entities/district.entity";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";

@Injectable({
    providedIn: 'root',
})
export class DistrictRepository implements DistrictInterface {
    private url = `${environment.apiUrlBase}/Distritos`;
    private _http = inject(HttpClient);

    getByPagination(sIdProvincia: string): Observable<ResponseEntity<DistrictEntity>> {
        return this._http.get<ResponseEntity<DistrictEntity>>(`${this.url}/GetByPagination/${sIdProvincia}`);
    }
    
}
