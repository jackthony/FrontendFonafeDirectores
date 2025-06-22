import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BusinessInterface } from '../../application/repositories/business.interface';
import { BusinessEntity } from '../../domain/entities/business.entity';
import { ResponseEntity } from 'app/modules/admin/shared/domain/entities/response.entity';

@Injectable({
    providedIn: 'root',
})
export class BusinessRepository implements BusinessInterface {
    
    
    private url = `${environment.apiUrlBase}/Usuario`;
    private _http = inject(HttpClient);

    getByPagination(nameEnterprise: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<BusinessEntity>> {
        /* return this._http.get(`${this.url}/GetByPagination`, {
            params: { 'nameEnterprise': nameEnterprise, 'pageIndex': pageIndex, 'pageSize': pageSize }
        }); */

        return of({
            isSuccess: true,
            lstItem: [
                {sNombreCompleto: 'Axel'}
            ],
            pagination: {
                totalRows: 2
            }
        } as any)
    }

    getById(nIdEmpresa: number): Observable<ResponseEntity<BusinessEntity>> {
        return this._http.get<ResponseEntity<BusinessEntity>>(`${this.url}/GetById/${nIdEmpresa}`);
    }

    create(object: BusinessEntity): Observable<ResponseEntity<number>> {
        return this._http.post<ResponseEntity<number>>(`${this.url}/Insert`, object);
    }

    update(object: BusinessEntity): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Update`, object);
    }

    delete(nIdEmpresa: number): Observable<ResponseEntity<boolean>> {
        return this._http.post<ResponseEntity<boolean>>(`${this.url}/Delete/${nIdEmpresa}`, {});
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
