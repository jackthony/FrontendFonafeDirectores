import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { COLUMNS_BUSINESS_MANAGEMENT, CONFIG_DELETE_DIALOG_BUSINESS } from 'app/shared/configs/business-management/business-management.config';
import { BUSINESS_MANAGEMENT_IMPORTS } from 'app/shared/imports/business-management/business-management.imports';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';

export const mockDataBusiness = [
	{
	  enterprise: "TechNova S.A.",
	  ruc: "20456789123",
	  companyName: "Desarrollos Urbanos S.A.",
	  proponent: "Carlos Gómez",
	  sector: "Tecnología",
	  location: "Cusco, Perú"
	},
	{
	  enterprise: "AgroPerú S.R.L.",
	  ruc: "20345678901",
	  companyName: "Importaciones Globales E.I.R.L.",
	  proponent: "Lucía Ríos",
	  sector: "Agroindustria",
	  location: "Piura, Perú"
	},
	{
	  enterprise: "Constructora Andes S.A.C.",
	  ruc: "20567891234",
	  companyName: "Sistemas del Sur S.R.L.",
	  proponent: "Andrés Torres",
	  sector: "Construcción",
	  location: "Lima, Perú"
	},
	{
	  enterprise: "EcoSoluciones E.I.R.L.",
	  ruc: "20678912345",
	  companyName: "Consultores Empresariales SAC",
	  proponent: "María Fernández",
	  sector: "Consultoría",
	  location: "Trujillo, Perú"
	},
	{
	  enterprise: "RedDigital Corp.",
	  ruc: "20123456789",
	  companyName: "Servicios Generales Innovate S.A.C.",
	  proponent: "Jorge Salazar",
	  sector: "Comercio",
	  location: "Arequipa, Perú"
	}
  ];

@Component({
  selector: 'app-business-management',
  standalone: true,
  imports: [...BUSINESS_MANAGEMENT_IMPORTS],
  templateUrl: './business-management.component.html',
  styleUrl: './business-management.component.scss'
})
export class BusinessManagementComponent {
	private _matDialog: MatDialog = inject(MatDialog);
	private _dialogConfirmationService = inject(DialogConfirmationService);

	placeHolderSearch = signal<string>('Busca por nombre de empresa');
	addEnterprise = signal<string>('Agregar empresa');
	
    titleModule = signal<string>('Gestión de empresas');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTableBusiness = signal<any[]>([]);
	iconsTable = signal<IconOption<any>[]>([]);
	
	ngOnInit(): void {
		this.headerTable.set(COLUMNS_BUSINESS_MANAGEMENT);
		this.dataTableBusiness.set(mockDataBusiness);
		this.iconsTable.set(this.defineIconsTable())
	}

	openFormDialog(): void {
		//redireccionar
	}


	defineIconsTable(): IconOption<any>[]{
        const iconEdit = new IconOption("create", "mat_outline", "Editar");
        const iconDelete = new IconOption("delete", "mat_outline", "Eliminar");

		iconDelete.actionIcono = (data: any) => {
            this.openDialogDelete();
        };

    
        return [iconEdit, iconDelete];
    }

	openDialogDelete(): void {
		this._dialogConfirmationService.open(CONFIG_DELETE_DIALOG_BUSINESS);
	}
}
