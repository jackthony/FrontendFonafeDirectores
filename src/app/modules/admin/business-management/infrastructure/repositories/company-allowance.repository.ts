/*******************************************************************************************************
 * Nombre del archivo: company-allowance.repository.ts
 * Descripción:         Implementación del repositorio que interactúa con el endpoint `/EMP_Dieta`.
 *                      Encapsula la lógica para obtener información de dietas (asignaciones económicas)
 *                      de una empresa a través de su RUC y cargo.
 * Autor:               Daniel Alva
 * Fecha de creación:   23/06/2025
 * Última modificación: 23/06/2025
 *******************************************************************************************************/
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
    private url = `${environment.apiUrlBase}/EMP_Dieta`;// URL base del módulo de dietas empresariales
    private _http = inject(HttpClient); // Cliente HTTP inyectado
        /**
     * Obtiene la dieta (asignación económica) de una empresa según su RUC y cargo
     * @param sRuc - RUC de la empresa
     * @param position - ID del cargo
     * @returns Observable con la respuesta envolviendo una entidad de tipo CompanyAllowanceEntity
     */
    getByRuc(sRuc: string, position: number): Observable<ResponseEntity<CompanyAllowanceEntity>> {
        return this._http.get<ResponseEntity<CompanyAllowanceEntity>>(`${this.url}/GetByRuc/${sRuc}/${position}`);
    }
}
