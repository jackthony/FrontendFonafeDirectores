import { OptionsProcess } from "app/core/enums/options-process.enum";
import { ListOfProcesses } from "app/shared/interfaces/IListOfProcesses";

export const LIST_OF_PROCESSES: ListOfProcesses[] = [
    {
        label: 'Ingresar nueva solicitud',
        icon: 'mat_outline:add_circle_outline',
        value: OptionsProcess.newRequest,
        url: 'solicitudes',
        module: "solicitudes"
    },
    {
        label: 'Mantenimiento de candidatos',
        icon: 'mat_outline:event_available',
        value: OptionsProcess.candidateMaintenance,
        url: 'mantenimiento-candidatos',
        module: "Mantenimiento Candidatos"
    },
    {
        label: 'Gestión de perfiles',
        icon: 'mat_outline:perm_identity',
        value: OptionsProcess.profileManagement,
        url: 'gestion-perfiles',
        module: "gestion-perfiles"

    },
    {
        label: 'Gestión de empresas',
        icon: 'mat_outline:work_outline',
        value: OptionsProcess.businessManagement,
        url: 'gestion-empresas',
        module: 'gestion-empresas'
    },
    {
        label: 'Historial de atenciones',
        icon: 'mat_outline:settings',
        value: OptionsProcess.careHistory,
        url: '',
        module: 'historial-atenciones'
    }
]