import Peggy, {ParserOptions, ParserTracer} from 'peggy';

// @ts-ignore
import GRAMMAR from './grammars/grammar_dsl.pegjs';
import {BUILT_IN_TYPES, DSLLanguageOptions} from "./types";

const parser = Peggy.generate(GRAMMAR);

interface Options extends DSLLanguageOptions {
    startRule?: string;
    tracer?: ParserTracer;
}

export const DSLParser = {
    parse(code:string, options?:Options) {
        if (!options) {
            options = {};
        }

        if (!options.parameterAnnotations) {
            options.parameterAnnotations = [];
        }

        if (!options.methodAnnotations) {
            options.methodAnnotations = [];
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

        options.validTypes.push(...BUILT_IN_TYPES);

        return parser.parse(code, {...options, grammarSource: GRAMMAR});
    }
};