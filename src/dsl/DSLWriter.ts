import {
    DSLAnnotation,
    DSLDataType,
    DSLDataTypeProperty,
    DSLEntity,
    DSLEntityType,
    DSLEnum,
    DSLMethod,
    DSLParameter,
    DSLRichEntity,
    DSLType,
    toStandardType,
} from './types';

function toAnnotationCode(data: DSLAnnotation) {
    const out = [];

    out.push(`${data.type}`);

    const args = data.arguments ? data.arguments.filter((a) => !!a) : [];
    if (args.length > 0) {
        out.push('(');
        out.push(
            data.arguments
                .map((arg) => {
                    return JSON.stringify(arg);
                })
                .join(', ')
        );
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
        data.annotations
            ? data.annotations.map(toAnnotationCode).join(' ')
            : '',
        data.name + ':' + typeString,
    ]
        .join(' ')
        .trim();
}

function toParametersCode(parameters?: DSLParameter[]) {
    return parameters ? parameters.map(toParameterCode).join(', ').trim() : '';
}

function generateMetaCode(
    data: DSLRichEntity | DSLDataTypeProperty,
    prefix?: string
) {
    if (!prefix) {
        prefix = '';
    }
    const out = [];
    if (data.description) {
        out.push(
            prefix +
                '//' +
                data.description.split(/\n/).join('\n' + prefix + '//')
        );
    }

    if (data.annotations && data.annotations.length > 0) {
        out.push(prefix + toAnnotationsCode(data.annotations).trim());
    }
    return out.join('\n').trimEnd();
}

function toTypeString(type: DSLType) {
    const dataType = toStandardType(type);
    return dataType.name + (dataType.list ? '[]' : '');
}

function toPropertyCode(data: DSLDataTypeProperty, indent = 0) {
    let prefix = '\t'.repeat(1 + indent);
    let type;
    let dataType = toStandardType(data.type);
    if (dataType.name === 'object' && data.properties) {
        type = toPropertiesCode(data.properties, indent + 1);
        if (dataType.list) {
            type = `[${type}]`;
        }
    } else {
        type = dataType.name + (dataType.list ? '[]' : '');
    }

    const metaCode = generateMetaCode(data, prefix);

    const out = [];
    if (metaCode) {
        out.push(metaCode);
    }

    out.push(prefix + data.name + ': ' + type);
    return out.join('\n');
}

function toPropertiesCode(properties: DSLDataTypeProperty[], indent = 0) {
    let prefix = '\t'.repeat(indent);
    const out = ['{\n'];

    if (properties) {
        out.push(
            properties
                .map((property) => toPropertyCode(property, indent))
                .join('\n') + '\n'
        );
    }

    out.push(prefix + '}');

    return out.join('');
}

function toDataTypeCode(data: DSLDataType) {
    const out = [generateMetaCode(data)];

    out.push(`${data.name} ${toPropertiesCode(data.properties)}`);

    return out.join('\n');
}

function toMethodCode(data: DSLMethod) {
    const out = [generateMetaCode(data).trim()];

    out.push(
        `${data.name}(${toParametersCode(data.parameters)}):${toTypeString(
            data.returnType
        )}`
    );

    return out.join('\n');
}

function toEnumCode(data: DSLEnum) {
    const out = [generateMetaCode(data)];

    out.push(`enum ${data.name} {\n\t${data.values.join(',\n\t')}\n}`);

    return out.join('\n');
}

export const DSLWriter = {
    write(entities: DSLEntity[]): string {
        return entities
            .map((entity) => {
                switch (entity.type) {
                    case DSLEntityType.COMMENT:
                        return '#' + entity.text;
                    case DSLEntityType.DATATYPE:
                        return toDataTypeCode(entity);
                    case DSLEntityType.ENUM:
                        return toEnumCode(entity);
                    case DSLEntityType.METHOD:
                        return toMethodCode(entity);
                }
            })
            .join('\n\n')
            .trim();
    },
};
