export interface DialogConfirmation {
    title: string;
    message: string;
    actions?: {
        confirm?: {
            show?: boolean;
            label?: string;
        },
        cancel?: {
            show?: boolean;
            label?: string;
        },
        iconClose: boolean;
    },
    disableClose?: boolean;
}
