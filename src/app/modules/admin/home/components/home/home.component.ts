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
import { COLUMNS_ACTIVITIES } from 'app/shared/configs/home/home.config';
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

	// Señal reactiva que almacena las definiciones de las columnas de la tabla.
	headerTable = signal<TableColumnsDefInterface[]>([]);

	// Señal reactiva que almacena los datos de las actividades que se mostrarán en la tabla.
	dataTableActivities = signal<any[]>([]);

	// Método de inicialización que se ejecuta cuando el componente es cargado.
	// Asigna las columnas de la tabla y los datos de las actividades al estado reactivo.
	ngOnInit(): void {
		// Se establece la lista de columnas de la tabla desde COLUMNS_ACTIVITIES.
		this.headerTable.set(COLUMNS_ACTIVITIES);

		// Se establece la lista de datos de actividades desde la constante 'dataMock'.
		this.dataTableActivities.set(dataMock);
	}
}
