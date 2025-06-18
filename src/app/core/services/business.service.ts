import { inject, Injectable } from '@angular/core';
import { Business } from '@models/business/business.interface';
import { environment } from 'environments/environment';
import { HttpGenericService } from 'app/shared/services/http-generic.service';
import { forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class BusinessService<T> extends HttpGenericService<T> {

    private _spinner = inject(NgxSpinnerService); // Servicio para mostrar un spinner de carga
    private _http = inject(HttpClient); // Servicio para mostrar acceder a peticiones HTTP

    constructor() {
        super(`${environment.apiUrlBase}/EMP_Empresa`);
    }

    exportExcelEnterprise() {
        this.exportByEnterprise('ExportarExcel', 'xlsx');
    }

    exportPdfEnterprise() {
        this.exportByEnterprise('ExportarPdf', 'pdf');
        
    }
    exportByEnterprise(resource: string, type: string) {
        const mimeType = type === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel';
        this._spinner.show();
        const url = `${environment.apiUrlBase}/EMP_Empresa/${resource}`;
        this._http.get(url, {
            responseType: 'arraybuffer'
        } ).subscribe({
            next: ((response: ArrayBuffer) => {
                const blob = new Blob([response], { type: mimeType });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                document.body.appendChild(a);
                a.setAttribute("style", "display: none");
                a.href = url;
                a.download = `reporte_empresas.${type}`; // Nombre del archivo a descargar
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
                this._spinner.hide();
            })
        })
    };
}
