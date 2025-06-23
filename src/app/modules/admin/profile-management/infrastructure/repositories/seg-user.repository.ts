import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { SegUserInterface } from '../../application/repositories/seg-user.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SegUserEntity } from '../../domain/entities/seg-user.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { SegUserChangePassForceEntity } from '../../domain/entities/seg-user-change-pass-force.entity';
import { SegUserChangePasswordEntity } from '../../domain/entities/seg-user-change-password.entity';

@Injectable({
    providedIn: 'root',
})
export class SegUserRepository implements SegUserInterface {
    
    private url = `${environment.apiUrlBase}/Usuario`;
    private _http = inject(HttpClient);

    getByPagination(userName: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<SegUserEntity>> {
        return this._http.get<ResponseEntity<SegUserEntity>>(`${this.url}/GetByPagination`, {
            params: { 'fullName': userName, 'pageIndex': pageIndex, 'pageSize': pageSize }
        }); 
    }

    create(object: SegUserEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/Insert`, object);
    }

    update(object: SegUserEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Update`, object);
    }

    updatePassword(object: SegUserChangePasswordEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/ChangePassAdmin`, object);
    }

    updateForcePassword(object: SegUserChangePassForceEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/ChangePassword`, object);
    }
}
