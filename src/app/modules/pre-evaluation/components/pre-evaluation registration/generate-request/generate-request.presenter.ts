import { Injectable, inject } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CandidateEntity } from "app/modules/pre-evaluation/domain/entities/candidate.entity";
import { CreateRequestEntity } from "app/modules/pre-evaluation/domain/entities/create-request.entity";
import { UserService } from "app/modules/user/domain/services/auth/user.service";
import { ValidationFormService } from "app/shared/services/validation-form.service";

@Injectable()
export class GenerateRequestPresenter {

    private readonly _fb = inject(FormBuilder);
    private _userService = inject(UserService); // Inyecta el servicio UserService para acceder a la información del usuario
    private _validationFormService = inject(ValidationFormService);

    initFormCandidate(element: CandidateEntity): FormGroup {
        return this._fb.group({
            nUsuarioId: [element.nUsuarioId, Validators.required],
            sNombres: [{ disabled: true, value: element.sNombres } , [Validators.required, this._validationFormService.spaceValidator, Validators.maxLength(150)]],
            sApellidos: [{ disabled: true, value: element.sApellidos }, [Validators.required, this._validationFormService.spaceValidator, Validators.maxLength(150)]],
            nTipoDocumento: [element?.nTipoDocumento ?? 0 , [Validators.required, Validators.min(1)]],
            sNumeroDocumento: [element.sNumeroDocumento ?? '' , Validators.required],
            dtFechaNacimiento: [element.dtFechaNacimiento ?? null, [Validators.required, Validators.maxLength(10)]],
            nGenero: [element.nGenero ?? 0, [Validators.required, Validators.min(1)]],
            sCorreoElectronico: [element.sCorreoElectronico ?? '', [Validators.required, Validators.maxLength(250), this._validationFormService.validationMail]],
            sTelefono: [element.sTelefono ?? '', [Validators.required, this._validationFormService.validationPhone]],
            sDepartamentoId: [element.sDepartamentoId ?? 0, [Validators.required, Validators.min(1)]],
            sProvinciaId: [element.sProvinciaId ?? 0, [Validators.required, Validators.min(1)]],
            sDistritoId: [element.sDistritoId ?? 0, [Validators.required, Validators.min(1)]],
            sDireccion: [element.sDireccion ?? '', [Validators.required, this._validationFormService.spaceValidator, Validators.maxLength(255)]],
            nEstado: [element.nEstado ?? 1, Validators.required],
            bActivo: [element.bActivo ?? true, Validators.required],
            nUsuarioRegistroId: [this._userService.userLogin().usuarioId, Validators.required],
            bCopiarSolicitud: [false, Validators.required],
        });
    }
    
}