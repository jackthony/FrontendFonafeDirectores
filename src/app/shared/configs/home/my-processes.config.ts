/*******************************************************************************************************
 * Nombre del archivo:  list-of-processes.const.ts
 * Descripción:         Constante que define la lista de procesos disponibles en la aplicación.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 23/06/2025 por Daniel Alva
 * Cambios recientes:   Creación inicial del archivo.
 *******************************************************************************************************/
import { OptionsProcess } from "app/core/enums/options-process.enum";
import { ListOfProcesses } from "app/shared/interfaces/IListOfProcesses";
/**
 * Lista centralizada de procesos del sistema.
 */
export const LIST_OF_PROCESSES: ListOfProcesses[] = [
    {
        label: 'Ingresar nueva solicitud',
        icon: 'mat_outline:add_circle_outline',
        value: OptionsProcess.newRequest,
        url: 'solicitudes',
        module: "solicitudes",
        options: []
    },
    {
        label: 'Mantenimiento de candidatos',
        icon: 'mat_outline:event_available',
        value: OptionsProcess.candidateMaintenance,
        url: 'mantenimiento-candidatos',
        module: "Mantenimiento Candidatos",
        options: []
    },
    {
        label: 'Gestión de perfiles',
        icon: 'mat_outline:perm_identity',
        value: OptionsProcess.profileManagement,
        url: 'gestion-perfiles',
        module: "gestion-perfiles",
        options: []
    },
    {
        label: 'Gestión de empresas',
        icon: 'mat_outline:work_outline',
        value: OptionsProcess.businessManagement,
        url: 'gestion-empresas',
        module: 'gestion-empresas',
        options: []
    },
    {
        label: 'Historial de atenciones',
        icon: 'mat_outline:format_list_numbered_rtl',
        value: OptionsProcess.careHistory,
        url: '', 
        module: 'historial-atenciones',
        options: []
    },
    {
        label: 'Mantenedores del sistema',
        icon: 'mat_outline:settings',
        value: OptionsProcess.systemMaintenance,
        url: '', 
        module: 'mantenimiento-sistemas',
        options: [
            { label: 'Mantenimiento de roles', url: 'mantenedores-sistema/rol' },
            { label: 'Mantenimiento de ministerios', url: 'mantenedores-sistema/ministerio' },
            { label: 'Mantenimiento de sectores', url: 'mantenedores-sistema/sector' },
            { label: 'Mantenimiento de rubros', url: 'mantenedores-sistema/rubro' },
            { label: 'Mantenimiento de cargos', url: 'mantenedores-sistema/cargo' },
            { label: 'Mantenimiento de tipo de director', url: 'mantenedores-sistema/tipo-director' },
            { label: 'Mantenimiento de especialidad', url: 'mantenedores-sistema/especialidad' },
        ]
    }
]