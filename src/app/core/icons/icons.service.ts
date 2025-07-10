/*******************************************************************************************************
 * Nombre del archivo:  icons.service.ts
 * Descripción:          Servicio para registrar y gestionar iconos SVG en la aplicación Angular utilizando
 *                       `MatIconRegistry` y `DomSanitizer`. Este servicio se encarga de registrar
 *                       diferentes conjuntos de iconos SVG desde archivos locales para que puedan
 *                       ser utilizados en la aplicación.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Se añadieron múltiples conjuntos de iconos SVG de diferentes fuentes.
 *******************************************************************************************************/
import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
@Injectable({ providedIn: 'root' })
export class IconsService {
    /**
     * Constructor
     */
    constructor() {
        const domSanitizer = inject(DomSanitizer);
        const matIconRegistry = inject(MatIconRegistry);
        matIconRegistry.addSvgIconSet(
            domSanitizer.bypassSecurityTrustResourceUrl(
                'icons/material-twotone.svg'
            )
        );
        matIconRegistry.addSvgIconSetInNamespace(
            'mat_outline',
            domSanitizer.bypassSecurityTrustResourceUrl(
                'icons/material-outline.svg'
            )
        );
        matIconRegistry.addSvgIconSetInNamespace(
            'mat_solid',
            domSanitizer.bypassSecurityTrustResourceUrl(
                'icons/material-solid.svg'
            )
        );
        matIconRegistry.addSvgIconSetInNamespace(
            'feather',
            domSanitizer.bypassSecurityTrustResourceUrl('icons/feather.svg')
        );
        matIconRegistry.addSvgIconSetInNamespace(
            'heroicons_outline',
            domSanitizer.bypassSecurityTrustResourceUrl(
                'icons/heroicons-outline.svg'
            )
        );
        matIconRegistry.addSvgIconSetInNamespace(
            'heroicons_solid',
            domSanitizer.bypassSecurityTrustResourceUrl(
                'icons/heroicons-solid.svg'
            )
        );
        matIconRegistry.addSvgIconSetInNamespace(
            'heroicons_mini',
            domSanitizer.bypassSecurityTrustResourceUrl(
                'icons/heroicons-mini.svg'
            )
        );
        matIconRegistry.addSvgIconSetInNamespace(
            'fonafe',
            domSanitizer.bypassSecurityTrustResourceUrl(
                'icons/fonafe.svg'
            )
        );
    }
}