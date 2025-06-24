import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { CONST_CARGO_MANAGER, CONST_GENDER, CONST_TYPE_DIRECTOR, CONST_TYPE_DOCUMENT, CONST_TYPE_SPECIALTY_DIRECTOR } from 'app/shared/configs/business-management/directory-business.config';
import { ResponseModel } from '@models/IResponseModel';
import { ConstantService } from 'app/modules/admin/shared/domain/services/constant.service';
import { ConstantEntity } from '../entities/constant.entity';
import { DepartmentEntity } from '../entities/departament.entity';
import { UbigeoService } from './ubigeo.service';

@Injectable({
  providedIn: 'root'
})
export class DirectorFormService {

	private _constantService = inject(ConstantService);

	private _ubigeoService = inject(UbigeoService);

	private cacheConstant = new Map<string, ConstantEntity[]>();
	private cacheDepartment = new Map<string, DepartmentEntity[]>();

	public getTypeDocument(): Observable<ConstantEntity[]> {
		return this.getCachedTypeDocument('typeDocument', CONST_TYPE_DOCUMENT);
	}

	public getGender(): Observable<ConstantEntity[]> {
		return this.getCachedTypeDocument('gender', CONST_GENDER);
	}
	
	public getCargoManager(): Observable<ConstantEntity[]> {
		return this.getCachedTypeDocument('cargoManager', CONST_CARGO_MANAGER);
	}

	public getTypeDirector(): Observable<ConstantEntity[]> {
		return this.getCachedTypeDocument('typeDirector', CONST_TYPE_DIRECTOR);
	}

	public getSpecialty(): Observable<ConstantEntity[]> {
		return this.getCachedTypeDocument('specialty', CONST_TYPE_SPECIALTY_DIRECTOR);
	}

	public getDepartments(): Observable<DepartmentEntity[]> {
		return this.getCachedDepartments('departments');
	}
	

	private getCachedTypeDocument(key: string, nConValor: number): Observable<ConstantEntity[]> {
		if (this.cacheConstant.has(key)) {
		  return of(this.cacheConstant.get(key)!);
		}
	
		return this._constantService.getAll(nConValor).pipe(
		  tap((data: ResponseModel<ConstantEntity>) => this.cacheConstant.set(key, data.lstItem)),
		  map((data: ResponseModel<ConstantEntity>) => data.lstItem)
		);
	}

	private getCachedDepartments(key: string): Observable<DepartmentEntity[]> {
		if (this.cacheDepartment.has(key)) {
		  return of(this.cacheDepartment.get(key)!);
		}

		return this._ubigeoService.getDepartments().pipe(
		  tap((data: ResponseModel<DepartmentEntity>) => this.cacheDepartment.set(key, data.lstItem)),
		  map((data: ResponseModel<DepartmentEntity>) => data.lstItem)
		);
	}



}
