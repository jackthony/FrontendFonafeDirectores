import { inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { ResponseModel } from '../models/IResponseModel';
import { Business } from '@models/business/business.interface';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { BusinessService } from '@services/business.service';
import { catchError, forkJoin, Observable, of, switchMap } from 'rxjs';
import { MinistryService } from '@services/ministry.service';
import { ConstantService } from '@services/constant.service';
import { CONST_COMPANY_SECTION } from 'app/shared/configs/business-management/business-management.config';
import { ProvinceService } from '@services/province.service';
import { DistrictService } from '@services/district.service';
import { DepartmentService } from '@services/departament.service';
import { BusinessResolveResult } from 'app/shared/interfaces/business-resolve-data.interface';

export const businessResolver: ResolveFn<BusinessResolveResult> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BusinessResolveResult> => {

	const router = inject(Router);

	const businessService = inject(BusinessService);
	const ministryService = inject(MinistryService);
	const constantService = inject(ConstantService);
	const departmentService = inject(DepartmentService);
	const provinceService = inject(ProvinceService);
	const districtService = inject(DistrictService);

  	const id = route.params['id'];

	const ministries$ = ministryService.getByPagination(new RequestOption());
	const constants$ = constantService.getAll(CONST_COMPANY_SECTION);
	const departments$ = departmentService.getByPagination(new RequestOption());

	if(!id) {
		return forkJoin({
			item: of(null),
			ministries: ministries$,
			constants: constants$,
			departments: departments$,
			provinces: of(null),
			districts: of(null)
		  })
	}

	const reqBusiness = new RequestOption();
	reqBusiness.resource = 'GetById';
	reqBusiness.pathVariables = [id];

	return businessService.get(reqBusiness).pipe(
		catchError(() => of(null)),
		switchMap((response: ResponseModel<Business>) => {
			const business = response?.item ?? null;
			if(!business) {
				return of(router.parseUrl('/gestion-empresas'))
			}

			const reqProvince = new RequestOption();
			reqProvince.pathVariables = [business.sIdDepartamento];

			const reqDistrict = new RequestOption();
			reqDistrict.pathVariables = [business.sIdProvincia];

			return forkJoin({
				item: of(business),
				ministries: ministries$,
				constants: constants$,
				departments: departments$,
				provinces: provinceService.getByPagination(reqProvince),
				districts: districtService.getByPagination(reqDistrict)
			})
		})
	)
}