import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable, of } from "rxjs";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";
import { CompanyAllowanceInterface } from "../../application/repositories/company-allowance.interface";
import { CompanyAllowanceEntity } from "../../domain/entities/companyAllowance.entity";

@Injectable({
    providedIn: 'root',
})
export class CompanyAllowanceRepository implements CompanyAllowanceInterface {
    private url = `${environment.apiUrlBase}/EMP_Dieta`;
    private _http = inject(HttpClient);

    getByRuc(sRuc: string, position: number): Observable<ResponseEntity<CompanyAllowanceEntity>> {
        return this._http.get<ResponseEntity<CompanyAllowanceEntity>>(`${this.url}/GetByRuc/${sRuc}/${position}`);
    }

}
