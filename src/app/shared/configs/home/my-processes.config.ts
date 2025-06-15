import { OptionsProcess } from "app/core/enums/options-process.enum";
import { ListOfProcesses } from "app/shared/interfaces/IListOfProcesses";

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
            { label: 'Mantenimiento de ministerio', url: 'mantenedores-sistema/ministerio' },
            { label: 'Manteniendo de sectores', url: 'mantenedores-sistema/sector' }
        ]
    }
]