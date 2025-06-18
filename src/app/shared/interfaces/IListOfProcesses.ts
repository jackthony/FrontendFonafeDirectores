export interface ListOfProcesses {
    label: string;
    icon: string;
    value: number;
    url: string;
    module: string;
    options: ListOptionsProcesses[]
}

export interface ListOptionsProcesses {
    label: string;
    url: string;
}