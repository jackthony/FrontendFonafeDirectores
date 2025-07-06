import { Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConstantEntity } from 'app/modules/business/domain/entities/business/constant.entity';
import { PositionEntity } from 'app/modules/user/domain/entities/maintenance/position.entity';
import { RoleEntity } from 'app/modules/user/domain/entities/maintenance/role.entity';
import { SegUserEntity } from 'app/modules/user/domain/entities/profile/seg-user.entity';

@Component({
  selector: 'app-audit-logs',
  standalone: false,
  templateUrl: './audit-logs.component.html',
  styleUrl: './audit-logs.component.scss'
})
export class AuditLogsComponent implements OnInit {
  private readonly _router = inject(Router);
  iconBtnSearch = input<string>('mat_outline:add_circle_outline');
  textBtnSearch = input<string>('Descargar');
  @Output() eventNewElement: EventEmitter<void> = new EventEmitter<void>();
  form: FormGroup;
  lstStatus = signal<ConstantEntity[]>([]);


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  returnInit(): void {
    this._router.navigate(['home']);
  }

    addUser(): void {
    this.eventNewElement.emit();
  }
}