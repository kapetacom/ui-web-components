import {
    DSLAnnotation, DSLComment,
    DSLDataType,
    DSLDataTypeProperty,
    DSLEntity, DSLEntityType, DSLEnum,
    DSLMethod,
    DSLParameter,
    DSLRichEntity, DSLType, DSLTypeComplex, toStandardType
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
    const typeString = toTypeString(data.type);
    return [
        data.annotations ? data.annotations.map(toAnnotationCode).join(' ') : '',
        data.name + ':' + typeString
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


function toTypeString(type:DSLType) {
    const dataType = toStandardType(type);
    return dataType.name + (dataType.list ? '[]' : '')
}

function toPropertyCode(data: DSLDataTypeProperty, indent = 0) {
    let prefix = '\t'.repeat(1 + indent);
    let type;
    let dataType = toStandardType(data.type)
    if (dataType.name === 'object' &&
        data.properties) {
        type = toPropertiesCode(data.properties, indent + 1);
        if (dataType.list) {
            type = `[${type}]`;
        }
    } else {
        type = dataType.name + (dataType.list ? '[]' : '');
    }

    return [
        data.annotations ? data.annotations.map(toAnnotationCode).join('\n' + prefix) : '',
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

    out.push(`${data.name}(${toParametersCode(data.parameters)}):${toTypeString(data.returnType)}`)

    return out.join('\n');
}

function toEnumCode(data: DSLEnum) {
    const out = [toRichEntityCode(data)];

    out.push(`enum ${data.name} {\n\t${data.values.join(',\n\t')}\n}`)

    return out.join('\n');
}

export const DSLWriter = {
    write(entities: DSLEntity[]): string {
        return entities.map(entity => {
            switch (entity.type) {
                case DSLEntityType.COMMENT:
                    return '#' + entity.text
                case DSLEntityType.DATATYPE:
                    return toDataTypeCode(entity);
                case DSLEntityType.ENUM:
                    return toEnumCode(entity);
                case DSLEntityType.METHOD:
                    return toMethodCode(entity);
            }
        }).join('\n\n').trim();
    }
}