import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { PositionInterface } from '../../application/repositories/position.interface';
import { PositionEntity } from '../../domain/entities/position.entity';

@Injectable({
    providedIn: 'root',
})
export class PositionRepository implements PositionInterface {  
    private url = `${environment.apiUrlBase}/Cargo`;
    private _http = inject(HttpClient);

    getAll(): Observable<ResponseEntity<PositionEntity>> {
        return this._http.get<ResponseEntity<PositionEntity>>(`${this.url}/listar`);
    }

    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<PositionEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize);
        if(param) {
            params = params.append('Nombre', param)
        }
        if(filterState !== null ) params = params.append('Estado', filterState);
        return this._http.get<ResponseEntity<PositionEntity>>(`${this.url}/listar-paginado`, { params });
    }

    create(object: PositionEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }

    update(object: PositionEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }

    delete(object: PositionEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/eliminar`, object);
    }
    
}
