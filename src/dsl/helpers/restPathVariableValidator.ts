import { DSLMethod, DSLParameter, PEGValidationEntity, toStandardType } from '../interfaces';
import { REST_METHOD_ANNOTATIONS, STRINGABLE_TYPES } from '../types';
import { isStringableType } from '@kapeta/schemas';

/**
 * Validates that REST methods contain valid path variables both in the path definition
 * as well as uses all path variables defined
 * @param entity
 */
export const restPathVariableValidator = (entity: PEGValidationEntity<DSLMethod>) => {
    if (entity.type !== 'method') {
        return;
    }

    const method = entity.data;

    if (!method.annotations) {
        return;
    }

    const restAnnotation = method.annotations.find((a) => REST_METHOD_ANNOTATIONS.some((rMA) => rMA.name === a.type));
    if (!restAnnotation) {
        return;
    }

    if (!restAnnotation.arguments || restAnnotation.arguments.length < 1) {
        return;
    }

    const path = restAnnotation.arguments[0];
    const rx = /\{([a-z][a-z0-9_-]*)(?::([^}]+))?}/gi;

    function getLocation(obj: any) {
        return obj.location;
    }

    function getPathVariableId(parameter: DSLParameter) {
        const pathAnnotation = parameter.annotations?.find((a) => a.type === '@Path');
        if (!pathAnnotation) {
            return null;
        }

        return pathAnnotation.arguments?.length > 0 && pathAnnotation.arguments[0]
            ? pathAnnotation.arguments[0]
            : parameter.name;
    }
    function reportError(message, loc?: any) {
        if (!loc) {
            loc = getLocation(restAnnotation);
        }
        throw {
            message,
            location: loc,
        };
    }

    //1. Validate that all variables in path has a corresponding path variable parameter
    const pathVariables = [];
    let result;
    while ((result = rx.exec(path)) != null) {
        const [_, variableName, pattern] = result;
        pathVariables.push(variableName);
        const parameter = method.parameters?.find((parameter) => {
            const pathVariableId = getPathVariableId(parameter);
            if (!pathVariableId) {
                return null;
            }

            return pathVariableId === variableName;
        });

        if (!parameter) {
            reportError(`Path variable not found in parameters ${variableName}`);
        }

        if (pattern) {
            try {
                new RegExp(pattern, 'ig');
            } catch (e) {
                reportError(`Invalid regular expression provided as pattern: ${pattern}. Error: ${e.message}`);
            }
        }
    }

    //2. Validate that all path variable parameters has a corresponding variable in the path

    method.parameters?.forEach((parameter) => {
        const pathAnnotation = parameter.annotations?.find((a) => a.type === '@Path');
        if (!pathAnnotation) {
            return;
        }

        const stdType = toStandardType(parameter.type);

        if (!isStringableType(stdType.name)) {
            reportError(
                `Parameter type can not be used in paths for parameter ${
                    parameter.name
                }. Supported types are ${STRINGABLE_TYPES.map((t) => t.name).join(', ')}`,
                getLocation(parameter)
            );
        }

        const pathVariableId = getPathVariableId(parameter);

        if (pathVariables.indexOf(pathVariableId) === -1) {
            reportError(
                `Parameter defines path variable "${pathVariableId}" which is never used in path`,
                getLocation(parameter)
            );
        }
    });
};
