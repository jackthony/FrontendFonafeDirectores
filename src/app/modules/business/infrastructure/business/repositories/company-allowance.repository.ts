/*******************************************************************************************************
 * Nombre del archivo: company-allowance.repository.ts
 * Descripción:         Implementación del repositorio que interactúa con el endpoint `/EMP_Dieta`.
 *                      Encapsula la lógica para obtener información de dietas (asignaciones económicas)
 *                      de una empresa a través de su RUC y cargo.
 * Autor:               Daniel Alva
 * Fecha de creación:   23/06/2025
 * Última modificación: 23/06/2025
 *******************************************************************************************************/
import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable, of } from "rxjs";
import { CompanyAllowanceInterface } from "../../../application/repositories/business/company-allowance.interface";
import { ResponseEntity } from "@models/response.entity";
import { CompanyAllowanceEntity } from "../../../domain/entities/business/companyAllowance.entity";

@Injectable({
    providedIn: 'root',
})
export class CompanyAllowanceRepository implements CompanyAllowanceInterface {
    private url = `${environment.apiUrlBase}/Dieta`;
    private _http = inject(HttpClient);

    getByRuc(sRuc: string, position: number): Observable<ResponseEntity<CompanyAllowanceEntity>> {
        const params = new HttpParams().append('SRUC', sRuc).append('NTipoCargo', position);
        return this._http.get<ResponseEntity<CompanyAllowanceEntity>>(`${this.url}/obtener`, { params });
    }
}
