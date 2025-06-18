import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";

// Define la configuración de las columnas para la tabla de actividades
export const COLUMNS_ACTIVITIES: TableColumnsDefInterface[] = [
    {
        id: 0, // Identificador único de la columna
        name: "fullName", // Nombre interno de la columna, representando el nombre completo del usuario
        displayedName: "Nombre y Apellido", // Nombre que se mostrará en el encabezado de la columna
        type: "string" // Tipo de dato de la columna (cadena de texto)
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
        id: 6,
        name: "solicit",
        displayedName: "Solicitante",
        type: "string"
    },
    {
        id: 7,
        name: "none",
        displayedName: "",
        type: "enter"
    }
];
