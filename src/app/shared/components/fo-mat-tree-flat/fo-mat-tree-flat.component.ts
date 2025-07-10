/*******************************************************************************************************
 * Nombre del archivo:  fo-mat-tree-flat.component.ts
 * Descripción:          Componente que implementa un árbol jerárquico plano utilizando Angular Material Tree,
 *                       permitiendo mostrar, seleccionar, y gestionar archivos, con opciones para cargar 
 *                       y descargar archivos. El árbol también maneja el estado expandido de los nodos.
 * Autor:                Daniel Alva
 * Fecha de creación:    01/07/2025
 * Última modificación:  09/07/2025 por Daniel Alva
 * Cambios recientes:    - Implementación del árbol jerárquico plano con funcionalidades de selección,
 *                         carga y descarga de archivos.
 *******************************************************************************************************/
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule} from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ArchiveService } from '../../../modules/business/domain/services/business/archive.service';
import { FileData } from '../../../core/models/archive-tree.entity';
import { ArchivingProcessService } from '../../../modules/business/domain/services/business/archiving-process.service';
import { MatTreeOptionsNode } from './models/mat-tree-options-node';
import { FlatNodeAllElements } from './models/flat-node-all-elements';
@Component({
  selector: 'fo-mat-tree-flat',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatMenuModule,
	MatSlideToggleModule,
    MatProgressSpinnerModule
],
  templateUrl: './fo-mat-tree-flat.component.html',
  styleUrl: './fo-mat-tree-flat.component.scss',
})
export class FoMatTreeFlatComponent<T> {
    private _archiveService = inject(ArchiveService);
    private _archivingProcessService = inject(ArchivingProcessService);
    @Input() data: MatTreeOptionsNode<T>[] = [];
    @Input() viewStatus: boolean = false;
    @Input() infoProperty: string;
	@Input() loading: boolean;
    @Input() btnClose: boolean = false;
    @Output() eventSelectionObject:EventEmitter<T> = new EventEmitter<T>();
    @Output() eventUploadFile:EventEmitter<FlatNodeAllElements<FileData>> = new EventEmitter<FlatNodeAllElements<FileData>>();
    flatNodeMap = new Map<FlatNodeAllElements<T>, MatTreeOptionsNode<T>>();
    nestedNodeMap = new Map<MatTreeOptionsNode<T>, FlatNodeAllElements<T>>();
    selectedParent: FlatNodeAllElements<T> | null = null;
    treeControl: FlatTreeControl<FlatNodeAllElements<T>>;
    treeFlattener: MatTreeFlattener<MatTreeOptionsNode<T>, FlatNodeAllElements<T>>;
    dataSource: MatTreeFlatDataSource<MatTreeOptionsNode<T>, FlatNodeAllElements<T>>;
    constructor() {
        this.treeFlattener = new MatTreeFlattener(
            this.transformer,
            this.getLevel,
            this.isExpandable,
            this.getChildren
        );
        this.treeControl = new FlatTreeControl<FlatNodeAllElements<T>>(
            this.getLevel,
            this.isExpandable
        );
        this.dataSource = new MatTreeFlatDataSource(
            this.treeControl,
            this.treeFlattener
        );
    }
    ngOnChanges(changes: SimpleChanges): void{
        if(changes.data){
            const expandNodes = this.getExpandedNodes();
            this.dataSource.data = this.data;
            this.restoreExpandedNodes(expandNodes);
        }
    }
    getLevel = (node: FlatNodeAllElements<T>) => node.level;
    isExpandable = (node: FlatNodeAllElements<T>) => node.expandable;
    getChildren = (node: MatTreeOptionsNode<T>): MatTreeOptionsNode<T>[] => node.children;
    hasChild = (_: number, _nodeData: FlatNodeAllElements<T>) => _nodeData.expandable;
    /**
     * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
     */
    transformer = (node: MatTreeOptionsNode<T>, level: number) => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode =
            existingNode && existingNode.item === node.name
                ? existingNode
                : new FlatNodeAllElements<T>();
        flatNode.id = node.id;
        flatNode.item = node.name;
		flatNode.status = node.status;
        flatNode.element = node.element;
        flatNode.level = level;
        flatNode.expandable = true;
        flatNode.hasChild = !!node.children?.length; 
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    };
    private getExpandedNodes(): string[] {
        if(this.treeControl.dataNodes){
            return this.treeControl.dataNodes
          .filter(node => this.treeControl.isExpanded(node))
          .map(node => node.item);
        } return [];
    }
    private restoreExpandedNodes(expandedNodeNames: string[]): void {
        this.treeControl.dataNodes.forEach(node => {
          if (expandedNodeNames.includes(node.item)) {
            this.treeControl.expand(node);
          }
        });
    }
	convertToNumber(value: number | boolean): number {
		if (typeof value === "boolean") return +value;
		else return value;
	}
    selectObject(element: T):void{
        this.eventSelectionObject.emit(element);
    }
    uploadFile(node: FlatNodeAllElements<FileData>): void {
        this.eventUploadFile.emit(node);
    }
    downloadFile(node: FlatNodeAllElements<FileData>): void {
        const file$ = this._archiveService.downloadFileBussiness(node.element.sUrlStorage);
        this._archivingProcessService.downloadFile(file$, node.element.sNombre, node.element.sTipoMime);
    }
}