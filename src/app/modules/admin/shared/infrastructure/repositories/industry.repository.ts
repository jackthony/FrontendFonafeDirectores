import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { IndustryInterface } from '../../application/repositories/industry.interface';
import { IndustryEntity } from '../../domain/entities/industry.entity';

@Injectable({
    providedIn: 'root',
})
export class IndustryRepository implements IndustryInterface {  
    private url = `${environment.apiUrlBase}/Rubro`;
    private _http = inject(HttpClient);

    getAll(): Observable<ResponseEntity<IndustryEntity>> {
        return this._http.get<ResponseEntity<IndustryEntity>>(`${this.url}/GetByPagination`);
    }

    getByPagination(userName: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<IndustryEntity>> {
        return this._http.get<ResponseEntity<IndustryEntity>>(`${this.url}/GetByPagination`, {
            params: { 'fullName': userName, 'pageIndex': pageIndex, 'pageSize': pageSize }
        });
    }

    create(object: IndustryEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/Insert`, object);
    }

    update(object: IndustryEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Update`, object);
    }

    delete(nId: number): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Delete/${nId}`, {});
    }
    
}
