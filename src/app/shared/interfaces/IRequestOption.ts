export class RequestOption {
    url: string;
    resource: string;
    request: any;
    type: ResponseType = 'JSON';
    json: boolean = true;
    method: MethodHttp;
    excludeLoader: string = '0';
    pathVariables: (string | number)[] = [];
    queryParams: QueryParamsApi[] = [];
    constructor(init?: Partial<RequestOption>) {
        if (init) {
          Object.assign(this, init);
        }
    }
}
export interface QueryParamsApi {
    key: string; 
    value: string | number
}
type MethodHttp = "GET" | "POST" | "PUT" | "DELETE";
type ResponseType = 'JSON' | 'BLOB';