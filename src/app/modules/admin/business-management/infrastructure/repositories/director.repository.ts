import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BusinessInterface } from '../../application/repositories/business.interface';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { DirectorInterface } from '../../application/repositories/director.interface';
import { DirectorEntity } from '../../domain/entities/director.entity';

@Injectable({
    providedIn: 'root',
})
export class DirectorRepository implements DirectorInterface {
    private url = `${environment.apiUrlBase}/Director`;
    private _http = inject(HttpClient);

    getByPagination(nIdEmpresa: number, pageIndex: number, pageSize: number): Observable<ResponseEntity<DirectorEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize).append('nIdEmpresa', nIdEmpresa);
        return this._http.get<ResponseEntity<DirectorEntity>>(`${this.url}/listar-paginado`, { params });
    }
    create(object: DirectorEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }
    update(object: DirectorEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }
}
