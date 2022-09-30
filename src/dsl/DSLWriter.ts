import {
    DSLAnnotation, DSLComment,
    DSLDataType,
    DSLDataTypeProperty,
    DSLEntity, DSLEntityType,
    DSLMethod,
    DSLParameter,
    DSLRichEntity
} from "./types";

function toAnnotationCode(data: DSLAnnotation) {
    const out = [];

    out.push(`${data.type}`);

    const args = data.arguments ? data.arguments.filter(a => !!a) : [];
    if (args.length > 0) {
        out.push('(');
        out.push(data.arguments.map(arg => {
            return JSON.stringify(arg)
        }).join(', '));
        out.push(')');
    }

    return out.join('');
}

function toAnnotationsCode(data: DSLAnnotation[]) {
    return data ? data.map(toAnnotationCode).join('\n') : '';
}


function toParameterCode(data: DSLParameter) {
    return [
        data.annotations ? data.annotations.map(toAnnotationCode).join(' ') : '',
        data.name + ':' + data.type
    ].join(' ').trim();
}

function toParametersCode(parameters?: DSLParameter[]) {
    return parameters ? parameters.map(toParameterCode).join(', ').trim() : '';
}

function toRichEntityCode(data: DSLRichEntity) {
    const out = [];
    if (data.description) {
        out.push('//' + data.description.split(/\n/).join('\n//'))
    }

    if (data.annotations && data.annotations.length > 0) {
        out.push(toAnnotationsCode(data.annotations).trim());
    }
    return out.join('\n').trim();
}

function toPropertyCode(data: DSLDataTypeProperty, indent = 0) {
    let prefix = '\t'.repeat(1 + indent);
    let type;
    if (data.type === 'object' &&
        data.properties) {
        type = toPropertiesCode(data.properties, indent + 1);
        if (data.list) {
            type = `[${type}]`;
        }
    } else {
        type = data.type + (data.list ? '[]' : '');
    }

    return prefix + [
        data.annotations ? data.annotations.map(toAnnotationCode).join('\n') : '',
        data.name + ': ' + type
    ].join('\n' + prefix);
}

function toPropertiesCode(properties: DSLDataTypeProperty[], indent = 0) {
    let prefix = '\t'.repeat(indent);
    const out = ['{']

    if (properties) {
        out.push(properties.map(property => toPropertyCode(property, indent)).join(''))
    }

    out.push('\n' + prefix + '}');

    return out.join('');
}

function toDataTypeCode(data: DSLDataType) {
    const out = [toRichEntityCode(data)];

    out.push(`${data.name} ${toPropertiesCode(data.properties)}`)

    return out.join('\n');
}

function toMethodCode(data: DSLMethod) {
    const out = [toRichEntityCode(data).trim()];

    out.push(`${data.name}(${toParametersCode(data.parameters)}):${data.returnType}`)

    return out.join('\n');
}

export const DSLWriter = {
    write(entities: DSLEntity[]): string {
        return entities.map(entity => {
            switch (entity.type) {
                case DSLEntityType.COMMENT:
                    return '#' + (entity as DSLComment).text
                case DSLEntityType.DATATYPE:
                    const dataType = entity as DSLDataType;
                    return toDataTypeCode(dataType);
                case DSLEntityType.METHOD:
                    const method = entity as DSLMethod;
                    return toMethodCode(method);
            }
        }).join('\n\n').trim();
    }
}