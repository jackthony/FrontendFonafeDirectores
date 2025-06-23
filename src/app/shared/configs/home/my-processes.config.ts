import { OptionsProcess } from "app/core/enums/options-process.enum";
import { ListOfProcesses } from "app/shared/interfaces/IListOfProcesses";

// Define la lista de procesos disponibles en la aplicación
export const LIST_OF_PROCESSES: ListOfProcesses[] = [
    {
        label: 'Ingresar nueva solicitud', // Etiqueta que describe el proceso
        icon: 'mat_outline:add_circle_outline', // Icono asociado al proceso (utiliza Material Icons)
        value: OptionsProcess.newRequest, // Valor que representa el proceso (se refiere a la enumeración OptionsProcess)
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
            { label: 'Mantenimiento de roles', url: 'mantenedores-sistema/rol' }, // Opción para acceder al mantenimiento de roles
            { label: 'Mantenimiento de ministerios', url: 'mantenedores-sistema/ministerio' }, // Opción para acceder al mantenimiento de ministerios
            { label: 'Mantenimiento de sectores', url: 'mantenedores-sistema/sector' }, // Opción para acceder al mantenimiento de sectores
            { label: 'Mantenimiento de rubros', url: 'mantenedores-sistema/rubro' }, // Opción para acceder al mantenimiento de rubros
            { label: 'Mantenimiento de cargos', url: 'mantenedores-sistema/cargo' }, // Opción para acceder al mantenimiento de cargo
            { label: 'Mantenimiento de tipo de director', url: 'mantenedores-sistema/tipo-director' }, // Opción para acceder al mantenimiento de cargo
            { label: 'Mantenimiento de especialidad', url: 'mantenedores-sistema/especialidad' }, // Opción para acceder al mantenimiento de cargo
        ]
    }
]
