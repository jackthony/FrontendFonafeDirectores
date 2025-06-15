import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FoContCardComponent } from '@components/fo-cont-card/fo-cont-card.component';
import { CardProcessComponent } from './card-process/card-process.component';
import { LIST_OF_PROCESSES } from 'app/shared/configs/home/my-processes.config';
import { ListOfProcesses } from 'app/shared/interfaces/IListOfProcesses';
import { Router } from '@angular/router';
import { PermissionButtonDirective } from 'app/shared/directives/permission-button.directive';




@Component({
  selector: 'app-my-processes',
  standalone: true,
  imports: [CommonModule, FoContCardComponent, CardProcessComponent, PermissionButtonDirective],
  templateUrl: './my-processes.component.html',
  styleUrl: './my-processes.component.scss'
})
export class MyProcessesComponent {
    titleProcess = signal<string>('Mis procesos');
    private readonly _router = inject(Router);

	lstProcess = signal<ListOfProcesses[]>(LIST_OF_PROCESSES);

	enterOption(event: string): void {
		if(!event) return;
    	this._router.navigate([event]);
	}
}
