import { Pagination } from "./pagination.entity";

export interface ResponseEntity<T> {
    clientName: string;
    isSuccess: boolean;
    lstError: string[];
    lstItem: T[];
    pagination?: Pagination;
    resultado: number;
    serverName: string;
    ticket: string;
    userName: string;
    item: T;
}
