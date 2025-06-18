import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestOption } from '../interfaces/IRequestOption';
import { ResponseModel } from '@models/IResponseModel';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService<T> {

  // Inyecta el HttpClient para realizar solicitudes HTTP
  private _http = inject(HttpClient);

  constructor() { }

  /**
   * Método principal para realizar una solicitud HTTP.
   * @param request La solicitud HTTP que contiene la URL, parámetros y cuerpo.
   * @returns Un Observable con la respuesta del servidor.
   */
  public http(request: RequestOption): Observable<ResponseModel<T>> {
    return this._callHttpClient(request); // Llama al método privado para realizar la solicitud HTTP
  }

  /**
   * Método privado para manejar las solicitudes HTTP según el tipo de método (GET, POST, PUT, DELETE).
   * @param request La solicitud HTTP que contiene los detalles de la misma.
   * @returns Un Observable con la respuesta del servidor.
   */
  private _callHttpClient(request: RequestOption): Observable<ResponseModel<T>> {
    let rpta: any;

    // Determina el tipo de solicitud y realiza la llamada correspondiente
    switch (request.method) {
      case 'GET':
        // Si el tipo de respuesta es 'BLOB', realiza una solicitud para obtener un archivo binario
        if(request.type === 'BLOB') 
          rpta = this._http.get<Blob>(request.url,{ params: this._getHttpParams(request.queryParams), responseType: 'blob' as 'json' });
        else{
          // Si no es 'BLOB', realiza una solicitud normal de tipo GET
          rpta = this._http.get<ResponseModel<T>>(request.url,{ params: this._getHttpParams(request.queryParams) });
        }
        break;
      case 'DELETE':
        // Realiza una solicitud DELETE con los parámetros proporcionados
        rpta = this._http.delete<ResponseModel<T>>(request.url, { params: this._getHttpParams(request.queryParams) });
        break;
      case 'PUT':
        // Realiza una solicitud PUT con el cuerpo de la solicitud
        rpta = this._http.put<ResponseModel<T>>(request.url, request.request);
        break;
      case 'POST':
        // Realiza una solicitud POST con el cuerpo de la solicitud
        rpta = this._http.post<ResponseModel<T>>(request.url, request.request);
        break;
    }
    return rpta; // Retorna el Observable con la respuesta del servidor
  }

  /**
   * Método privado para convertir los parámetros de la solicitud en un objeto HttpParams.
   * @param queryParams Los parámetros de la consulta que se agregarán a la solicitud.
   * @returns Un objeto HttpParams con los parámetros de la consulta.
   */
  private _getHttpParams(queryParams: { key: string; value: string | number }[]): HttpParams {
    
    let paramsHttp: HttpParams = new HttpParams(); // Inicializa el objeto HttpParams vacío
    queryParams.forEach(query => {
      paramsHttp = paramsHttp.append(query.key, query.value); // Añade cada parámetro a HttpParams
    });

    return paramsHttp; // Retorna el objeto HttpParams con todos los parámetros agregados
  }

  /**
   * Método para realizar solicitudes con parámetros en la URL.
   * @param request La solicitud HTTP con la URL, parámetros, y cuerpo.
   * @returns Un Observable con la respuesta del servidor.
   */
  callHttpParameters(request: RequestOption): Observable<ResponseModel<T>> {
    let url: string = request.url;

    // Si hay variables en la ruta (pathVariables), las añade a la URL
    const pathsJoin = request?.pathVariables.join("/"); 
    if (pathsJoin) url += `/${pathsJoin}`; // Añade las variables de la ruta a la URL

    request.url = url; // Actualiza la URL de la solicitud con las variables

    return this.http(request); // Realiza la solicitud HTTP con la URL y parámetros actualizados
  }
}
