/*******************************************************************************************************
 * Nombre del archivo:  boolean.pipe.ts
 * Descripción:          Pipe personalizado que transforma valores booleanos o numéricos en cadenas de texto "Sí" o "No".
 *                       Se utiliza para mostrar "Sí" cuando el valor es verdadero o distinto de cero,
 *                       y "No" cuando el valor es falso o igual a cero, facilitando la presentación 
 *                       de valores booleanos o numéricos de forma más legible en la interfaz de usuario.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial para transformar valores booleanos y numéricos en texto.
 *******************************************************************************************************/
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'boolean',
  standalone: true
})
export class BooleanPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (value == 0 || value == false) return "No";
    else return "Sí";
  }
}