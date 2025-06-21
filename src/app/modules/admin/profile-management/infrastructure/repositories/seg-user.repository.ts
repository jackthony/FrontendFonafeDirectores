import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { SegUserInterface } from '../../application/repositories/seg-user.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class SegUserRepository implements SegUserInterface {
    private url = `${environment.apiUrlBase}/Usuario`;
    private _http = inject(HttpClient);

    getByPagination(userName: string, pageIndex: number, pageSize: number) {
        return this._http.get(this.url, {
            params: { 'fullName': userName, 'pageIndex': pageIndex, 'pageSize': pageSize }
        });
    }
    
}
