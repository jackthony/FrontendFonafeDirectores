/*******************************************************************************************************
 * Nombre del archivo:  empty.pipe.ts
 * Descripción:          Pipe personalizado que transforma valores vacíos o nulos en un guion ("-").
 *                       Se utiliza para mostrar un guion en lugar de valores vacíos, nulos, cadenas vacías
 *                       o cadenas con una fecha predeterminada (01/01/0001), lo que ayuda a mejorar la 
 *                       presentación de datos en la interfaz de usuario.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación inicial para transformar valores vacíos en un guion ("-").
 *******************************************************************************************************/
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'empty',
  standalone: true
})
export class EmptyPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value == "string" && (value.trim().length == 0 || value.includes("01/01/0001"))) return "-";
        return value ?? "-";
  }
}
