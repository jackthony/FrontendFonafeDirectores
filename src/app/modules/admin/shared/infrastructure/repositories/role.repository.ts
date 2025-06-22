import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { RoleInterface } from '../../application/repositories/role.interface';
import { RoleEntity } from '../../domain/entities/role.entity';

@Injectable({
    providedIn: 'root',
})
export class RoleRepository implements RoleInterface {  
    private url = `${environment.apiUrlBase}/Role`;
    private _http = inject(HttpClient);

    getAll(): Observable<ResponseEntity<RoleEntity>> {
        return this._http.get<ResponseEntity<RoleEntity>>(`${this.url}/GetByPagination`);
    }

    getByPagination(userName: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<RoleEntity>> {
        return this._http.get<ResponseEntity<RoleEntity>>(`${this.url}/GetByPagination`, {
            params: { 'fullName': userName, 'pageIndex': pageIndex, 'pageSize': pageSize }
        });
    }

    create(object: RoleEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/Insert`, object);
    }

    update(object: RoleEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Update`, object);
    }

    delete(nId: number): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Delete/${nId}`, {});
    }
    
}
