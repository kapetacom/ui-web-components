import _ from 'lodash';

let validators:any = {};

validators.required = (fieldName:string, value:any) => {
    if (value === '' ||
        value === undefined ||
        value === null) {
        throw new Error(`This value is required`);
    }

    if (typeof value === 'object' &&
        _.isEmpty(value)) {
        throw new Error(`This value is required`);
    }
};

validators.email = (fieldName:string, value:any) => {
    if (value && value.indexOf('@') === -1) {
        throw new Error(`Email is not valid`);
    }
};


export const Validators = validators;

export function normaliseValidators(validation: any) {
    let validators = [];
    if (validation) {
        if (Array.isArray(validation)) {
            validators = validation;
        } else {
            validators = [validation];
        }
    }
    return validators;
}

export function applyValidation(validation: any, name:string, value:any):string[] {

    let validators = normaliseValidators(validation);

    return validators.map((validator: any) => {
        if (typeof validator === 'string') {
            if (!Validators[validator]) {
                throw new Error(`Unknown validator: ${validator}`);
            }

            validator = Validators[validator];
        }

        try {
            validator.call(Validators, name, value);
            return null;
        } catch (err) {
            if (typeof err === 'string') {
                return err;
            }

            return err.message;
        }

    }).filter((error: string) => !!error);
}