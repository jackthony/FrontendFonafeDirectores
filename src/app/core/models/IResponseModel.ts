import { Pagination } from "./IPagination";

export interface ResponseModel<T> {
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
