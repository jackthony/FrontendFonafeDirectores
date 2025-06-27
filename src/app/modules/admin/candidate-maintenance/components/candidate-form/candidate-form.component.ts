/*******************************************************************************************************
 * Nombre del componente: CandidateFormComponent
 * Descripción:           Componente encargado de gestionar el formulario de candidatos. 
 *                        Permite capturar información relevante para la gestión de postulantes 
 *                        dentro del módulo de administración o gestión de negocio.
 * Autor:                 Daniel Alva
 * Fecha de creación:     23/06/2025
 * Última modificación:   23/06/2025 por Daniel Alva
 * Cambios recientes:     - Implementación inicial con estructura standalone.
 *                        - Inclusión de navegación hacia la ruta 'home'.
 *******************************************************************************************************/
import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CANDIDATE_FORM_IMPORTS } from 'app/shared/imports/business-management/candidate-form.import';
@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [...CANDIDATE_FORM_IMPORTS],
  templateUrl: './candidate-form.component.html',
  styleUrl: './candidate-form.component.scss'
})
export class CandidateFormComponent {
  private readonly _router = inject(Router); 
  form: FormGroup;
    returnInit(): void {
    this._router.navigate(['home']);
  }
}