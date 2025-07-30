/*******************************************************************************************************
 * Nombre del archivo:  archiving-process.service.ts
 * Descripción:          Servicio encargado de gestionar el proceso de archivo, incluyendo la carga y descarga 
 *                       de archivos. Este servicio proporciona métodos para cargar un archivo desde el sistema de 
 *                       archivos local del usuario y para descargar archivos a partir de un `Observable` que 
 *                       emite el contenido del archivo.
 *                       Además, el servicio utiliza el componente `NgxSpinnerService` para mostrar un spinner 
 *                       durante el proceso de descarga, mejorando la experiencia del usuario al indicar que 
 *                       la operación está en progreso.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial de los métodos para cargar y descargar archivos con spinner.
 *******************************************************************************************************/
import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class ArchivingProcessService {
    private _spinner = inject(NgxSpinnerService);
    uploadFile(type?: string): Promise<File> {
        return new Promise((resolve, reject) => {
            try {
                const inputFile = document.createElement('input');
                inputFile.type = 'file';
                inputFile.accept = type ?? '*/*'; 
                inputFile.style.display = 'none';
    
                inputFile.addEventListener('change', async (event: Event) => {
                    try {
                        const target = event.target as HTMLInputElement;
                        const files = target.files as FileList;
                        if (files) 
                            resolve(files[0]); 
                        else 
                            resolve(null);
                    } catch (error) {
                        reject(error); 
                    } finally {
                        document.body.removeChild(inputFile);
                    }
                });
                document.body.appendChild(inputFile);
                inputFile.click();
            } catch (error) {
                reject(error);
            }
        });
    }
    downloadFile(observable: Observable<ArrayBuffer>, name: string, mimeType: string) {
        this._spinner.show();
        observable
        .pipe( finalize(() => this._spinner.hide()))
        .subscribe({
            next: ((response: ArrayBuffer) => {
                const blob = new Blob([response], { type: mimeType });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                document.body.appendChild(a);
                a.setAttribute("style", "display: none");
                a.href = url;
                a.download = `${name}`;
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            })
        })
    };
}