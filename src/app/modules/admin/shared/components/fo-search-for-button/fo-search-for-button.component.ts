import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, EventEmitter, input, OnInit, Output, signal, ViewEncapsulation } from '@angular/core';
import { FoButtonComponent } from 'app/modules/admin/shared/components/fo-button/fo-button.component';
import { FoSearchComponent } from 'app/modules/admin/shared/components/fo-search/fo-search.component';
import { PermissionButtonDirective } from 'app/shared/directives/permission-button.directive';
import { FoContCardComponent } from '../fo-cont-card/fo-cont-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'fo-search-for-button',
    standalone: true,
    imports: [
        CommonModule,
        FoContCardComponent,
        FoSearchComponent,
        FoButtonComponent,
        PermissionButtonDirective,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatCheckboxModule,
        FormsModule,
        MatTooltipModule,
        FoButtonComponent
    ],
    templateUrl: './fo-search-for-button.component.html',
    styleUrl: './fo-search-for-button.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class FoSearchForButtonComponent implements OnInit {
    placeTextSearch = input<string>('Busca por nombre de usuario');
    iconBtnSearch = input<string>('mat_outline:add_circle_outline');
    textBtnSearch = input<string>('Agregar usuario');
    disableDirective = input(false, { transform: booleanAttribute });
    delaySearch = input<number>(0);
    isActive: boolean = true;
    isInactive: boolean = false;
    filterValue = signal<boolean | null>(null);
    viewFilterState = input(false, { transform: booleanAttribute });

    @Output() eventNewElement: EventEmitter<void> = new EventEmitter<void>();
    @Output() eventSearch: EventEmitter<string> = new EventEmitter<string>();
    @Output() eventFilterState: EventEmitter<boolean | null> = new EventEmitter<boolean | null>();
    @Output() eventBtnSearch: EventEmitter<void> = new EventEmitter<void>();

    ngOnInit(): void {
        this.onCheckboxChange();
    }

    addUser(): void {
        this.eventNewElement.emit();
    }

    getDataSearch(event: string): void {
        this.eventSearch.emit(event);
    }

    onCheckboxChange() {
        if (this.isActive && this.isInactive) {
          this.filterValue.set(null);
        } else if (this.isActive) {
          this.filterValue.set(true);
        } else if (this.isInactive) {
          this.filterValue.set(false);
        } else {
          this.filterValue.set(null);
        }
        
        this.eventFilterState.emit(this.filterValue());
    }

    onSearch(): void {
        this.eventBtnSearch.emit();
    }
}
