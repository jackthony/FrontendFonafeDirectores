import { UrlTree } from '@angular/router';
import { MinistryEntity } from './ministry.entity';
import { DepartmentEntity } from './departament.entity';
import { ProvinceEntity } from './province.entity';
import { DistrictEntity } from './district.entity';
import { BusinessEntity } from './business.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { IndustryEntity } from 'app/modules/admin/shared/domain/entities/industry.entity';
import { SectorEntity } from 'app/modules/admin/shared/domain/entities/sector.entity';
export interface BusinessResolveDataEntity {
  item: BusinessEntity | null;
  //ministries: ResponseEntity<MinistryEntity>;
  industry: ResponseEntity<IndustryEntity>;
  sector: ResponseEntity<SectorEntity>;
  departments: ResponseEntity<DepartmentEntity>;
  provinces: ResponseEntity<ProvinceEntity> | null;
  districts: ResponseEntity<DistrictEntity> | null;
}

export type BusinessResolveResult = UrlTree | BusinessResolveDataEntity;