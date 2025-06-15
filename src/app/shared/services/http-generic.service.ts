import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpRequestService } from './http-request.service';
import { RequestOption } from '../interfaces/IRequestOption';
import { ResponseModel } from '@models/IResponseModel';

@Injectable({
  providedIn: 'root'
})
export class HttpGenericService<T> {

  protected _httpRequest = inject(HttpRequestService);
  constructor(private _url: string = "") { }

  getByPagination(request: RequestOption): Observable<ResponseModel<T>> {
    request.url = ` ${this._url}/GetByPagination`;
    request.method = "GET";

    return this._httpRequest.callHttpParameters(request);
  }

  get(request: RequestOption): Observable<ResponseModel<T>> {
    request.url = `${this._url}/${request.resource ?? ''}`;
    request.method = "GET";

    return this._httpRequest.callHttpParameters(request);
  }

  create(request: RequestOption): Observable<ResponseModel<T>> {
    request.method = "POST";
    request.url = `${this._url}/${request.resource ?? 'Insert'}`;

    return this._httpRequest.http(request);
  }

  update(request: RequestOption): Observable<ResponseModel<T>> {
    request.method = "POST";
    request.url = `${this._url}/${request.resource ?? 'Update'}`;

    return this._httpRequest.http(request);
  }

  delete(request: RequestOption): Observable<ResponseModel<T>> {
    request.method = "POST";
    request.url = `${this._url}/${request.resource ?? 'Delete'}`;

    return this._httpRequest.callHttpParameters(request);
  }

  post(request: RequestOption): Observable<ResponseModel<T>> {
    request.method = "POST";
    request.url = `${this._url}/${request.resource}`;

    return this._httpRequest.callHttpParameters(request);
  }
}
