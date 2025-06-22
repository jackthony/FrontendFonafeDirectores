import { Observable } from "rxjs";
import { BusinessEntity } from "../../domain/entities/business.entity";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";

export interface BusinessInterface {
    getByPagination(nameEnterprise: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<BusinessEntity>>;
    getById(nIdEmpresa: number): Observable<ResponseEntity<BusinessEntity>>;
    create(object: BusinessEntity): Observable<ResponseEntity<number>>;
    update(object: BusinessEntity): Observable<ResponseEntity<boolean>>;
    update(object: BusinessEntity): Observable<ResponseEntity<boolean>>;
    delete(nIdEmpresa: number): Observable<ResponseEntity<boolean>>;
    exportExcelEnterprise(): Observable<ArrayBuffer>;
    exportPdfEnterprise(): Observable<ArrayBuffer>;
}
