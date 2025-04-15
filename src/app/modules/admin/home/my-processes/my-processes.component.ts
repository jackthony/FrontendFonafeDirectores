import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FoContCardComponent } from '@components/fo-cont-card/fo-cont-card.component';
import { CardProcessComponent } from './card-process/card-process.component';
import { LIST_OF_PROCESSES } from 'app/shared/configs/home/my-processes.config';
import { ListOfProcesses } from 'app/shared/interfaces/IListOfProcesses';




@Component({
  selector: 'app-my-processes',
  standalone: true,
  imports: [CommonModule, FoContCardComponent, CardProcessComponent],
  templateUrl: './my-processes.component.html',
  styleUrl: './my-processes.component.scss'
})
export class MyProcessesComponent {
    titleProcess = signal<string>('Mis procesos');

	lstProcess = signal<ListOfProcesses[]>(LIST_OF_PROCESSES);

	enterOption(event: number): void {
		
	}
}
