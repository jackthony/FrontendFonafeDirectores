import { DialogConfirmation } from "app/modules/admin/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";

// Define una constante para la sección de la empresa
export const CONST_COMPANY_SECTION = 1024; // Identificador único para la sección de la empresa

// Define la configuración de las columnas para la tabla de gestión de empresas
export const COLUMNS_BUSINESS_MANAGEMENT: TableColumnsDefInterface[] = [
    {
        id: 0, // Identificador único de la columna
        name: "indice", // Nombre interno de la columna (representa el índice de la fila)
        displayedName: "Nro", // Nombre que se mostrará en el encabezado de la columna
        type: "string" // Tipo de dato de la columna (cadena de texto)
    },
    {
        id: 1,
        name: "sRazonSocial",
        displayedName: "Razón social",
        type: "string"
    },
    {
        id: 2,
        name: "sRuc",
        displayedName: "RUC",
        type: "string"
    },
    {
        id: 3,
        name: "sNombreMinisterio",
        displayedName: "Proponente",
        type: "string"
    },
    {
        id: 4,
        name: "sDescripcionRubro",
        displayedName: "Rubro",
        type: "string"
    },
    {
        id: 5,
        name: "sProvinciaDescripcion",
        displayedName: "Ubicación",
        type: "string"
    },
    {
        id: 6,
        name: "bActivo",
        displayedName: "Estado",
        type: "estado"
    },
    {
        id: 7,
        name: "none",
        displayedName: "",
        type: "acciones"
    }
];

// Configuración para el diálogo de confirmación al eliminar una empresa
export const CONFIG_DELETE_DIALOG_BUSINESS: DialogConfirmation = {
    title: "¿Estás seguro de eliminar a la empresa?", // Título del diálogo de confirmación
    message: "Recuerda que una vez se haya eliminado al a la empresa no podrás visualizar su información, ni de la sus directores." // Mensaje que se muestra en el diálogo, informando sobre la irreversibilidad de la eliminación
};