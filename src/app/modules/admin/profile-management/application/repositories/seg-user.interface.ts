import { Observable } from "rxjs";
import { ResponseEntity } from "../../domain/entities/response.entity";
import { SegUserEntity } from "../../domain/entities/seg-user.entity";
import { SegUserChangePasswordEntity } from "../../domain/entities/seg-user-change-password.entity";

export interface SegUserInterface {
    getByPagination(userName: string, pageIndex: number, pageSize: number): Observable<ResponseEntity<SegUserEntity>>;
    create(object: SegUserEntity): Observable<ResponseEntity<number>>;
    update(object: SegUserEntity): Observable<ResponseEntity<boolean>>;
    updatePassword(object: SegUserChangePasswordEntity): Observable<ResponseEntity<boolean>>;
}
