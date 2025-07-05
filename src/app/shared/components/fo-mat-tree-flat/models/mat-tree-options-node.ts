export class MatTreeOptionsNode<T> {
    id: number;
    name: string;
    status: number;
    element: T;
    children: MatTreeOptionsNode<T>[];
    hasChildren: boolean;
}