/*******************************************************************************************************
 * Nombre del archivo:  profile-management.config.ts
 * Descripción:         Configuración de constantes, columnas y diálogos de confirmación para la gestión de perfiles de usuario.
 * Autor:               Daniel Alva
 * Fecha de creación:   23/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Creación inicial del archivo.
 *******************************************************************************************************/
import { DialogConfirmation } from "app/modules/admin/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";
export const CONST_STATUS_USER = 10;
export const CONST_POSITION_USER = 11;
export const CONST_PROFILE_USER = 12;
export const COLUMNS_PROFILE_MANAGEMENT: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "sApellidosYNombres",
        displayedName: "Apellidos y nombre",
        type: "string"
    },
    {
        id: 1,
        name: "sCargo",
        displayedName: "Cargo",
        type: "string"
    },
    {
        id: 2,
        name: "sPerfil",
        displayedName: "Perfil",
        type: "string"
    },
    {
        id: 3,
        name: "qw",
        displayedName: "Estado",
        type: "string"
    },
    {
        id: 4,
        name: "dtFechaCreacion",
        displayedName: "Fecha de creación",
        type: "date"
    },
    {
        id: 5,
        name: "dtUltimaModificacion",
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
export const CONFIG_DELETE_DIALOG_PROFILE: DialogConfirmation = {
    title: "¿Estás seguro de eliminar al usuario?",
    message: "Recuerda que una vez se haya eliminado al usuario no podrá ingresar al portal, ni realizar ninguna acción en el."
};