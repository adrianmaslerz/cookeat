import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { equalToFieldValue } from '../../../../utilities/validators';
import { handleValidationErrorMessage, validateControls } from '../../../../utilities/form.utils';
import { AuthService } from '../../../../services/core/auth.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.page.html',
    styleUrls: [ './change-password.page.scss' ],
})
export class ChangePasswordPage implements OnInit
{
    form: FormGroup
    formUtils = { handleValidationErrorMessage, validateControls };

    messages = [
        {
            field: 'password',
            errors: [
                {
                    error: 'required',
                    message: 'Password is required'
                },
                {
                    error: 'minlength',
                    message: 'Password must have 6 characters at least'
                },
                {
                    error: 'equalToFieldValue',
                    message: 'Passwords don\'t match'
                },
            ]
        },
        {
            field: 'password_confirm',
            errors: [
                {
                    error: 'required',
                    message: 'Password confirmation is required'
                },
                {
                    error: 'equalToFieldValue',
                    message: 'Passwords don\'t match'
                },
            ]
        }
    ];

    constructor(private authService: AuthService) { }

    ngOnInit()
    {
        this.form = new FormGroup({
            password: new FormControl(null, {
                updateOn: 'blur',
                validators: [ Validators.required, Validators.minLength(6)]
            }),
            password_confirm: new FormControl(null, {
                updateOn: 'blur',
                validators: [ Validators.required ]
            }),
        })

        // password
        this.form.get('password')
            .valueChanges
            .subscribe(
                () => {
                    const control = this.form.get('password_confirm');
                    control.setValidators([Validators.required, equalToFieldValue(this.form.get('password').value)]);
                    control.updateValueAndValidity();
                });
    }

    onSubmit()
    {
        if(this.form.valid)
        {
            this.authService
                .changePassword(this.form.get("password").value)
                .subscribe(response => {
                    this.form.reset();
                })
        }
    }

}
