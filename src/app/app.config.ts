/*************************************************************************************
 * Nombre del archivo:  app.config.ts
 * Descripción:         Configuración global de la aplicación Angular. Define los
 *                      proveedores para enrutamiento, internacionalización (i18n),
 *                      temas (Fuse), API mock, adaptación de fechas, animaciones,
 *                      y servicios de autenticación e íconos.
 * Autor:               Daniel Alva
 * Fecha de creación:   01/06/2025
 * Última modificación: 22/06/2025 por Daniel Alva
 * Cambios recientes:   Configuración inicial de `ApplicationConfig`
 *************************************************************************************/
import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import { LuxonDateAdapter, MAT_LUXON_DATE_FORMATS } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
    PreloadAllModules,
    provideRouter,
    withInMemoryScrolling,
    withPreloading,
} from '@angular/router';
import { provideFuse } from '@fuse';
import { TranslocoService, provideTransloco } from '@ngneat/transloco';
import { appRoutes } from 'app/app.routes';
import { provideAuth } from 'app/core/interceptors/providers/auth.provider';
import { provideIcons } from 'app/core/icons/icons.provider';
import { firstValueFrom } from 'rxjs';
import { TranslocoHttpLoader } from './core/transloco/transloco.http-loader';
import { provideToastr } from 'ngx-toastr';
import { provideError } from './core/interceptors/providers/error.provider';
/**
 * Configuración principal de la aplicación Angular mediante el objeto `ApplicationConfig`.
 * Incluye la inyección de servicios globales, rutas, internacionalización, temas y mock APIs.
 */
export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideHttpClient(),
        provideToastr({
            positionClass: 'toast-top-full-width',
           progressBar: true
        }),
        provideError(),
        provideRouter(
            appRoutes,
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
        ),
        {
            provide: DateAdapter,
            useClass: LuxonDateAdapter,
        },
        { provide: MAT_DATE_LOCALE, useValue: "es-ES" },
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: 'dd/LL/yyyy',
                  },
                  display: {
                    dateInput: 'dd/LL/yyyy',
                    monthYearLabel: 'LLL yyyy',
                    dateA11yLabel: 'dd/LL/yyyy',
                    monthYearA11yLabel: 'LLLL yyyy',
                  },
            },
        },
        provideTransloco({
            config: {
                availableLangs: [
                    {
                        id: 'en',
                        label: 'English',
                    },
                    {
                        id: 'tr',
                        label: 'Turkish',
                    },
                ],
                defaultLang: 'en',
                fallbackLang: 'en',
                reRenderOnLangChange: true,
                prodMode: true,
            },
            loader: TranslocoHttpLoader,
        }),
        {
            provide: APP_INITIALIZER,
            useFactory: () => {
                const translocoService = inject(TranslocoService);
                const defaultLang = translocoService.getDefaultLang();
                translocoService.setActiveLang(defaultLang);
                return () => firstValueFrom(translocoService.load(defaultLang));
            },
            multi: true,
        },
        provideAuth(),
        provideIcons(),
        provideFuse({
            fuse: {
                layout: 'classy',
                scheme: 'light',
                screens: {
                    sm: '600px',
                    md: '960px',
                    lg: '1280px',
                    xl: '1440px',
                },
                theme: 'theme-default',
                themes: [
                    {
                        id: 'theme-default',
                        name: 'Default',
                    },
                    {
                        id: 'theme-brand',
                        name: 'Brand',
                    },
                    {
                        id: 'theme-teal',
                        name: 'Teal',
                    },
                    {
                        id: 'theme-rose',
                        name: 'Rose',
                    },
                    {
                        id: 'theme-purple',
                        name: 'Purple',
                    },
                    {
                        id: 'theme-amber',
                        name: 'Amber',
                    },
                ],
            },
        }),
    ],
};