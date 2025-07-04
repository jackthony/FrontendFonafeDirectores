export class FlatNodeAllElements<T> {
    id: number;
    item: string;
    status: number;
    element: T;
    level: number;
    expandable: boolean;
    hasChild: boolean;
}