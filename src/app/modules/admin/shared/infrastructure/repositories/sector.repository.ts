import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { SectorInterface } from '../../application/repositories/sector.interface';
import { SectorEntity } from '../../domain/entities/sector.entity';

@Injectable({
    providedIn: 'root',
})
export class SectorRepository implements SectorInterface {  
    private url = `${environment.apiUrlBase}/Sector`;
    private _http = inject(HttpClient);

    getAll(): Observable<ResponseEntity<SectorEntity>> {
        return this._http.get<ResponseEntity<SectorEntity>>(`${this.url}/listar`);
    }

    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<SectorEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize);
        if(param) {
            params = params.append('Nombre', param)
        }
        if(filterState !== null ) params = params.append('Estado', filterState);
        return this._http.get<ResponseEntity<SectorEntity>>(`${this.url}/listar-paginado`, { params });
    }

    create(object: SectorEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }

    update(object: SectorEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }

    delete(object: SectorEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/eliminar`, object);
    }
    
}
