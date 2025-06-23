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
    // Signal reactivo que almacena el título de la sección
    titleProcess = signal<string>('Mis procesos');
    
    // Inyección del servicio Router para manejar la navegación entre vistas
    private readonly _router = inject(Router);

    // Signal reactivo que almacena la lista de procesos, inicializado con los valores de LIST_OF_PROCESSES
    lstProcess = signal<ListOfProcesses[]>(LIST_OF_PROCESSES);

    // Método que maneja la acción de entrar a una opción de proceso. Navega a la ruta correspondiente.
    enterOption(event: string): void {
        // Si el evento es vacío, no hacer nada
        if(!event) return;
        
        // Navegar a la ruta indicada en el evento (probablemente una ruta definida en el sistema de rutas de Angular)
        this._router.navigate([event]);
    }
}