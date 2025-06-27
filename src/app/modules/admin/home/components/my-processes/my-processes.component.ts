/*******************************************************************************************************
 * Nombre del componente: MyProcessesComponent
 * Descripción:           Componente que muestra la sección "Mis procesos", permitiendo al usuario
 *                        visualizar y acceder a los distintos módulos disponibles según su perfil.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 * Última modificación:   23/06/2025 por Daniel Alva
 * Cambios recientes:     - Implementación inicial del componente.
 *                        - Integración de señales reactivas y navegación programática.
 *                        - Carga dinámica de la lista de procesos desde archivo de configuración.
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { CardProcessComponent } from '../card-process/card-process.component';
import { LIST_OF_PROCESSES } from 'app/shared/configs/home/my-processes.config';
import { ListOfProcesses } from 'app/shared/interfaces/IListOfProcesses';
import { Router } from '@angular/router';
import { PermissionButtonDirective } from 'app/shared/directives/permission-button.directive';
import { FoContCardComponent } from '../../../shared/components/fo-cont-card/fo-cont-card.component';
@Component({
  selector: 'app-my-processes',
  standalone: true,
  imports: [CommonModule, FoContCardComponent, CardProcessComponent, PermissionButtonDirective],
  templateUrl: './my-processes.component.html',
  styleUrl: './my-processes.component.scss'
})
export class MyProcessesComponent {
    titleProcess = signal<string>('Mis procesos');// Signal reactivo que almacena el título de la sección
    private readonly _router = inject(Router); // Inyección del servicio Router para manejar la navegación entre vistas    
    lstProcess = signal<ListOfProcesses[]>(LIST_OF_PROCESSES); // Signal reactivo que almacena la lista de procesos, inicializado con los valores de LIST_OF_PROCESSES
    enterOption(event: string): void {
        if(!event) return;
        this._router.navigate([event]);
    }
}