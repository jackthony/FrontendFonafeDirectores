import { TableColumnsDefInterface } from "../interfaces/ITableColumnsDefInterface";

export const COLUMNS_ACTIVITIES: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "fullName",
        displayedName: "Nombre y Apellido",
        type: "string"
    },
    {
        id: 1,
        name: "status",
        displayedName: "Estado",
        type: "string"
    },
    {
        id: 2,
        name: "dDate",
        displayedName: "Fecha",
        type: "date"
    },
    {
        id: 3,
        name: "transcurrido",
        displayedName: "Transcurrido",
        type: "string"
    },
    {
        id: 4,
        name: "enterprise",
        displayedName: "Empresa",
        type: "string"
    },
    {
        id: 5,
        name: "proponent",
        displayedName: "Proponente",
        type: "string"
    },
    {
        id: 5,
        name: "solicit",
        displayedName: "Solicitante",
        type: "string"
    },
    {
        id: 5,
        name: "none",
        displayedName: "NUEVO BOTON",
        type: "string"
    }
];
