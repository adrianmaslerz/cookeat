import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/core/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: [ './login.page.scss' ],
})
export class LoginPage implements OnInit
{
    form: FormGroup;

    constructor(private authService: AuthService) { }

    ngOnInit()
    {
        this.form = new FormGroup({
            email: new FormControl(null, {
                updateOn: 'blur',
                validators: [ Validators.required, Validators.email ]
            }),
            password: new FormControl(null, {
                updateOn: 'blur',
                validators: [ Validators.required ]
            })
        });
    }

    onSubmit(): void
    {
        if (!this.form.valid)
        {
            return;
        }

        this.authService.login(this.form.value)
            .subscribe(response =>
            {
                console.log(response);
            }, (error =>
            {
                console.log(error)
            }));
    }
}
