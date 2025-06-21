import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestOption } from '../interfaces/IRequestOption';
import { ResponseModel } from '@models/IResponseModel';
@Injectable({
  providedIn: 'root'
})
export class HttpRequestService<T> {
  private _http = inject(HttpClient);
  constructor() { }
  /**
   * Método principal para realizar una solicitud HTTP.
   * @param request La solicitud HTTP que contiene la URL, parámetros y cuerpo.
   * @returns Un Observable con la respuesta del servidor.
   */
  public http(request: RequestOption): Observable<ResponseModel<T>> {
    return this._callHttpClient(request);
  }
  /**
   * Método privado para manejar las solicitudes HTTP según el tipo de método (GET, POST, PUT, DELETE).
   * @param request La solicitud HTTP que contiene los detalles de la misma.
   * @returns Un Observable con la respuesta del servidor.
   */
  private _callHttpClient(request: RequestOption): Observable<ResponseModel<T>> {
    let rpta: any;
    switch (request.method) {
      case 'GET':
        if(request.type === 'BLOB') 
          rpta = this._http.get<Blob>(request.url,{ params: this._getHttpParams(request.queryParams), responseType: 'blob' as 'json' });
        else{
          rpta = this._http.get<ResponseModel<T>>(request.url,{ params: this._getHttpParams(request.queryParams) });
        }
        break;
      case 'DELETE':
        rpta = this._http.delete<ResponseModel<T>>(request.url, { params: this._getHttpParams(request.queryParams) });
        break;
      case 'PUT':
        rpta = this._http.put<ResponseModel<T>>(request.url, request.request);
        break;
      case 'POST':
        rpta = this._http.post<ResponseModel<T>>(request.url, request.request);
        break;
    }
    return rpta;
  }
  /**
   * Método privado para convertir los parámetros de la solicitud en un objeto HttpParams.
   * @param queryParams Los parámetros de la consulta que se agregarán a la solicitud.
   * @returns Un objeto HttpParams con los parámetros de la consulta.
   */
  private _getHttpParams(queryParams: { key: string; value: string | number }[]): HttpParams {
    let paramsHttp: HttpParams = new HttpParams();
    queryParams.forEach(query => {
      paramsHttp = paramsHttp.append(query.key, query.value);
    });
    return paramsHttp;
  }
  /**
   * Método para realizar solicitudes con parámetros en la URL.
   * @param request La solicitud HTTP con la URL, parámetros, y cuerpo.
   * @returns Un Observable con la respuesta del servidor.
   */
  callHttpParameters(request: RequestOption): Observable<ResponseModel<T>> {
    let url: string = request.url;
    const pathsJoin = request?.pathVariables.join("/"); 
    if (pathsJoin) url += `/${pathsJoin}`;
    request.url = url;
    return this.http(request);
  }
}