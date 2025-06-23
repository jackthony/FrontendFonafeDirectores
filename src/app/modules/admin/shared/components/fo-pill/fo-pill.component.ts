import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'fo-pill',
  standalone: true,
  imports: [],
  templateUrl: './fo-pill.component.html',
  styleUrl: './fo-pill.component.scss'
})
export class FoPillComponent {
	text = input.required<string | number>();
	type = input.required<number>();
  	textPill = signal<string>('');
	classPill = signal<string>('');
  
	ngOnInit(): void {
		this.textPill.set(this.defineTextPill(this.text()));
	  	this.classPill.set(this.defineClass(this.type() ? this.type() : +this.text()));
	}

	defineTextPill(value: number | boolean | string): string {
        const val = typeof value === "boolean" ? +value : value;
        const map = {
            0: "Inactivo",
            1: "Activo"
        };

        return typeof value === "string" ? value : map[val];
    }
  
	defineClass(tipo: number): string {
		const map = {
			0: "pill-inactive",
			1: "pill-active",
			2: "pill-pending",
			3: "pill-observed",
			4: "pill-approved",
			5: "pill-cancelled",
			6: "pill-denied"
		};
		return map[tipo] ?? map[0];
	}
}
