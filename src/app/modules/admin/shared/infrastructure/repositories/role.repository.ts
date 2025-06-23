import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { RoleInterface } from '../../application/repositories/role.interface';
import { RoleEntity } from '../../domain/entities/role.entity';

@Injectable({
    providedIn: 'root',
})
export class RoleRepository implements RoleInterface {  
    private url = `${environment.apiUrlBase}/Rol`;
    private _http = inject(HttpClient);

    getAll(): Observable<ResponseEntity<RoleEntity>> {
        return this._http.get<ResponseEntity<RoleEntity>>(`${this.url}/listar`);
    }

    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<RoleEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize);
        if(param) {
            params = params.append('Nombre', param)
        }
        if(filterState !== null ) params = params.append('Estado', filterState);
        return this._http.get<ResponseEntity<RoleEntity>>(`${this.url}/listar-paginado`, { params });
    }

    create(object: RoleEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }

    update(object: RoleEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }

    delete(object: RoleEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/eliminar`, object);
    }
    
}
