import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-info-candidates',
  standalone: false,
  templateUrl: './info-candidates.component.html',
  styleUrl: './info-candidates.component.scss'
})
export class InfoCandidatesComponent {
    lstSendingApplication = signal([
		{ key: 1 ,value: 'Apto' },
		{ key: 2 ,value: 'No apto' },
		{ key: 3 ,value: 'Observado' },
		{ key: 4 ,value: 'Subsanado' }
	]);
}
