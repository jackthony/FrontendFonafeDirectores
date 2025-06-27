/*******************************************************************************************************
 * Nombre del archivo:  business-management-table.config.ts
 * Descripción:         Configuración de columnas y diálogo de confirmación para la gestión de empresas.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Corrección de redacción en el mensaje de diálogo y alineación estructural del archivo.
 *******************************************************************************************************/
import { DialogConfirmation } from "app/modules/admin/shared/components/fo-dialog-confirmation/models/dialog-confirmation.interface";
import { TableColumnsDefInterface } from "../../interfaces/ITableColumnsDefInterface";
/**
 * Constante para identificación de sección de empresas (catálogo o filtro relacionado).
 */
export const CONST_COMPANY_SECTION = 1024;
/**
 * Columnas para la tabla de gestión de empresas.
 */
export const COLUMNS_BUSINESS_MANAGEMENT: TableColumnsDefInterface[] = [
    {
        id: 0,
        name: "indice",
        displayedName: "Nro",
        type: "string"
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
        displayedName: "Sector",
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
]
/**
 * Diálogo de confirmación para la eliminación de una empresa.
 */
export const CONFIG_DELETE_DIALOG_BUSINESS: DialogConfirmation = {
    title: "¿Estás seguro de eliminar a la empresa?",
    message: "Recuerda que una vez se haya eliminado al a la empresa no podrás visualizar su información, ni de la sus directores."
};