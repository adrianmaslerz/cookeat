import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/core/auth.service';
import { Router } from '@angular/router';
import { handleValidationErrorMessage, validateControls } from '../../../utilities/form.utils';
import { equalToFieldValue } from '../../../utilities/validators';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: [ './register.page.scss' ],
})
export class RegisterPage implements OnInit
{
    form: FormGroup;
    formUtils = { handleValidationErrorMessage, validateControls };

    messages = [
        {
            field: 'email',
            errors: [
                {
                    error: 'required',
                    message: 'Email is required'
                },
                {
                    error: 'email',
                    message: 'This is not a valid email address'
                }
            ]
        },
        {
            field: 'password',
            errors: [
                {
                    error: 'required',
                    message: 'Password is required'
                },
                {
                    error: 'minlength',
                    message: 'Password must have 8 characters at least'
                },
                {
                    error: 'equalToFieldValue',
                    message: 'Passwords don\'t match'
                },
            ]
        },
        {
            field: 'password_repeat',
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
        },
        {
            field: 'first_name',
            errors: [
                {
                    error: 'required',
                    message: 'First name is required'
                }
            ]
        },
        {
            field: 'last_name',
            errors: [
                {
                    error: 'required',
                    message: 'Last name is required'
                }
            ]
        },
    ];

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit()
    {
        this.form = new FormGroup({
            email: new FormControl(null, {
                updateOn: 'blur',
                validators: [ Validators.required, Validators.email ]
            }),
            password: new FormControl(null,{
                updateOn: 'blur',
                validators: [ Validators.required, Validators.minLength(8) ]
            }),
            password_repeat: new FormControl(null,{
                updateOn: 'blur',
                validators: [ Validators.required ]
            }),
            first_name: new FormControl(null, {
                updateOn: 'blur',
                validators: [ Validators.required, Validators.min(1) ]
            }),
            last_name: new FormControl(null, {
                updateOn: 'blur',
                validators: [ Validators.required, Validators.min(1) ]
            }),
        })

        // password
        this.form.get('password')
            .valueChanges
            .subscribe(
                () => {
                    const control = this.form.get('password_repeat');
                    control.setValidators([Validators.required, equalToFieldValue(this.form.get('password').value)]);
                    control.updateValueAndValidity();
                });
    }

    onSubmit() : void
    {
        if(!this.form.valid)
            return;

       this.authService.register(this.form.value)
           .then(response => {
              console.log(response)
               this.router.navigate(["/logged","home"])
           })
           .catch(error => {
               console.log(error)
           });
    }
}
