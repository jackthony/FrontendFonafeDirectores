import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { IndustryInterface } from '../../application/repositories/industry.interface';
import { IndustryEntity } from '../../domain/entities/industry.entity';
import { user } from 'app/mock-api/common/user/data';

@Injectable({
    providedIn: 'root',
})
export class IndustryRepository implements IndustryInterface {  
    private url = `${environment.apiUrlBase}/Rubro`;
    private _http = inject(HttpClient);

    getAll(): Observable<ResponseEntity<IndustryEntity>> {
        return this._http.get<ResponseEntity<IndustryEntity>>(`${this.url}/listar`);
    }

    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<IndustryEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize);
        if(param) {
            params = params.append('Nombre', param)
        }
        if(filterState !== null ) params = params.append('Estado', filterState);
        return this._http.get<ResponseEntity<IndustryEntity>>(`${this.url}/listar-paginado`, { params });
    }

    create(object: IndustryEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }

    update(object: IndustryEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }

    delete(object: IndustryEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/eliminar`, object);
    }
    
}
