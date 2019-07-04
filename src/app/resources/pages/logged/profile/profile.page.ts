import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { handleValidationErrorMessage, validateControls } from '../../../../utilities/form.utils';
import { AuthService } from '../../../../services/core/auth.service';
import { User } from '../../../../models/user.model';
import { UsersDataService } from '../../../../services/data/users.data.service';
import { ToastController } from '@ionic/angular';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: [ './profile.page.scss' ],
})
export class ProfilePage implements OnInit
{
    user: User;
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

    constructor(
        private authService: AuthService,
        private usersDataService: UsersDataService,
        private toastController: ToastController
    ) { }

    ngOnInit()
    {
        if(!this.authService.logged)
        {
            this.authService.user.subscribe(() => {
                this.user = this.authService.logged;
                this.initForm()
            })
        }
        else
        {
            this.user = this.authService.logged;
            this.initForm();
        }
    }

    initForm()
    {
        this.form = new FormGroup({
            email: new FormControl(this.user.email,
                {
                    updateOn: 'blur',
                    validators: [ Validators.required, Validators.email ],
                }
            ),
            first_name: new FormControl(this.user.first_name,
                {
                    updateOn: 'blur',
                    validators: [ Validators.required ],
                }
            ),
            last_name: new FormControl(this.user.last_name,
                {
                    updateOn: 'blur',
                    validators: [ Validators.required ],
                }
            ),
        });
    }

    onSubmit()
    {
        if(this.form.valid)
        {
            const values = this.form.value;
            this.authService
                .updateProfie({ email: values.email, first_name: values.first_name, last_name: values.last_name })
                .subscribe(response => {
                    this.toastController.create({
                        message: "Profile saved",
                        duration: 2000
                    }).then(toast => toast.present());
                })
        }
    }
}
