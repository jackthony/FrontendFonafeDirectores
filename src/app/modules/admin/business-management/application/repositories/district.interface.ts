import { Observable } from "rxjs";
import { DistrictEntity } from "../../domain/entities/district.entity";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";

export interface DistrictInterface {
    getByPagination(sIdProvincia: string): Observable<ResponseEntity<DistrictEntity>>;
}
