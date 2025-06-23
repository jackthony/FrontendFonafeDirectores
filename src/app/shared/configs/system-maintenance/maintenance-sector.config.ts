import { DialogConfirmation } from "app/modules/admin/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";

// Define la configuración de las columnas de la tabla para la gestión de ministerios
export const MAINTENANCE_SECTOR_HEADER_TABLE: TableColumnsDefInterface[] = [
    {
        id: 0, // Identificador único para la columna
        name: "indice", // Nombre interno de la columna
        displayedName: "Nro", // Nombre que se mostrará en el encabezado de la columna
        type: "string" // Tipo de datos de la columna (en este caso, cadena de texto)
    },
    {
        id: 1,
        name: "sNombreSector",
        displayedName: "Nombre",
        type: "string"
    },
    {
        id: 2,
        name: "bActivo",
        displayedName: "Estado",
        type: "estado"
    },
    {
        id: 3,
        name: "none",
        displayedName: "",
        type: "acciones"
    }
];

// Configuración para el diálogo de confirmación al eliminar un ministerio
export const CONFIG_DELETE_DIALOG_SECTOR: DialogConfirmation = {
    title: "¿Estás seguro de eliminar el sector?", // Título del diálogo de confirmación
    message: "Esta acción es irreversible y los datos no podrán ser recuperados." // Mensaje que se muestra al usuario, alertando de la irreversibilidad de la acción
};
