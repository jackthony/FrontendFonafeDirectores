import { Observable } from "rxjs";
import { IndustryEntity } from "../../domain/entities/industry.entity";
import { ResponseEntity } from "../../domain/entities/response.entity";

export interface IndustryInterface {
    getAll(): Observable<ResponseEntity<IndustryEntity>>;
    getByPagination(param: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<IndustryEntity>>;
    create(object: IndustryEntity): Observable<ResponseEntity<number>>;
    update(object: IndustryEntity): Observable<ResponseEntity<boolean>>;
    delete(nId: number): Observable<ResponseEntity<boolean>>;
}
