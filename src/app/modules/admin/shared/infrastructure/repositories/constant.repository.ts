import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable, of } from "rxjs";
import { ConstantInterface } from "../../application/repositories/constant.interface";
import { ConstantEntity } from "../../domain/entities/constant.entity";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";

@Injectable({
    providedIn: 'root',
})
export class ConstantRepository implements ConstantInterface {
    private url = `${environment.apiUrlBase}/Constante`;
    private _http = inject(HttpClient);

    getAll(code: number): Observable<ResponseEntity<ConstantEntity>> {
        return this._http.get<ResponseEntity<ConstantEntity>>(`${this.url}/${code}`);
    }
    
}
