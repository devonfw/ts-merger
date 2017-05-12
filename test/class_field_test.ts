import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merge class fields with merge():', () => {
    let testResources = './test/resources/class/';
    let baseTestResources = testResources + 'base/';
    let patchTestResources = testResources + 'patch/';

    // ---- Fields ---- //
    it('should add the field from the patch. (./test/resources/class/{base|patch}/class_1.ts)', () => {
        /**
         * fails if the result doesn't contain the field from the patch
         */
        const result:String[] = merge(false, baseTestResources + "class_1.ts", patchTestResources + "class_1.ts")
            .split("\n") // get each individual line
            .map(value => value.trim()) // trim all lines (no whitespaces at the beginning and end of a line)
            .filter(value => value != ""); // remove emtpy lines
        expect(result.indexOf('private c;'))
            .to.be.greaterThan(0, 'declaration should be present in class a');
    });
    it('should add the field from the patch with patchOverride. (./test/resources/class/{base|patch}/class_1.ts)', () => {
        /**
         * fails if the result doesn't contain the field from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_1.ts", patchTestResources + "class_1.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('private c;'))
            .to.be.greaterThan(0, 'declaration should be present in class a');
    });
    it('should use the value from the base if variable is present in base and patch. (./test/resources/class/{base|patch}/class_2.ts)', () => {
        /**
         * fails if the result doesn't use the value from the base
         */
        const result:String[] = merge(false, baseTestResources + "class_2.ts", patchTestResources + "class_2.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('private b = 1;')).to.be.greaterThan(0, 'b should have value from base');
    });
    it('should use the value from the patch if variable is present in base and patch, and patchOverride is true. (./test/resources/class/{base|patch}/class_2.ts)', () => {
        /**
         * fails if the result doesn't use the value from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_2.ts", patchTestResources + "class_2.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('private b = 2;')).to.be.greaterThan(0, 'b should have value from patch');
    });
    it('should use the modifier from the base if variable is present in base and patch. (./test/resources/class/{base|patch}/class_3.ts)', () => {
        /**
         * fails if the result doesn't use the modifier from the base
         */
        const result:String[] = merge(false, baseTestResources + "class_3.ts", patchTestResources + "class_3.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('private b;')).to.be.greaterThan(0, 'b should have modifier from base');
    });
    it('should use the modifier from the patch if variable is present in base and patch, and patchOverride is true. (./test/resources/class/{base|patch}/class_3.ts)', () => {
        /**
         * fails if the result doesn't use the modifier from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_3.ts", patchTestResources + "class_3.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('public b;')).to.be.greaterThan(0, 'b should have modifier from patch');
    });

    
});