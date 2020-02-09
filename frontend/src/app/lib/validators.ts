import { Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const nameValidators = [Validators.pattern(/^[A-Za-z\s\-]*$/), Validators.minLength(2), Validators.maxLength(100)];
export const nickNameValidators = [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(16),
    Validators.pattern(/^[A-Za-z0-9\-\_\.\!\/]*$/),
];
export const passwordValidators = [
    Validators.required,
    Validators.minLength(8),
    passwortCharsValidator,
];

export function isSameAsValidator(asControlGetter: () => AbstractControl): ValidatorFn {
    return (formControl: AbstractControl): ValidationErrors | null => {
        try {
            if (formControl.value === asControlGetter().value) {
                return null;
            } else {
                return { isSameAsValidator: 1 };
            }
        } catch (err) {
            return null;
        }
    };
}

function passwortCharsValidator(formControl: AbstractControl): ValidationErrors | null {
    const password: string = formControl.value;
    if (!password.match(/[A-Z]/)) {
        return {
            passwortCharsValidator: 'no uppercase'
        };
    }
    if (!password.match(/[a-z]/)) {
        return {
            passwortCharsValidator: 'no lowercase'
        };
    }
    if (!password.match(/[0-9]/)) {
        return {
            passwortCharsValidator: 'no number'
        };
    }
    const specialChars = '!"§$%&/()=?^°²³[]{}\\ß´`+~*#\'-_.:,;<>|@€µ';
    for (const char of specialChars.split('')) {
        if (password.indexOf(char) !== 0) {
            return null;
        }
    }
    return {
        passwortCharsValidator: 'no special'
    };
}
