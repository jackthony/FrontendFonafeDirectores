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
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LIST_OF_CANDIDATES, LIST_OF_PROCESSES } from '../../config/my-processes.config';
import { ListOfProcesses } from 'app/shared/interfaces/list-of-processes.interface';
@Component({
  selector: 'app-my-processes',
  standalone: false,
  templateUrl: './my-processes.component.html',
  styleUrl: './my-processes.component.scss'
})
export class MyProcessesComponent {
    titleProcesscandidates = signal<string>('Selección de Candidatos');// Signal reactivo que almacena el título de la sección
    titleProcessMaintenance = signal<string>('Mantenimiento de Sistemas');// Signal reactivo que almacena el título de la sección
    titleProcessMonitoring = signal<string>('Monitoreo de Procesos');// Signal reactivo que almacena el título de la sección
    private readonly _router = inject(Router); // Inyección del servicio Router para manejar la navegación entre vistas    
    lstProcess = signal<ListOfProcesses[]>(LIST_OF_PROCESSES); // Signal reactivo que almacena la lista de procesos, inicializado con los valores de LIST_OF_PROCESSES
    lstProcesscandidates = signal<ListOfProcesses[]>(LIST_OF_CANDIDATES);
    enterOption(event: string): void {
        if(!event) return;
        this._router.navigate([event]);
    }
    
}