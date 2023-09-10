import Peggy, { ParserTracer } from 'peggy';

// @ts-ignore
import parser from './grammars/grammar_dsl.pegjs';
import { BUILT_IN_TYPES, DSLLanguageOptions, DSLResult, METHOD_ANNOTATIONS, PARAMETER_ANNOTATIONS } from './types';

interface SoftError {
    type: string;
    endColumn: number;
    endLineNumber: number;
    startColumn: number;
    startLineNumber: number;
    message: string;
}

export interface DSLParserOptions extends DSLLanguageOptions {
    startRule?: string;
    tracer?: ParserTracer;
    softErrorHandler?: (error: SoftError) => void;
    validator?: (object: any) => void;
}

export const DSLParser = {
    parse(code: string, options?: DSLParserOptions): DSLResult {
        if (!options) {
            options = {};
        }

        if (!options.parameterAnnotations) {
            options.parameterAnnotations = PARAMETER_ANNOTATIONS.map((a) => a.name);
        }

        if (!options.methodAnnotations) {
            options.methodAnnotations = METHOD_ANNOTATIONS.map((a) => a.name);
        }

        if (!options.typeAnnotations) {
            options.typeAnnotations = [];
        }

        if (!options.fieldAnnotations) {
            options.fieldAnnotations = [];
        }

        if (!options.validTypes) {
            options.validTypes = [];
        } else {
            options.validTypes = [...options.validTypes];
        }

        options.validTypes.push(...BUILT_IN_TYPES.map((t) => t.name));

        const entities = parser.parse(code, { ...options });

        return {
            code,
            entities,
        };
    },
};
