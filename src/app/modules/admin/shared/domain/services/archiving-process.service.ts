import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ArchivingProcessService {
    private _spinner = inject(NgxSpinnerService); // Inyecta el servicio NgxSpinnerService para mostrar un spinner de carga

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
                        //const uploadFile = await this.selectedFiles(event); 
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
