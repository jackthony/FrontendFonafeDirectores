/*******************************************************************************************************
 * Nombre del archivo : ubigeo.interface.ts
 * Descripción         : Contrato para la obtención de información geográfica (departamentos, provincias y distritos).
 * Autor               : Daniel Alva
 * Fecha de creación   : 23/06/2025
 *******************************************************************************************************/
import { Observable } from "rxjs";
import { DepartmentEntity } from "../../domain/entities/departament.entity";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";
import { ProvinceEntity } from "../../domain/entities/province.entity";
import { DistrictEntity } from "../../domain/entities/district.entity";
export interface UbigeoInterface {
    getDepartments(): Observable<ResponseEntity<DepartmentEntity>>;
    getProvinces(sDepartmentCode: string): Observable<ResponseEntity<ProvinceEntity>>;
    getDistricts(sProvinceCode: string): Observable<ResponseEntity<DistrictEntity>>;
}
