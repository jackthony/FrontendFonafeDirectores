import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
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
        return this._http.get<ResponseEntity<SpecialtyEntity>>(`${this.url}/listar`);
    }

    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<SpecialtyEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize);
        if(param) {
            params = params.append('Nombre', param)
        }
        if(filterState !== null ) params = params.append('Estado', filterState);
        return this._http.get<ResponseEntity<SpecialtyEntity>>(`${this.url}/listar-paginado`, { params });
    }

    create(object: SpecialtyEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }

    update(object: SpecialtyEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }

    delete(object: SpecialtyEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/eliminar`, object);
    }
    
}
