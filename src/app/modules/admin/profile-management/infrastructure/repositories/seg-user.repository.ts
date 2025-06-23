import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { SegUserInterface } from '../../application/repositories/seg-user.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SegUserEntity } from '../../domain/entities/seg-user.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { SegUserChangePassForceEntity } from '../../domain/entities/seg-user-change-pass-force.entity';
import { SegUserChangePasswordEntity } from '../../domain/entities/seg-user-change-password.entity';

@Injectable({
    providedIn: 'root',
})
export class SegUserRepository implements SegUserInterface {
    
    private url = `${environment.apiUrlBase}/User`;
    private _http = inject(HttpClient);

    getByPagination(param: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<SegUserEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize);
        if(param) {
            params = params.append('Nombre', param)
        }
        return this._http.get<ResponseEntity<SegUserEntity>>(`${this.url}/listar-paginado`, { params }); 
    }

    create(object: SegUserEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }

    update(object: SegUserEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }

    updatePassword(object: SegUserChangePasswordEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/ChangePassAdmin`, object);
    }

    updateForcePassword(object: SegUserChangePassForceEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/ChangePassword`, object);
    }
}
