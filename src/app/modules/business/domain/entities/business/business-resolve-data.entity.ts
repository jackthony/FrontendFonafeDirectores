/*******************************************************************************************************
 * Nombre del archivo:  business-resolve-data.entity.ts
 * Descripción:          Definición de la entidad `BusinessResolveDataEntity` que contiene los datos relacionados 
 *                       con la resolución de negocio durante la carga de la información de una empresa. 
 *                       Esta interfaz agrupa la empresa y sus datos relacionados como ministerios, industria, 
 *                       departamentos, provincias y distritos. Además, se define el tipo `BusinessResolveResult` 
 *                       que puede ser un `UrlTree` o un objeto `BusinessResolveDataEntity`.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial de las interfaces de datos para la resolución de negocios.
 *******************************************************************************************************/
import { UrlTree } from '@angular/router';
import { MinistryEntity } from '../maintenance/ministry.entity';
import { DepartmentEntity } from './departament.entity';
import { DistrictEntity } from './district.entity';
import { BusinessEntity } from './business.entity';
import { ResponseEntity } from '@models/response.entity';
import { IndustryEntity } from '../maintenance/industry.entity';
import { ProvinceEntity } from './province.entity';
export interface BusinessResolveDataEntity {
  item: BusinessEntity | null;
  ministries: ResponseEntity<MinistryEntity>;
  industry: ResponseEntity<IndustryEntity>;
  departments: ResponseEntity<DepartmentEntity>;
  provinces: ResponseEntity<ProvinceEntity> | null;
  districts: ResponseEntity<DistrictEntity> | null;
}
export type BusinessResolveResult = UrlTree | BusinessResolveDataEntity;