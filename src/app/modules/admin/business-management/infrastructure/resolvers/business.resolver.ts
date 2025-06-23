import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, forkJoin, Observable, of, switchMap } from 'rxjs';
import { BusinessService } from '../../domain/services/business.service';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { MinistryService } from '../../../shared/domain/services/ministry.service';
import { DepartmentService } from '../../domain/services/department.service';
import { DistrictService } from '../../domain/services/district.service';
import { ProvinceService } from '../../domain/services/province.service';
import { BusinessResolveResult } from '../../domain/entities/business-resolve-data.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { IndustryService } from 'app/modules/admin/shared/domain/services/industry.service';
import { SectorService } from 'app/modules/admin/shared/domain/services/sector.service';

export const businessResolver: ResolveFn<BusinessResolveResult> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BusinessResolveResult> => {

	const router = inject(Router);

	const businessService = inject(BusinessService);
	const ministryService = inject(MinistryService);
	const departmentService = inject(DepartmentService);
	const provinceService = inject(ProvinceService);
	const districtService = inject(DistrictService);
	const industryService = inject(IndustryService);
	const sectorService = inject(SectorService);

  	const id = route.params['id'];

	const ministries$ = ministryService.getAll();
	const industry$ = industryService.getAll();
	const sector$ = sectorService.getAll();
	const departments$ = departmentService.getByPagination();

	if(!id) {
		return forkJoin({
			item: of(null),
			ministries: ministries$,
			industry: industry$,
			sector: sector$,
			departments: departments$,
			provinces: of(null),
			districts: of(null)
		  })
	}

	return businessService.getById(id).pipe(
		catchError(() => of(null)),
		switchMap((response: ResponseEntity<BusinessEntity>) => {
			const business = response?.item ?? null;
			if(!business) {
				return of(router.parseUrl('/gestion-empresas'))
			}

			return forkJoin({
				item: of(business),
				ministries: ministries$,
				industry: industry$,
				sector: sector$,
				departments: departments$,
				provinces: provinceService.getByPagination(business.sIdDepartamento),
				districts: districtService.getByPagination(business.sIdProvincia)
			})
		})
	)
}