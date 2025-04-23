import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

import { DialogConfirmationService } from 'app/shared/services/dialog-confirmation.service';

import { FoButtonComponent } from '@components/fo-button/fo-button.component';
import { FoContCardComponent } from '@components/fo-cont-card/fo-cont-card.component';
import { FoTableComponent } from '@components/fo-table/fo-table.component';
import { COLUMNS_DIRECTORY_BUSINESS, CONFIG_DELETE_DIALOG_DIRECTORY_BUSINESS } from 'app/shared/configs/business-management/directory-business.config';
import { IconOption } from 'app/shared/interfaces/IGenericIcon';
import { TableColumnsDefInterface } from 'app/shared/interfaces/ITableColumnsDefInterface';
import { FormDirectoryComponent } from './form-directory/form-directory.component';

const mockDirectory = [
    {
        fullName: "Juan Pérez García",
        typeDocument: "DNI",
        document: "12345678",
        role: "Gerente General",
        typeDirector: "Principal"
    },
    {
        fullName: "María López Torres",
        typeDocument: "DNI",
        document: "87654321",
        role: "Directora Ejecutiva",
        typeDirector: "Suplente"
    },
    {
        fullName: "Carlos Mendoza Ríos",
        typeDocument: "Pasaporte",
        document: "X123456",
        role: "Asesor Legal",
        typeDirector: "Independiente"
    },
    {
        fullName: "Ana Sofía Ramírez",
        typeDocument: "Carné de extranjería",
        document: "CE987654",
        role: "Consultora Externa",
        typeDirector: "Invitado"
    },
    {
        fullName: "Luis Alberto Quispe",
        typeDocument: "DNI",
        document: "45678912",
        role: "Director Financiero",
        typeDirector: "Principal"
    }
];


@Component({
  selector: 'app-directory-business',
  standalone: true,
  imports: [CommonModule, FoContCardComponent, FoButtonComponent, FoTableComponent, FormDirectoryComponent],
  templateUrl: './directory-business.component.html',
  styleUrl: './directory-business.component.scss'
})
export class DirectoryBusinessComponent implements OnInit {

	private _dialogConfirmationService = inject(DialogConfirmationService);
	
	textButtonNew = signal<string>('Agregar director');
	iconButtonNew = signal<string>('mat_outline:add_circle_outline');
	headerTable = signal<TableColumnsDefInterface[]>([]);
	dataTableDirectory = signal<any[]>([]);
	iconsTable = signal<IconOption<any>[]>([]);

	newFormDirectory = signal<boolean>(false);
	

	ngOnInit(): void {
		this.headerTable.set(COLUMNS_DIRECTORY_BUSINESS);
		this.dataTableDirectory.set(mockDirectory);
		this.iconsTable.set(this.defineIconsTable())
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
		this._dialogConfirmationService.open(CONFIG_DELETE_DIALOG_DIRECTORY_BUSINESS);
	}

	openRegisterDirectory(): void {
		this.newFormDirectory.set(true);
	}

}
