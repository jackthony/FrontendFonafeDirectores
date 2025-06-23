import { Observable } from "rxjs";
import { MinistryEntity } from "../../../business-management/domain/entities/ministry.entity";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";

export interface MinistryInterface {
    getAll(): Observable<ResponseEntity<MinistryEntity>>;
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<MinistryEntity>>;
    create(object: MinistryEntity): Observable<ResponseEntity<number>>;
    update(object: MinistryEntity): Observable<ResponseEntity<boolean>>;
    delete(nId: number): Observable<ResponseEntity<boolean>>;
}
