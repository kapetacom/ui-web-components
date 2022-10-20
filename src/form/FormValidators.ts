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