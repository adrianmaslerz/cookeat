import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/core/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: [ './register.page.scss' ],
})
export class RegisterPage implements OnInit
{
    form: FormGroup;

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
                validators: [ Validators.required ]
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
