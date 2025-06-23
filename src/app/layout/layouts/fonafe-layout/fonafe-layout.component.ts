import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { User } from '@models/user.interface';
import { UserService } from 'app/core/user/user.service';
import { NotificationsBellComponent } from 'app/layout/common/notifications-bell/notifications-bell.component';
import { QuitComponent } from 'app/layout/common/quit/quit.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'fonafe-layout',
    templateUrl: './fonafe-layout.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [FuseLoadingBarComponent, RouterOutlet, QuitComponent, NotificationsBellComponent],
})
export class FonafeComponent implements OnInit, OnDestroy {
    // Inyección del servicio Router para permitir la navegación entre vistas de la aplicación.
	private readonly _router = inject(Router);

    private _userService = inject(UserService);

	private _unsubscribeAll: Subject<void> = new Subject<void>();

	user: User;

    
    /**
     * Constructor
     */
    constructor() {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });
    }

    redirectToHome(): void {
        this._router.navigate(['home']);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
