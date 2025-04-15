import { Component, signal } from '@angular/core';
import { COLUMNS_PROFILE_MANAGEMENT } from 'app/shared/configs/profile-management/profile-management.config';
import { PROFILE_MANAGEMENT_IMPORTS } from 'app/shared/imports/components/profile-management.imports';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';

export const mockData = [
	{
	  "fullName": "Carlos Gutiérrez",
	  "status": "Analista de Datos",
	  "dDate": "2025-03-14",
	  "transcurrido": "Activo",
	  "enterprise": "2025-01-10",
	  "proponent": "2025-03-01",
	  "solicit": "carlos.gutierrez@example.com",
	  "clave": "*******"
	},
	{
	  "fullName": "Lucía Fernández",
	  "status": "Coordinadora de Proyectos",
	  "dDate": "2025-01-22",
	  "transcurrido": "Inactivo",
	  "enterprise": "2024-11-08",
	  "proponent": "2025-02-18",
	  "solicit": "lucia.fernandez@example.com",
	  "clave": "*******"
	},
	{
	  "fullName": "Miguel Torres",
	  "status": "Jefe de TI",
	  "dDate": "2024-12-30",
	  "transcurrido": "Activo",
	  "enterprise": "2024-06-14",
	  "proponent": "2025-01-12",
	  "solicit": "miguel.torres@example.com",
	  "clave": "*******"
	},
	{
	  "fullName": "Paola Rivas",
	  "status": "Diseñadora UX",
	  "dDate": "2025-04-01",
	  "transcurrido": "Activo",
	  "enterprise": "2025-01-28",
	  "proponent": "2025-03-27",
	  "solicit": "paola.rivas@example.com",
	  "clave": "*******"
	},
	{
	  "fullName": "Javier Mendoza",
	  "status": "Desarrollador Backend",
	  "dDate": "2025-02-11",
	  "transcurrido": "Suspendido",
	  "enterprise": "2024-08-30",
	  "proponent": "2025-02-15",
	  "solicit": "javier.mendoza@example.com",
	  "clave": "*******"
	},
	{
	  "fullName": "Andrea Salas",
	  "status": "Scrum Master",
	  "dDate": "2025-03-10",
	  "transcurrido": "Activo",
	  "enterprise": "2024-10-01",
	  "proponent": "2025-03-05",
	  "solicit": "andrea.salas@example.com",
	  "clave": "*******"
	},
	{
	  "fullName": "José Herrera",
	  "status": "QA Senior",
	  "dDate": "2025-02-28",
	  "transcurrido": "Inactivo",
	  "enterprise": "2023-12-12",
	  "proponent": "2025-02-01",
	  "solicit": "jose.herrera@example.com",
	  "clave": "*******"
	},
	{
	  "fullName": "Mariana Chávez",
	  "status": "Product Owner",
	  "dDate": "2025-01-17",
	  "transcurrido": "Activo",
	  "enterprise": "2024-05-20",
	  "proponent": "2025-03-09",
	  "solicit": "mariana.chavez@example.com",
	  "clave": "*******"
	},
	{
	  "fullName": "Ricardo Núñez",
	  "status": "DevOps Engineer",
	  "dDate": "2024-11-15",
	  "transcurrido": "Activo",
	  "enterprise": "2024-04-10",
	  "proponent": "2025-01-30",
	  "solicit": "ricardo.nunez@example.com",
	  "clave": "*******"
	},
	{
	  "fullName": "Fiorella Zapata",
	  "status": "Community Manager",
	  "dDate": "2025-03-02",
	  "transcurrido": "Inactivo",
	  "enterprise": "2024-09-25",
	  "proponent": "2025-02-28",
	  "solicit": "fiorella.zapata@example.com",
	  "clave": "*******"
	}
  ];

@Component({
  selector: 'app-profile-management',
  standalone: true,
  imports: [...PROFILE_MANAGEMENT_IMPORTS],
  templateUrl: './profile-management.component.html',
  styleUrl: './profile-management.component.scss'
})
export default class ProfileManagementComponent {
    titleModule = signal<string>('Gestión de perfiles');

	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTableActivities = signal<any[]>([]);
	iconsTable = signal<IconOption<any>[]>([]);

	

	ngOnInit(): void {
		this.headerTable.set(COLUMNS_PROFILE_MANAGEMENT);
		this.dataTableActivities.set(mockData);
		this.iconsTable.set(this.defineIconsTable())
	}

	defineIconsTable(): IconOption<any>[]{
        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconDelete = new IconOption("delete", "mat_outline", "Eliminar");

    
        return [iconEdit, iconDelete];
    }
}
