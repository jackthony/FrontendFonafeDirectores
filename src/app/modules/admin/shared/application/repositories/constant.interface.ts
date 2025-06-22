import { Observable } from "rxjs";
import { ConstantEntity } from "../../domain/entities/constant.entity";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";

export interface ConstantInterface {
    getAll(code: number): Observable<ResponseEntity<ConstantEntity>>;
}
