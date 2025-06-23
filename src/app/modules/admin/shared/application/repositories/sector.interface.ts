import { Observable } from "rxjs";
import { IndustryEntity } from "../../domain/entities/industry.entity";
import { ResponseEntity } from "../../domain/entities/response.entity";
import { SectorEntity } from "../../domain/entities/sector.entity";

export interface SectorInterface {
    getAll(): Observable<ResponseEntity<SectorEntity>>;
    getByPagination(param: string, pageIndex: number, pageSize: number, filterState: boolean | null): Observable<ResponseEntity<SectorEntity>>;
    create(object: SectorEntity): Observable<ResponseEntity<number>>;
    update(object: SectorEntity): Observable<ResponseEntity<boolean>>;
    delete(object: SectorEntity): Observable<ResponseEntity<boolean>>;
}
