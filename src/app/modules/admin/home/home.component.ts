import { Component, OnInit, signal } from '@angular/core';
import { COLUMNS_ACTIVITIES } from 'app/shared/configs/home.config';
import { HOME_IMPORTS } from 'app/shared/imports/components/home.imports';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';

const dataMock = [
	{
	  fullName: 'Laura Fernández',
	  status: 'Activo',
	  dDate: '2024-04-11',
	  transcurrido: '3 días',
	  enterprise: 'Grupo FONAFE',
	  proponent: 'Carlos Ramírez',
	  solicit: 'Jorge Espinoza',
	},
	{
	  fullName: 'José Salinas',
	  status: 'En revisión',
	  dDate: '2024-03-25',
	  transcurrido: '15 días',
	  enterprise: 'Empresa de Energía',
	  proponent: 'Ana Torres',
	  solicit: 'Lucía Pérez',
	},
	{
	  fullName: 'María Paredes',
	  status: 'Finalizado',
	  dDate: '2024-01-10',
	  transcurrido: '90 días',
	  enterprise: 'Servicios Integrales SAC',
	  proponent: 'Juan Herrera',
	  solicit: 'Sofía Meza',
	}
  ];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [...HOME_IMPORTS],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent implements OnInit {

	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTableActivities = signal<any[]>([]);

	ngOnInit(): void {
		this.headerTable.set(COLUMNS_ACTIVITIES);
		this.dataTableActivities.set(dataMock);
	}


}
