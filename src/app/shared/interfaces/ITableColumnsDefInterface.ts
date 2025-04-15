export interface TableColumnsDefInterface {
    id: number;
    name?: string | "none";
    subName?: string;
    displayedName: string;
    estado?: string;
    nombreColumna?: string;
    translate?: string;
    type?:
        | "string"
        | "decimal"
        | "number"
        | "date"
        | "dateInput"
        | "datetime"
        | "boolean"
        | "time"
        | "acciones"
        | "estado"
        | "moneda"
        | "input"
        | "input-number"
        | "select"
        | "accionesListaDetalle"
        | "url"
        | "statusIndicator"
        | "photo"
        | "detail"
        | "enter";
    format?: "fullDate" | "shortTime" | "shortTimeHour";
    customIcon?: string[][];
    minMaxDecimal?: [number, number];
    checked?: string;
    backgroundColorTitle?: string;
    components?: string[];
    alignTitle?: "left" | "center" | "right" | "fill" | "justify" | "centerContinuous" | "distributed";
    alignContent?: "left" | "center" | "right" | "fill" | "justify" | "centerContinuous" | "distributed";
}
