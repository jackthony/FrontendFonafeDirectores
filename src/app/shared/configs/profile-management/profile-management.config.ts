import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";

export const COLUMNS_PROFILE_MANAGEMENT: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "fullName",
        displayedName: "Nombres y Apellidos",
        type: "string"
    },
    {
        id: 1,
        name: "status",
        displayedName: "Cargo",
        type: "string"
    },
    {
        id: 2,
        name: "dDate",
        displayedName: "Perfil",
        type: "date"
    },
    {
        id: 3,
        name: "transcurrido",
        displayedName: "Estado",
        type: "string"
    },
    {
        id: 4,
        name: "enterprise",
        displayedName: "Fecha de creación",
        type: "string"
    },
    {
        id: 5,
        name: "proponent",
        displayedName: "Ult. modificación",
        type: "string"
    },
    {
        id: 6,
        name: "solicit",
        displayedName: "Correo",
        type: "string"
    },
    {
        id: 7,
        name: "clave",
        displayedName: "Clave",
        type: "string"
    },
    {
        id: 7,
        name: "none",
        displayedName: "",
        type: "acciones"
    }
];