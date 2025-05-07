import { inject, Injectable } from '@angular/core';
import { ConstantService } from './constant.service';
import { Constant } from '@models/business/constant.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { CONST_CARGO_MANAGER, CONST_GENDER, CONST_TYPE_DIRECTOR, CONST_TYPE_DOCUMENT, CONST_TYPE_SPECIALTY_DIRECTOR } from 'app/shared/configs/business-management/directory-business.config';
import { ResponseModel } from '@models/IResponseModel';
import { DepartmentService } from './departament.service';
import { Department } from '@models/business/departament.interface';

@Injectable({
  providedIn: 'root'
})
export class DirectorFormService {

	private _constantService = inject(ConstantService);

	private _departmentService = inject(DepartmentService);

	private cacheConstant = new Map<string, Constant[]>();
	private cacheDepartment = new Map<string, Department[]>();

	public getTypeDocument(): Observable<Constant[]> {
		return this.getCachedTypeDocument('typeDocument', CONST_TYPE_DOCUMENT);
	}

	public getGender(): Observable<Constant[]> {
		return this.getCachedTypeDocument('gender', CONST_GENDER);
	}
	
	public getCargoManager(): Observable<Constant[]> {
		return this.getCachedTypeDocument('cargoManager', CONST_CARGO_MANAGER);
	}

	public getTypeDirector(): Observable<Constant[]> {
		return this.getCachedTypeDocument('typeDirector', CONST_TYPE_DIRECTOR);
	}

	public getSpecialty(): Observable<Constant[]> {
		return this.getCachedTypeDocument('specialty', CONST_TYPE_SPECIALTY_DIRECTOR);
	}

	public getDepartments(): Observable<Department[]> {
		return this.getCachedDepartments('departments');
	}
	

	private getCachedTypeDocument(key: string, nConValor): Observable<Constant[]> {
		if (this.cacheConstant.has(key)) {
		  return of(this.cacheConstant.get(key)!);
		}
	
		return this._constantService.getAll(nConValor).pipe(
		  tap((data: ResponseModel<Constant>) => this.cacheConstant.set(key, data.lstItem)),
		  map((data: ResponseModel<Constant>) => data.lstItem)
		);
	}

	private getCachedDepartments(key: string): Observable<Department[]> {
		if (this.cacheDepartment.has(key)) {
		  return of(this.cacheDepartment.get(key)!);
		}

		return this._departmentService.getByPagination(new RequestOption()).pipe(
		  tap((data: ResponseModel<Department>) => this.cacheDepartment.set(key, data.lstItem)),
		  map((data: ResponseModel<Department>) => data.lstItem)
		);
	}



}
