import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    EnvironmentProviders,
    Provider,
    inject,
} from '@angular/core';
import { errorInterceptor } from '../error.interceptor';

export const provideError = (): Array<Provider | EnvironmentProviders> => {
    return [
        provideHttpClient(withInterceptors([errorInterceptor])),
    ];
};
