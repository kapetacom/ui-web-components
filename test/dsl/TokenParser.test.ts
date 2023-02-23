import { describe, test, expect } from '@jest/globals';
import { TokenParser } from '../../src/dsl/TokenParser';

describe('TokenParser', () => {
    test('can parse incomplete and invalid tokens', () => {
        const tokens = TokenParser.parse(
            `\n//Some comment \nmethod()\n enum test{`
        );

        expect(tokens).toEqual([
            {
                type: 'whitespace',
                value: '\n',
            },
            {
                type: 'comment',
                value: '//Some comment ',
            },
            {
                type: 'whitespace',
                value: '\n',
            },
            {
                type: 'id',
                value: 'method',
            },
            {
                type: 'special_other',
                value: '(',
            },
            {
                type: 'special_other',
                value: ')',
            },
            {
                type: 'whitespace',
                value: '\n ',
            },
            {
                type: 'id',
                value: 'enum',
            },
            {
                type: 'whitespace',
                value: ' ',
            },
            {
                type: 'id',
                value: 'test',
            },
            {
                type: 'special_start',
                value: '{',
            },
        ]);
    });

    test('can parse valid tokens into types', () => {
        const tokens = TokenParser.parse(
            `@Annotate("this")\nmethod():void\nenum test{}`
        );

        expect(tokens).toEqual([
            {
                type: 'annotation_type',
                value: '@Annotate',
            },
            {
                type: 'special_start',
                value: '(',
            },
            {
                type: 'string',
                value: '"this"',
            },
            {
                type: 'special_end',
                value: ')',
            },
            {
                type: 'whitespace',
                value: '\n',
            },
            {
                type: 'method_name',
                value: 'method',
            },
            {
                type: 'special_start',
                value: '(',
            },
            {
                type: 'special_end',
                value: ')',
            },
            {
                type: 'special_colon',
                value: ':',
            },
            {
                type: 'return_type',
                value: 'void',
            },
            {
                type: 'whitespace',
                value: '\n',
            },
            {
                type: 'keyword',
                value: 'enum',
            },
            {
                type: 'whitespace',
                value: ' ',
            },
            {
                type: 'enum_name',
                value: 'test',
            },
            {
                type: 'special_start',
                value: '{',
            },
            {
                type: 'special_end',
                value: '}',
            },
        ]);
    });
});
