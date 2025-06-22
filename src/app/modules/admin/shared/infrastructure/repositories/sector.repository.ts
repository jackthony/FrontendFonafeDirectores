import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { SectorInterface } from '../../application/repositories/sector.interface';
import { SectorEntity } from '../../domain/entities/sector.entity';

@Injectable({
    providedIn: 'root',
})
export class SectorRepository implements SectorInterface {  
    private url = `${environment.apiUrlBase}/Rubro`;
    private _http = inject(HttpClient);

    getAll(): Observable<ResponseEntity<SectorEntity>> {
        return this._http.get<ResponseEntity<SectorEntity>>(`${this.url}/GetByPagination`);
    }

    getByPagination(userName: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<SectorEntity>> {
        return this._http.get<ResponseEntity<SectorEntity>>(`${this.url}/GetByPagination`, {
            params: { 'fullName': userName, 'pageIndex': pageIndex, 'pageSize': pageSize }
        });
    }

    create(object: SectorEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/Insert`, object);
    }

    update(object: SectorEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Update`, object);
    }

    delete(nId: number): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Delete/${nId}`, {});
    }
    
}
