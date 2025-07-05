import { inject, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { ConstantService } from 'app/modules/business/domain/services/business/constant.service';
import { UbigeoService } from './ubigeo.service';
import { TypeDirectorEntity } from 'app/modules/business/domain/entities/maintenance/type-director.entity';
import { TypeDirectorService } from 'app/modules/business/domain/services/maintenance/type-director.service';
import { SpecialtyEntity } from 'app/modules/business/domain/entities/maintenance/specialty.entity';
import { SpecialtyService } from 'app/modules/business/domain/services/maintenance/specialty.service';
import { SectorEntity } from 'app/modules/business/domain/entities/maintenance/sector.entity';
import { SectorService } from 'app/modules/business/domain/services/maintenance/sector.service';
import { ResponseEntity } from '@models/response.entity';
import { CONST_CARGO_DIRECTOR, CONST_GENDER, CONST_TYPE_DOCUMENT } from '../../../config/business/directory-business.config';
import { ConstantEntity } from '../../entities/business/constant.entity';
import { DepartmentEntity } from '../../entities/business/departament.entity';

@Injectable({
  providedIn: 'root'
})
export class DirectorFormService {

	private _constantService = inject(ConstantService);

	private _ubigeoService = inject(UbigeoService);
	private _typeDirectorService = inject(TypeDirectorService);
	private _specialtyService = inject(SpecialtyService);
	private _sectorService = inject(SectorService);

	private cacheConstant = new Map<string, ConstantEntity[]>();
	private cacheDepartment = new Map<string, DepartmentEntity[]>();
	private cacheTypeDirector = new Map<string, TypeDirectorEntity[]>();
	private cacheSpecialty = new Map<string, SpecialtyEntity[]>();
	private cacheSector = new Map<string, SectorEntity[]>();

	public getTypeDocument(): Observable<ConstantEntity[]> {
		return this.getCachedTypeDocument('typeDocument', CONST_TYPE_DOCUMENT);
	}

	public getGender(): Observable<ConstantEntity[]> {
		return this.getCachedTypeDocument('gender', CONST_GENDER);
	}
	
	public getCargoManager(): Observable<ConstantEntity[]> {
		return this.getCachedTypeDocument('cargoManager', CONST_CARGO_DIRECTOR);
	}

	public getTypeDirector(): Observable<TypeDirectorEntity[]> {
		return this.getCachedTypeDirector('typeDirector')
	}

	public getSpecialty(): Observable<SpecialtyEntity[]> {
		return this.getCachedSpecialty('specialty')
	}

	public getDepartments(): Observable<DepartmentEntity[]> {
		return this.getCachedDepartments('departments');
	}

	public getSector(): Observable<SectorEntity[]> {
		return this.getCachedSector('sector')
	}
	

	private getCachedTypeDocument(key: string, nConValor: number): Observable<ConstantEntity[]> {
		if (this.cacheConstant.has(key)) {
		  return of(this.cacheConstant.get(key)!);
		}
	
		return this._constantService.getAll(nConValor).pipe(
		  tap((data: ResponseEntity<ConstantEntity>) => this.cacheConstant.set(key, data.lstItem)),
		  map((data: ResponseEntity<ConstantEntity>) => data.lstItem)
		);
	}

	private getCachedDepartments(key: string): Observable<DepartmentEntity[]> {
		if (this.cacheDepartment.has(key)) {
		  return of(this.cacheDepartment.get(key)!);
		}

		return this._ubigeoService.getDepartments().pipe(
		  tap((data: ResponseEntity<DepartmentEntity>) => this.cacheDepartment.set(key, data.lstItem)),
		  map((data: ResponseEntity<DepartmentEntity>) => data.lstItem)
		);
	}
	
	private getCachedTypeDirector(key: string): Observable<TypeDirectorEntity[]> {
		if (this.cacheTypeDirector.has(key)) {
		  return of(this.cacheTypeDirector.get(key)!);
		}
		
		return this._typeDirectorService.getAll().pipe(
		  tap((data: ResponseEntity<TypeDirectorEntity>) => this.cacheTypeDirector.set(key, data.lstItem)),
		  map((data: ResponseEntity<TypeDirectorEntity>) => data.lstItem)
		);
	}

	private getCachedSpecialty(key: string): Observable<SpecialtyEntity[]> {
		if (this.cacheSpecialty.has(key)) {
		  return of(this.cacheSpecialty.get(key)!);
		}
		
		return this._specialtyService.getAll().pipe(
		  tap((data: ResponseEntity<SpecialtyEntity>) => this.cacheSpecialty.set(key, data.lstItem)),
		  map((data: ResponseEntity<SpecialtyEntity>) => data.lstItem)
		);
	}

	private getCachedSector(key: string): Observable<SectorEntity[]> {
		if (this.cacheSector.has(key)) {
		  return of(this.cacheSector.get(key)!);
		}
		
		return this._sectorService.getAll().pipe(
		  tap((data: ResponseEntity<SectorEntity>) => this.cacheSector.set(key, data.lstItem)),
		  map((data: ResponseEntity<SectorEntity>) => data.lstItem)
		);
	}

	



}
