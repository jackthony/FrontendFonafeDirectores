/*******************************************************************************************************
 * Nombre del archivo: company-allowance.interface.ts
 * Descripción:         Contrato que define la operación para obtener las dietas por empresa.
 * Autor:               Daniel Alva
 * Fecha de creación:   23/06/2025
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { CompanyAllowanceEntity } from "../../domain/entities/companyAllowance.entity";
import { ResponseEntity } from "@models/response.entity";
export interface CompanyAllowanceInterface {
    /**
     * Obtiene la dieta asociada a una empresa según su RUC y el cargo del director.
     * 
     * @param sRuc - RUC de la empresa
     * @param position - Cargo del director (según jerarquía)
     * @returns Observable con la respuesta que contiene la entidad de dieta
     */
    getByRuc(sRuc: string, position: number): Observable<ResponseEntity<CompanyAllowanceEntity>>;
}
