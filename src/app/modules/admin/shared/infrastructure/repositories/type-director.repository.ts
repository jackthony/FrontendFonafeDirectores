import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { TypeDirectorInterface } from '../../application/repositories/type-director.interface';
import { TypeDirectorEntity } from '../../domain/entities/type-director.entity';

@Injectable({
    providedIn: 'root',
})
export class TypeDirectorRepository implements TypeDirectorInterface {  
    private url = `${environment.apiUrlBase}/TipoDirector`;
    private _http = inject(HttpClient);

    getAll(): Observable<ResponseEntity<TypeDirectorEntity>> {
        return this._http.get<ResponseEntity<TypeDirectorEntity>>(`${this.url}/listar`);
    }

    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<TypeDirectorEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize);
        if(param) {
            params = params.append('Nombre', param)
        }
        if(filterState !== null ) params = params.append('Estado', filterState);
        return this._http.get<ResponseEntity<TypeDirectorEntity>>(`${this.url}/listar-paginado`, { params });
    }

    create(object: TypeDirectorEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }

    update(object: TypeDirectorEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }

    delete(object: TypeDirectorEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/eliminar`, object);
    }
    
}
