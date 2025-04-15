import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-fo-search',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './fo-search.component.html',
  styleUrl: './fo-search.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FoSearchComponent implements OnInit, OnDestroy {
	disabledBtn = input<boolean>(false);
	defaultValue = input<string>('');
	delaySearch = input<number>(0);
	searchTerms = new Subject<string>();
	placeText = input<string>('');

	private _unsubscribeAll: Subject<null> = new Subject<null>();

	@Output() eventChangeData = new EventEmitter<string>();
	
	
	ngOnInit(): void {
		this.searchTerms
		.pipe(
			debounceTime(this.delaySearch()),
			takeUntil(this._unsubscribeAll)
		).subscribe(textSearch => {
			this.eventChangeData.emit(textSearch);
		});
	}

	search(text: string): void {
		this.searchTerms.next(text);
	}

	ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
