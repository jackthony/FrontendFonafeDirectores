import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { PositionInterface } from '../../application/repositories/position.interface';
import { PositionEntity } from '../../domain/entities/position.entity';

@Injectable({
    providedIn: 'root',
})
export class PositionRepository implements PositionInterface {  
    private url = `${environment.apiUrlBase}/Position`;
    private _http = inject(HttpClient);

    getAll(): Observable<ResponseEntity<PositionEntity>> {
        return this._http.get<ResponseEntity<PositionEntity>>(`${this.url}/GetByPagination`);
    }

    getByPagination(userName: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<PositionEntity>> {
        return this._http.get<ResponseEntity<PositionEntity>>(`${this.url}/GetByPagination`, {
            params: { 'fullName': userName, 'pageIndex': pageIndex, 'pageSize': pageSize }
        });
    }

    create(object: PositionEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/Insert`, object);
    }

    update(object: PositionEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Update`, object);
    }

    delete(nId: number): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Delete/${nId}`, {});
    }
    
}
