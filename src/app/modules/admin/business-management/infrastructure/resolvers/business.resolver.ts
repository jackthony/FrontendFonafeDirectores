/*******************************************************************************************************
 * Nombre del archivo: business.resolver.ts
 * Descripción:         Resolver encargado de precargar los datos necesarios para el componente 
 *                      `BusinessFormComponent`, tanto en modo de creación como edición.
 *                      Recupera datos de industrias, sectores, departamentos, provincias y distritos.
 *                      Si se proporciona un ID en la ruta, también carga los datos de la empresa.
 * Autor:               Daniel Alva
 * Fecha de creación:   23/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   - Incorporación de servicios compartidos.
 *                      - Inclusión condicional de provincias y distritos en modo edición.
 *******************************************************************************************************/
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, forkJoin, Observable, of, switchMap } from 'rxjs';
import { BusinessService } from '../../domain/services/business.service';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { MinistryService } from '../../../shared/domain/services/ministry.service';
import { BusinessResolveResult } from '../../domain/entities/business-resolve-data.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';
import { IndustryService } from 'app/modules/admin/shared/domain/services/industry.service';
import { SectorService } from 'app/modules/admin/shared/domain/services/sector.service';
import { UbigeoService } from '../../domain/services/ubigeo.service';
export const businessResolver: ResolveFn<BusinessResolveResult> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BusinessResolveResult> => {
	const router = inject(Router);
	const businessService = inject(BusinessService);
	const ministryService = inject(MinistryService);
	const ubigeoService = inject(UbigeoService);
	const industryService = inject(IndustryService);
	const sectorService = inject(SectorService);
  	const id = route.params['id'];
	const industry$ = industryService.getAll();
	const sector$ = sectorService.getAll();
	const departments$ = ubigeoService.getDepartments();

	if(!id) {
		return forkJoin({
			item: of(null),
			//ministries: ministries$,
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
				industry: industry$,
				sector: sector$,
				departments: departments$,
				provinces: ubigeoService.getProvinces(business.sIdDepartamento),
				districts: ubigeoService.getDistricts(business.sIdProvincia)
			})
		})
	)
}