import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal, ViewEncapsulation } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FoButtonDialogComponent } from '@components/fo-button-dialog/fo-button-dialog.component';
import { ResponseModel } from '@models/IResponseModel';
import { SegUser } from '@models/seg-users/seg-user.interface';
import { User } from '@models/user.interface';
import { SegUserService } from '@services/seg-user.service';
import { ButtonEnum } from 'app/core/enums/button.enum';
import { TranslateMessageForm } from 'app/core/pipes/error-message-form.pipe';
import { UserService } from 'app/core/user/user.service';
import { RequestOption } from 'app/shared/interfaces/IRequestOption';
import { FormInputModule } from 'app/shared/modules/form-input.module';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-change-password-adm',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormInputModule,
        FoButtonDialogComponent,
        TranslateMessageForm,
        ReactiveFormsModule,
        MatDialogModule,
        MatTooltipModule,
        MatButtonModule,
    ],
    templateUrl: './change-password-adm.component.html',
    styleUrl: './change-password-adm.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class ChangePasswordAdmComponent implements OnInit, OnDestroy {
    private _fb = inject(FormBuilder);

    public data: { object: SegUser } = inject(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(
        MatDialogRef<ChangePasswordAdmComponent>
    );
    private _userService = inject(UserService);
    private _segUserService = inject(SegUserService);

    private _unsubscribeAll: Subject<void> = new Subject<void>();

    loadingService = signal<boolean>(false);
    buttonEnum = signal<typeof ButtonEnum>(ButtonEnum);
	typeInputPassword = signal<boolean>(false);

    user: User;
    form: FormGroup;

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });

        this.form = this._fb.group({
            user: [this.data.object.nIdUsuario, Validators.required],
            password: ['', [Validators.required, Validators.maxLength(32)]],
            sUsuarioModificacion: [this.user.nombreVisual, Validators.required],
        });
    }

    changePassword(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.loadingService.set(true);
        const request = new RequestOption();
        request.resource = 'ChangePassAdmin';
        request.request = this.form.value;
        this._segUserService
            .create(request)
            .pipe(finalize(() => this.loadingService.set(false)))
            .subscribe({
                next: (response: ResponseModel<boolean>) => {
                    if (response.isSuccess) this.dialogRef.close(true);
                },
            });
    }

	viewPassword(): void {
		this.typeInputPassword.set(!this.typeInputPassword());
	}

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
