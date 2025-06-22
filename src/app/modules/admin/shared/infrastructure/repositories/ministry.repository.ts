import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { MinistryInterface } from "../../application/repositories/ministry.interface";
import { MinistryEntity } from "../../../business-management/domain/entities/ministry.entity";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";

@Injectable({
    providedIn: 'root',
})
export class MinistryRepository implements MinistryInterface {
    
    private url = `${environment.apiUrlBase}/Cat_Ministerio`;
    private _http = inject(HttpClient);

    getAll(): Observable<ResponseEntity<MinistryEntity>> {
        return this._http.get<ResponseEntity<MinistryEntity>>(`${this.url}/GetByPagination`);
    }

    getByPagination(param: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<MinistryEntity>> {
        return this._http.get<ResponseEntity<MinistryEntity>>(`${this.url}/GetByPagination`, {
            params: { 'fullName': param, 'pageIndex': pageIndex, 'pageSize': pageSize }
        });
    }

    create(object: MinistryEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/Insert`, object);
    }

    update(object: MinistryEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Update`, object);
    }

    delete(nId: number): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Delete/${nId}`, {});
    }
    
}
