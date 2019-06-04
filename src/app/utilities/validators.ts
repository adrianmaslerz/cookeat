import { FormControl, FormGroup } from '@angular/forms';

export function alpha(control: FormControl): { [ key: string ]: boolean }
{
    return !XRegExp('^[\\p{L}\\s]*$').test(control.value)? { 'alpha': true } : null;
}
export function numbers(control: FormControl): { [ key: string ]: boolean }
{
    return control.value != null && !/^[0-9]*$/.test(control.value) ? { 'numbers': true } : null;
}
export function alphaNumbers(control: FormControl): { [ key: string ]: boolean }
{
    return !XRegExp('^[\\p{L}\\s0-9]*$').test(control.value)? { 'alphaNumbers': true } : null;
}
export function invalidDate(control: FormControl): { [ key: string ]: boolean }
{
    return control.value && isNaN(Date.parse(control.value))? { 'invalidDate': true } : null;
}
export function adult(control: FormControl): { [ key: string ]: boolean }
{
    let now = new Date();
    now.setFullYear(now.getFullYear() - 18);
    let value = new Date(control.value);
    return !value || now.getTime() <= value.getTime()? { 'adult': true } : null;
}
export function equalToFieldValue(fieldValue: string)
{
    return (control: FormControl): { [ key: string ]: boolean } => fieldValue != control.value? { 'equalToFieldValue': true } : null;
}
export function password(control: FormControl)
{
    return !/^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{6,}$/.test(control.value)? { 'password': true } : null;
}
export function equalTo(value: any)
{
    return (control: FormControl): { [ key: string ]: boolean } =>  value != control.value? { 'equalTo': true } : null;
}
export function greaterThan(value: any)
{
    return (control: FormControl): { [ key: string ]: boolean } =>  parseInt(control.value) <= parseInt(value) ? { 'greaterThan': true } : null;
}

//dates
export function dateGreaterThan(value: Date)
{
    return (control: FormControl): { [ key: string ]: boolean } => {
        return new Date(control.value).getTime() <= new Date(value).getTime() ? { 'dateGreaterThan': true } : null;
    }
}

//file validators
export function fileSize(file: File, max: number)
{
    return (control: FormControl): { [ key: string ]: boolean } => {

        return !file || file.size > (1024 * 1024 * max) ? { 'fileSize': true } : null;
    }
}

export function minFileSize(file: File, min: number)
{
    return (control: FormControl): { [ key: string ]: boolean } => {

        return !file || file.size < min ? { 'minFileSize': true } : null;
    }
}

export function fileType(file: File, mimeTypes: Array<string>)
{
    return (control: FormControl): { [ key: string ]: boolean } =>  !file || mimeTypes.indexOf(file.type) == -1 ? { 'fileType': true } : null;
}
