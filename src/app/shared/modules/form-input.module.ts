/*******************************************************************************************************
 * Nombre del archivo:  form-input.module.ts
 * Descripción:          Módulo compartido que centraliza los módulos de Angular Material relacionados
 *                       con formularios reactivos y campos de entrada.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    - Incorporación de MatSelectModule para campos tipo dropdown.
 *******************************************************************************************************/
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
/**
 * Módulo compartido que agrupa y exporta componentes de Angular Material
 * y módulos de formularios necesarios para la creación de formularios
 * reactivos consistentes y reutilizables en la aplicación.
 */
@NgModule({
  declarations: [],
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatSelectModule],
  exports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatSelectModule]
})
export class FormInputModule { }