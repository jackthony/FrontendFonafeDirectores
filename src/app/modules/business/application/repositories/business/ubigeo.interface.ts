/*******************************************************************************************************
 * Nombre del archivo : ubigeo.interface.ts
 * Descripción         : Contrato para la obtención de información geográfica (departamentos, provincias y distritos).
 * Autor               : Daniel Alva
 * Fecha de creación   : 23/06/2025
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { ProvinceEntity } from "../../../domain/entities/business/province.entity";
import { ResponseEntity } from "@models/response.entity";
import { DistrictEntity } from "app/modules/business/domain/entities/business/district.entity";
import { DepartmentEntity } from "app/modules/business/domain/entities/business/departament.entity";
export interface UbigeoInterface {
    getDepartments(): Observable<ResponseEntity<DepartmentEntity>>;
    getProvinces(sDepartmentCode: string): Observable<ResponseEntity<ProvinceEntity>>;
    getDistricts(sProvinceCode: string): Observable<ResponseEntity<DistrictEntity>>;
}
