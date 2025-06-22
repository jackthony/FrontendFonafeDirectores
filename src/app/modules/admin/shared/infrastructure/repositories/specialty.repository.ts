import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { SpecialtyInterface } from '../../application/repositories/specialty.interface';
import { SpecialtyEntity } from '../../domain/entities/specialty.entity';

@Injectable({
    providedIn: 'root',
})
export class SpecialtyRepository implements SpecialtyInterface {  
    private url = `${environment.apiUrlBase}/Especialidad`;
    private _http = inject(HttpClient);

    getAll(): Observable<ResponseEntity<SpecialtyEntity>> {
        return this._http.get<ResponseEntity<SpecialtyEntity>>(`${this.url}/GetByPagination`);
    }

    getByPagination(userName: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<SpecialtyEntity>> {
        return this._http.get<ResponseEntity<SpecialtyEntity>>(`${this.url}/GetByPagination`, {
            params: { 'fullName': userName, 'pageIndex': pageIndex, 'pageSize': pageSize }
        });
    }

    create(object: SpecialtyEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/Insert`, object);
    }

    update(object: SpecialtyEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Update`, object);
    }

    delete(nId: number): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Delete/${nId}`, {});
    }
    
}
