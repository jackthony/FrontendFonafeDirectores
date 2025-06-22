import { Observable } from "rxjs";
import { ResponseEntity } from "../../domain/entities/response.entity";
import { SpecialtyEntity } from "../../domain/entities/specialty.entity";

export interface SpecialtyInterface {
    getAll(): Observable<ResponseEntity<SpecialtyEntity>>;
    getByPagination(param: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<SpecialtyEntity>>;
    create(object: SpecialtyEntity): Observable<ResponseEntity<number>>;
    update(object: SpecialtyEntity): Observable<ResponseEntity<boolean>>;
    delete(nId: number): Observable<ResponseEntity<boolean>>;
}
