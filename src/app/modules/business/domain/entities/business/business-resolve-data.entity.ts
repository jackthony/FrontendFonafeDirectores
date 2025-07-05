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