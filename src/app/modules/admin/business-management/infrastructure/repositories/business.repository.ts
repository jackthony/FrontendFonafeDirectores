import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BusinessInterface } from '../../application/repositories/business.interface';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';

@Injectable({
    providedIn: 'root',
})
export class BusinessRepository implements BusinessInterface {
    private url = `${environment.apiUrlBase}/Empresa`;
    private _http = inject(HttpClient);

    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<BusinessEntity>> {
        let params = new HttpParams().append('Page', pageIndex).append('PageSize', pageSize);
        if(param) {
            params = params.append('sRazonSocial', param)
        }
        if(filterState !== null) params = params.append('bEstado', filterState);
        return this._http.get<ResponseEntity<BusinessEntity>>(`${this.url}/listar-paginado`, { params });
    }

    getById(nIdEmpresa: number): Observable<ResponseEntity<BusinessEntity>> {
        return this._http.get<ResponseEntity<BusinessEntity>>(`${this.url}/${nIdEmpresa}`);
    }

    create(object: BusinessEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/crear`, object);
    }

    update(object: BusinessEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/actualizar`, object);
    }

    delete(object: BusinessEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/eliminar`, object);
    }

    exportExcelEnterprise(): Observable<ArrayBuffer> {
        return this._http.get(`${this.url}/ExportarExcel`, {
            responseType: 'arraybuffer'
        });
    }

    exportPdfEnterprise(): Observable<ArrayBuffer> {
        return this._http.get(`${this.url}/ExportarPdf`, {
            responseType: 'arraybuffer'
        });
    }
    
}
