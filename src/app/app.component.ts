import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Config } from './models';
import { AdalService } from './adal.service';
import { Subscription } from 'rxjs';
import * as jwt_decode from 'jwt-decode';

@Component({
    selector: 'tx-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    token: { encoded: string; decoded: string; } = { encoded: null, decoded: null };
    cacheKey = 'tx.graph.hero.config';
    form: FormGroup;

    private configInstance: Config;

    get config(): Config {
        if (!this.configInstance) {
            const cache = localStorage.getItem(this.cacheKey);
            this.configInstance = cache ? JSON.parse(cache) : <Config> {
                clientId: '',
                resource: 'https://graph.microsoft.com',
                scope: 'openid profile'
            };
        }
        return this.configInstance;
    }

    set config(val: Config) {
        this.configInstance = val;
        localStorage.setItem(this.cacheKey, JSON.stringify(this.configInstance));
    }

    constructor(private formBuilder: FormBuilder, private adalService: AdalService) {

    }

    ngOnInit(): void {
        this.initForm();
        if (!this.config.clientId) {
            return;
        }
        this.adalService.checkCallback(window.location.hash, this.config);
        if (this.adalService.getUser(this.config)) {
            this.subscription = this.adalService.handlerCallback(this.config).subscribe((token: string) => {
                this.token.encoded = token;
                this.token.decoded = JSON.stringify(jwt_decode(token), null, 4);
            }, (err) => {
                console.log(err);
            });
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    requestToken() {
        if (this.config.clientId) {
            this.adalService.requestToken(this.config);
        }
    }

    private initForm() {
        this.form = this.formBuilder.group({
            clientId: this.formBuilder.control(this.config.clientId, [Validators.required]),
            resource: this.formBuilder.control(this.config.resource, [Validators.required]),
            scope: this.formBuilder.control(this.config.scope, [Validators.required])
        });
        this.form.valueChanges.subscribe((val: Config) => {
            this.config = val;
        });
    }
}
