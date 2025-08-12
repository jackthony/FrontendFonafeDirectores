import { Component } from '@angular/core';

@Component({
  selector: 'app-tab-documents',
  standalone: false,
  templateUrl: './tab-documents.component.html',
  styleUrl: './tab-documents.component.scss',
})
export class TabDocumentsComponent {
    listaPropuesta = [
		{ id: 1, value: "Oficio sector" },
		{ id: 2, value: "Documentos, estudios, experiencia" },
		{ id: 3, value: "DDJJ FONAFE" },
		{ id: 4, value: "DDJJ ACI" },
		{ id: 5, value: "Antecedentes policiales" },
		{ id: 6, value: "Antecedentes judiciales" },
		{ id: 7, value: "Antecedentes penales" },
		{ id: 8, value: "CV" }
	  ];
	  
	  // Lista de verificación filtros
	listaFiltros = [
		{ id: 1, value: "Ficha pre evaluación" },
		{ id: 2, value: "Opinión legal" },
		{ id: 3, value: "RENIEC" },
		{ id: 4, value: "SUNEDU" },
		{ id: 5, value: "DAM" },
		{ id: 6, value: "RNSSC" },
		{ id: 7, value: "SENTINEL" },
		{ id: 8, value: "SBS" },
		{ id: 9, value: "SUNAT CONS. RUC" },
		{ id: 10, value: "OSCE PROV. SANC." },
		{ id: 11, value: "INF CONT POST" },
		{ id: 12, value: "DDJJ CONTRAL." },
		{ id: 13, value: "Afiliación partidos" },
		{ id: 14, value: "Sent. que postulan al congreso" },
		{ id: 15, value: "Google" },
		{ id: 16, value: "ONP" },
		{ id: 17, value: "Reg. negativo" },
		{ id: 18, value: "Velocímetro" }
	  ];
}
