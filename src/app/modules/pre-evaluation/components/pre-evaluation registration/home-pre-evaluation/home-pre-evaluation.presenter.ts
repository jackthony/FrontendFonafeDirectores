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
        const candidate = element?.CrearCandidatoRequest;
        return this._fb.group({
            CrearCandidatoRequest: this._fb.group({
                SNombres: [element ? { disabled: true, value: candidate.SNombres} : '', [Validators.required, this._validationFormService.spaceValidator, Validators.maxLength(150)]],
                SApellidos: [element ? { disabled: true, value: candidate.SApellidos} : '', [Validators.required, this._validationFormService.spaceValidator, Validators.maxLength(150)]],
                NTipoDocumento: [element ? { disabled: true, value: candidate.NTipoDocumento} : 0, [Validators.required, Validators.min(1)]],
                SNumeroDocumento: [element ? { disabled: true, value: candidate.SNumeroDocumento} : '', Validators.required],
                DtFechaNacimiento: [element ?  { disabled: true, value: candidate.DtFechaNacimiento} : null, [Validators.required, Validators.maxLength(10)]],
                NGenero: [element ? { disabled: true, value: candidate.NGenero } : 0, [Validators.required, Validators.min(1)]],
                SCorreoElectronico: [element ? candidate.SCorreoElectronico: '', [Validators.required, Validators.maxLength(250), this._validationFormService.validationMail]],
                STelefono: [element ? candidate.STelefono: '', [Validators.required, this._validationFormService.validationPhone]],
                NDepartamentoId: [element ? candidate.NDepartamentoId: 0, [Validators.required, Validators.min(1)]],
                NProvinciaId: [element ? candidate.NProvinciaId: 0, [Validators.required, Validators.min(1)]],
                NDistritoId: [element ? candidate.NDistritoId: 0, [Validators.required, Validators.min(1)]],
                SDireccion: [element ? candidate.SDireccion: '', [Validators.required, this._validationFormService.spaceValidator, Validators.maxLength(255)]],
                NEstado: [element ? candidate.NEstado: '', Validators.required],
                BActivo: [element ? candidate.BActivo: true, Validators.required],
                //CAMBIAR ABAJOOO
                NUsuarioRegistroId: [element ? candidate.NUsuarioRegistroId: 123/* this._userService.userLogin().usuarioId */, Validators.required],
            })
            /* id: [project?.id ?? 0],
            schemaId: [project?.schemaId ?? 0, Validators.min(1)],
            workFlowId:[project?.workFlowId ?? 0, Validators.min(1)],
            code: [project?.code ?? ""],
            name: [project?.name ?? "", [Validators.required, Validators.maxLength(80)]],
            projectTypeId: [project?.projectTypeId ?? 0, Validators.min(1)],
            cPerJurCodigo: [project?.cPerJurCodigo ?? this.user.cPerJuridica],
            state: [project?.state ?? 1],
            registrationDate: [project?.registrationDate ?? new Date()],
            registrationUsu: [project?.registrationUsu ?? this.user.cPerCodigo],
            registrationHost: [project?.registrationHost ?? this.ipClient],
            updateDate: [project?.updateDate ?? new Date()],
            updateUsu: [project?.updateUsu ?? this.user.cPerCodigo],
            updateHost: [project?.updateHost ?? this.ipClient] */
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