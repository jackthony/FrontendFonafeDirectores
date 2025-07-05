/*******************************************************************************************************
 * Nombre del componente: HomeComponent
 * Descripción:           Componente principal de la vista "Inicio" del sistema. Muestra un resumen de 
 *                        actividades recientes en una tabla interactiva. Las columnas y los datos son 
 *                        configurables mediante señales reactivas.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 * Última modificación:   23/06/2025 por Daniel Alva
 * Cambios recientes:     - Integración de tabla de actividades con señales reactivas.
 *                        - Carga inicial de columnas y datos mockeados.
 *******************************************************************************************************/
import { Component, OnInit, signal } from '@angular/core';
import { TableColumnsDefInterface } from 'app/shared/interfaces/table-columns-def.interface';
import { COLUMNS_ACTIVITIES } from '../../config/home.config';
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
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
	headerTable = signal<TableColumnsDefInterface[]>([]); // Señal que almacena la definición de las columnas de la tabla.
	dataTableActivities = signal<any[]>([]);
		/**
	 * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
	 * Asigna los encabezados de la tabla y los datos mockeados.
	 */
	ngOnInit(): void {
		this.headerTable.set(COLUMNS_ACTIVITIES);
		this.dataTableActivities.set(dataMock);
	}
}
