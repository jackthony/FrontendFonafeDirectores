import { Injectable, inject } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CreateRequestEntity } from "app/modules/pre-evaluation/domain/entities/create-request.entity";
import { UserService } from "app/modules/user/domain/services/auth/user.service";
import { ValidationFormService } from "app/shared/services/validation-form.service";

@Injectable()
export class HomePreEvaluationPresenter {

    private readonly _fb = inject(FormBuilder);
    private _userService = inject(UserService); // Inyecta el servicio UserService para acceder a la información del usuario
    private _validationFormService = inject(ValidationFormService);


    initFormFields(): FormGroup {
        return this._fb.group({
            fields: this._fb.array([], Validators.required)
        });
    }
// Class createRequest
    initFormCandidate(element: CreateRequestEntity): FormGroup {
        const candidate = element?.crearCandidatoRequest;
        return this._fb.group({
            crearCandidatoRequest: this._fb.group({
                nCandidatoId: [element ? candidate.nCandidatoId : { disabled: true, value: 0  }, Validators.required],
                nUsuarioId: [element ? candidate.nUsuarioId : 0/*GERARID*/, Validators.required],
                sNombres: [element ? { disabled: true, value: candidate.sNombres} : '', [Validators.required, this._validationFormService.spaceValidator, Validators.maxLength(150)]],
                sApellidos: [element ? { disabled: true, value: candidate.sApellidos} : '', [Validators.required, this._validationFormService.spaceValidator, Validators.maxLength(150)]],
                nTipoDocumento: [element ? { disabled: true, value: candidate.nTipoDocumento} : 0, [Validators.required, Validators.min(1)]],
                sNumeroDocumento: [element ? { disabled: true, value: candidate.sNumeroDocumento} : '', Validators.required],
                dtFechaNacimiento: [element ?  { disabled: true, value: candidate.dtFechaNacimiento} : null, [Validators.required, Validators.maxLength(10)]],
                nGenero: [element ? { disabled: true, value: candidate.nGenero } : 0, [Validators.required, Validators.min(1)]],
                sCorreoElectronico: [element ? candidate.sCorreoElectronico: '', [Validators.required, Validators.maxLength(250), this._validationFormService.validationMail]],
                sTelefono: [element ? candidate.sTelefono: '', [Validators.required, this._validationFormService.validationPhone]],
                sDepartamentoId: [element ? candidate.sDepartamentoId: 0, [Validators.required, Validators.min(1)]],
                sProvinciaId: [element ? candidate.sProvinciaId: 0, [Validators.required, Validators.min(1)]],
                sDistritoId: [element ? candidate.sDistritoId: 0, [Validators.required, Validators.min(1)]],
                sDireccion: [element ? candidate.sDireccion: '', [Validators.required, this._validationFormService.spaceValidator, Validators.maxLength(255)]],
                nEstado: [element ? candidate.nEstado: 1, Validators.required],
                bActivo: [element ? candidate.bActivo: true, Validators.required],
                nUsuarioRegistroId: [{ disabled: element, value: 1/* this._userService.userLogin().usuarioId */ }, Validators.required],
                nUsuarioActualizacionId: [{ disabled: !element, value: 2/* this._userService.userLogin().usuarioId */ },Validators.required],
            })
        });
    }
    
    /* initFormAttributes(formArray: FormArray, attributes: SchemaAttribute[], project: Project): void {
        const disallowedStates = [statusObjects.approved, statusObjects.inProcess];
        attributes.forEach((attr) => {
            const formGroup = this._fb.group({
                id: [attr.id],
                schemaId: [attr.schemaId],
                wfObjectId: [attr.wfObjectId],
                cPerJurCodigo: [attr.cPerJurCodigo],
                sequence: [attr.sequence],
                tittle: [attr.tittle],
                placeHolder: [attr.placeHolder],
                placeHolderOpc: [attr.placeHolderOpc],
                type: [attr.type],
                isRequired: [attr.isRequired],
                isDateTime: [attr.isDateTime],
                isAutomatic: [attr.isAutomatic],
                tooltipHelp: [attr.tooltipHelp],
                valueAtr: [{ disabled: disallowedStates.includes(project?.state), value: attr.valueAtr }, this.addValidControl(attr,"valueAtr")],
                valueAtrOpc: [{ disabled: disallowedStates.includes(project?.state), value: attr.valueAtrOpc }],
                description: [attr.description],
                state: [attr.state],
                currency: [attr.currency],
                image: [attr.image],
                typeObject: [attr.typeObject],
                registrationUsu: [this.user.cPerCodigo],
                registrationHost: [this.ipClient],
                listValuesAttribute: this.addMultipleOptions(attr.listValuesAttribute),
                updateUsu: [this.user.cPerCodigo],
                updateHost: [this.ipClient]
            });

            //formGroup.get('sequence').addValidators()
            formArray.push(formGroup);
        });
    }

    addMultipleOptions(array: SchemaAttributeValue[]): FormArray {
        const options = this._fb.array([]) as FormArray;
        array.forEach(data => {
            if (data.label) options.push(this.initFormSchemaAttributeValue(data));
        });
        return options;
    }

    addValidControl(attribute: SchemaAttribute, controlName: string): ValidationErrors {
        if(attribute.isRequired)
            return Validators.required;
    }

    setValuesFormFields(detail: ProjectDetail[], fieldsFormArray: FormArray): void {
        detail.forEach((value, index) => {
            fieldsFormArray.at(index)?.get("valueAtr").setValue(value.description)
        })
    }

    initFormSchemaAttributeValue(element: SchemaAttributeValue, disabled?: boolean): FormGroup {
        return this._fb.group({
            id: [element.id],
            schemaAttributeId: [element.schemaAttributeId],
            label: [element.label],
            value: [element.value],
            bValue: [element.bValue],
            state: [disabled ? 0 : element.state],
            registrationUsu: [element.registrationUsu],
            registrationHost: [element.registrationHost],
            updateUsu: [element.updateUsu],
            updateHost: [element.updateHost]
        });
    }

    redirectToProjectList(): void {
        this._router.navigate(["/gestion-proyecto/proyectos"])
    }
    
    verificationError(form: AbstractControl, control: string): string {
        return this._formService.obtenerErrorControl(form.get(control));
    } */
}