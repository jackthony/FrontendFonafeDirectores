import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { TypeDirectorInterface } from '../../application/repositories/type-director.interface';
import { TypeDirectorEntity } from '../../domain/entities/type-director.entity';

@Injectable({
    providedIn: 'root',
})
export class TypeDirectorRepository implements TypeDirectorInterface {  
    private url = `${environment.apiUrlBase}/TypeDirector`;
    private _http = inject(HttpClient);

    getAll(): Observable<ResponseEntity<TypeDirectorEntity>> {
        return this._http.get<ResponseEntity<TypeDirectorEntity>>(`${this.url}/GetByPagination`);
    }

    getByPagination(userName: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<TypeDirectorEntity>> {
        return this._http.get<ResponseEntity<TypeDirectorEntity>>(`${this.url}/GetByPagination`, {
            params: { 'fullName': userName, 'pageIndex': pageIndex, 'pageSize': pageSize }
        });
    }

    create(object: TypeDirectorEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/Insert`, object);
    }

    update(object: TypeDirectorEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Update`, object);
    }

    delete(nId: number): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Delete/${nId}`, {});
    }
    
}
