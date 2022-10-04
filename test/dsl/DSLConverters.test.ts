import {describe, expect, test} from '@jest/globals';
import {DSLConverters} from "../../src/dsl/DSLConverters";


describe('DSLConverters', () => {

    test('can convert string to dsl type', () => {
        expect(DSLConverters.asDSLType('')).toBe('void');
        expect(DSLConverters.asDSLType('string')).toBe('string');
        expect(DSLConverters.asDSLType('string[]')).toBe({name:'string',list:true});
    })

})