import { Observable } from "rxjs";
import { ResponseEntity } from "app/modules/admin/shared/domain/entities/response.entity";
import { CompanyAllowanceEntity } from "../../domain/entities/companyAllowance.entity";

export interface CompanyAllowanceInterface {
    getByRuc(sRuc: string, position: number): Observable<ResponseEntity<CompanyAllowanceEntity>>;
}
