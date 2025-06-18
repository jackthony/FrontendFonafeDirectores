import { DialogConfirmation } from "@components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";

// Definición de constantes que representan diferentes tipos de documentos, cargos y género
export const CONST_TYPE_DOCUMENT = 1; // Identificador del tipo de documento
export const CONST_TYPE_DIRECTOR = 3; // Identificador del tipo de director
export const CONST_TYPE_SPECIALTY_DIRECTOR = 6; // Identificador del tipo de director especializado
export const CONST_GENDER = 4; // Identificador del género
export const CONST_CARGO_MANAGER = 5; // Identificador del cargo de gerente

// Define la configuración de las columnas para la tabla de gestión de directores de empresas
export const COLUMNS_DIRECTORY_BUSINESS: TableColumnsDefInterface[] = [
    {
        id: 0, // Identificador único de la columna
        name: "sNombreCompleto", // Nombre interno para la columna de nombre completo del director
        displayedName: "Nombres y apellidos", // Nombre que se mostrará en el encabezado de la columna
        type: "string" // Tipo de dato de la columna (cadena de texto)
    },
    {
        id: 1,
        name: "sTipoDocumentoDescripcion",
        displayedName: "Tipo de doc.",
        type: "string"
    },
    {
        id: 2,
        name: "sNumeroDocumento",
        displayedName: "Documento",
        type: "string"
    },
    {
        id: 3,
        name: "sCargoDescripcion",
        displayedName: "Cargo",
        type: "string"
    },
    {
        id: 4,
        name: "sTipoDirectorDescripcion",
        displayedName: "Tipo de director",
        type: "string"
    },
    {
        id: 6,
        name: "none",
        displayedName: "",
        type: "acciones"
    }
];

// Configuración para el diálogo de confirmación al eliminar un director de empresa
export const CONFIG_DELETE_DIALOG_DIRECTORY_BUSINESS: DialogConfirmation = {
    title: "¿Estás seguro de eliminar al director?", // Título del diálogo de confirmación
    message: "" // Mensaje vacío (puede ser personalizado según sea necesario)
};
