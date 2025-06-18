import { DialogConfirmation } from "@components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";

// Define constantes para el tipo de datos de los usuarios en diferentes contextos
export const CONST_STATUS_USER = 10; // Identificador para el estado del usuario
export const CONST_POSITION_USER = 11; // Identificador para la posición del usuario
export const CONST_PROFILE_USER = 12; // Identificador para el perfil del usuario

// Define la configuración de las columnas de la tabla para la gestión de perfiles de usuario
export const COLUMNS_PROFILE_MANAGEMENT: TableColumnsDefInterface[] = [
    {
        id: 0, // Identificador único de la columna
        name: "sNombreCompleto", // Nombre interno de la columna
        displayedName: "Apellidos y nombre", // Nombre que se mostrará en el encabezado de la columna
        type: "string" // Tipo de dato de la columna (cadena de texto)
    },
    {
        id: 1,
        name: "sCargoDescripcion",
        displayedName: "Cargo",
        type: "string"
    },
    {
        id: 2,
        name: "sPerfilDescripcion",
        displayedName: "Perfil",
        type: "string"
    },
    {
        id: 3,
        name: "sEstadoDescripcion",
        displayedName: "Estado",
        type: "string"
    },
    {
        id: 4,
        name: "dtFechaRegistro",
        displayedName: "Fecha de creación",
        type: "date"
    },
    {
        id: 5,
        name: "dtFechaModificacion",
        displayedName: "Ult. modificación",
        type: "date"
    },
    {
        id: 6,
        name: "sCorreoElectronico",
        displayedName: "Correo",
        type: "string"
    },
    {
        id: 7,
        name: "hide",
        displayedName: "Clave",
        type: "password"
    },
    {
        id: 8,
        name: "none",
        displayedName: "",
        type: "acciones"
    }
];

// Configuración para el diálogo de confirmación al eliminar un perfil de usuario
export const CONFIG_DELETE_DIALOG_PROFILE: DialogConfirmation = {
    title: "¿Estás seguro de eliminar al usuario?", // Título del diálogo de confirmación
    message: "Recuerda que una vez se haya eliminado al usuario no podrá ingresar al portal, ni realizar ninguna acción en el." // Mensaje que se muestra en el diálogo, informando sobre la irreversibilidad de la acción
};