import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { User } from '@models/user.interface';
import { UserService } from 'app/core/user/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-banner-informative',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './banner-informative.component.html',
    styleUrl: './banner-informative.component.scss',
})
export class BannerInformativeComponent implements OnInit, OnDestroy {

	private _userService = inject(UserService);

	private _unsubscribeAll: Subject<void> = new Subject<void>();

	user: User;

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });
    }

	ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
