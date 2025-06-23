import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
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
    private url = `${environment.apiUrlBase}/Dir_Directorio`;
    private _http = inject(HttpClient);

    getByPagination(nIdEmpresa: number, pageIndex: number, pageSize: number): Observable<ResponseEntity<DirectorEntity>> {
        return this._http.get<ResponseEntity<DirectorEntity>>(`${this.url}/GetByPagination`, {
            params: { 'nIdEmpresa': nIdEmpresa, 'pageIndex': pageIndex, 'pageSize': pageSize }
        });
    }
    create(object: DirectorEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/Insert`, object);
    }
    update(object: DirectorEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Update`, object);
    }
}
