/*******************************************************************************************************
 * Nombre del archivo:  icon-option.model.ts
 * Descripción:          Definición de interfaces y clases para representar íconos interactivos
 *                       utilizados en tablas, botones o menús contextuales del sistema.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/06/2025
 * Última modificación:  23/06/2025 por Daniel Alva
 * Cambios recientes:    - Documentación y estandarización de atributos
 *                       - Ajustes en valores por defecto y funciones fallback
 *******************************************************************************************************/
/**
 * Representa un ícono genérico que ejecuta una acción sobre un dato de tipo `T`.
 */
export interface GenericIcon<T> {
    id: string;
    name: string;
    type: string;
    tooltip?: string;
    transitionIcon?: GenericIcon<T>;
    executeAction(dato: T): void;
}
export class IconOption<T> implements GenericIcon<T> {
    id: string;
    name: string;
    type: string;
    tooltip?: string;
    transitionIcon?: IconOption<T>;
    isDisabled: (data?: T) => boolean;
    color?: string;
    actionIcono: (data?: T) => void;
    isHidden: (data?: T) => boolean;
    constructor(name: string, type: string, tooltip?: string, transitionIcon?: IconOption<T>, id?: string, color?: string, isHidden?: (data?: T) => boolean, isDisabled?: (data?: T) => boolean) {
        this.name = name;
        this.type = type;
        this.tooltip = tooltip ?? null;
        this.transitionIcon = transitionIcon ?? null;
        this.id = id ?? null;
        this.color = color ? color : "black";
        this.isDisabled = isDisabled ?? (() => false);
        this.isHidden = isHidden ?? (() => false);
    }
    executeAction(elemento: T): void {
        this.actionIcono(elemento);
    }
}