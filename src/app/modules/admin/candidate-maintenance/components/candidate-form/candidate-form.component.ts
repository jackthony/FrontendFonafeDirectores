import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CANDIDATE_FORM_IMPORTS } from 'app/shared/imports/business-management/candidate-form.import';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [...CANDIDATE_FORM_IMPORTS],
  templateUrl: './candidate-form.component.html',
  styleUrl: './candidate-form.component.scss'
})
export class CandidateFormComponent {

  private readonly _router = inject(Router);
  form: FormGroup;






    returnInit(): void {
    this._router.navigate(['home']); // Redirige a la página de inicio
  }
}
