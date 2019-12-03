import { Injectable } from '@angular/core';
import { Config } from './models';
import { Observable } from 'rxjs';

declare const AuthenticationContext: any;

@Injectable({
    providedIn: 'root'
})
export class AdalService {

    constructor() {
    }

    getAuthContext(config: Config) {
        const conf = {
            clientId: config.clientId,
            redirectUri: window.location.origin,
            cacheLocation: 'localStorage',
            navigateToLoginRequestUrl: true,
            extraQueryParameter: `scope=${config.scope}`
        };
        return new AuthenticationContext(conf);
    }

    requestToken(config: Config) {
        const authContext = this.getAuthContext(config);
        const user = authContext.getCachedUser();
        if (user) {
            authContext.clearCache();
        }
        authContext.login();
    }

    checkCallback(hash: string, config: Config) {
        const authContext = this.getAuthContext(config);
        if (authContext.isCallback(hash)) {
            authContext.handleWindowCallback();
        }
    }

    getUser(config: Config) {
        const authContext = this.getAuthContext(config);
        return authContext.getCachedUser();

    }

    handlerCallback(config: Config) {
        return new Observable((obs) => {
            const authContext = this.getAuthContext(config);
            if (!authContext.getCachedUser()) {
                obs.error();
                obs.complete();
                return;
            }

            authContext.acquireToken(config.resource, (err, token) => {
                obs.next(token);
            });
        });
    }
}
