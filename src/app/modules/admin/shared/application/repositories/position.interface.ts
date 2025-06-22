import { Observable } from "rxjs";
import { ResponseEntity } from "../../domain/entities/response.entity";
import { PositionEntity } from "../../domain/entities/position.entity";

export interface PositionInterface {
    getAll(): Observable<ResponseEntity<PositionEntity>>;
    getByPagination(param: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<PositionEntity>>;
    create(object: PositionEntity): Observable<ResponseEntity<number>>;
    update(object: PositionEntity): Observable<ResponseEntity<boolean>>;
    delete(nId: number): Observable<ResponseEntity<boolean>>;
}
