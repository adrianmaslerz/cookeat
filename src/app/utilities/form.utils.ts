import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { equalToFieldValue } from './validators';

export function handleUniqueValidator(method: Function)
{
    return (control: FormControl): Promise<any> | Observable<any> =>
    {
        return new Promise<any>(((resolve, reject) =>
        {
            method(control.value).subscribe((status) => resolve(status[ 'exists' ] ? { uniqueness: true }: null));
        }));
    };
}

export function handleValidationStateClass(form: FormGroup, field: string): { 'is-invalid': boolean, 'is-valid': boolean }
{
    return {
        'is-invalid': !form.get(field).valid && form.get(field).touched,
        'is-valid': form.get(field).valid && form.get(field).touched
    };
}

export function handleValidationErrorMessage(form: FormGroup, field, messages: Array<{ field: string, errors: Array<{ error: string, message: string }> }>): string
{
    let message = '';

    if (!form.get(field).valid && form.get(field).touched && form.get(field).errors)
    {
        const validationMessagePack = messages.find(messageObject => messageObject.field === field);
        if (validationMessagePack)
        {
            const validationMessage = validationMessagePack.errors.find(
                errorPack => errorPack.error === Object.keys(form.get(field).errors)[ 0 ]);
            message = validationMessage ? validationMessage.message: '';
        }
    }

    return message;
}

export function getMessageError(error: HttpErrorResponse): string
{
    let message = '';

    const errorsArray = error.error.errors || [];
    if (errorsArray.length)
    {
        message = errorsArray[ 0 ].message || '';
    }
    return message;
}

export function validateControls(form: FormGroup)
{
    Object.keys(form.controls).forEach(controlName => {
        form.get(controlName).updateValueAndValidity();
    })
}


