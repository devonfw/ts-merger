import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merge class methods with merge():', () => {
    let testResources = './test/resources/class/';
    let baseTestResources = testResources + 'base/';
    let patchTestResources = testResources + 'patch/';
    
    it('should add the method from the patch. (./test/resources/class/{base|patch}/class_4.ts)', () => {
        /**
         * fails if the result doesn't contain the method from the patch
         */
        const result:String[] = merge(false, baseTestResources + "class_4.ts", patchTestResources + "class_4.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('private c(b: any): number'))
            .to.be.greaterThan(0, 'declaration should be present in class a');
    });
    it('should add the method from the patch with patchOverride. (./test/resources/class/{base|patch}/class_4.ts)', () => {
        /**
         * fails if the result doesn't contain the method from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_4.ts", patchTestResources + "class_4.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('private c(b: any): number'))
            .to.be.greaterThan(0, 'declaration should be present in class a');
    });
    it('should use the method body from the base if method is present in base and patch. (./test/resources/class/{base|patch}/class_5.ts)', () => {
        /**
         * fails if the result doesn't use the method body from the base
         */
        const result:String[] = merge(false, baseTestResources + "class_5.ts", patchTestResources + "class_5.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('let c = 5;')).to.be.greaterThan(0, 'b should have body from base');
    });
    it('should use the method body from the patch if method is present in base and patch, and patchOverride is true. (./test/resources/class/{base|patch}/class_5.ts)', () => {
        /**
         * fails if the result doesn't use the body from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_5.ts", patchTestResources + "class_5.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('let d = 6;')).to.be.greaterThan(0, 'b should have body from patch');
    });
    it('should use the modifier from the base if method is present in base and patch. (./test/resources/class/{base|patch}/class_6.ts)', () => {
        /**
         * fails if the result doesn't use the modifier from the base
         */
        const result:String[] = merge(false, baseTestResources + "class_6.ts", patchTestResources + "class_6.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('private b(a: any): void')).to.be.greaterThan(0, 'b should have modifier from base');
    });
    it('should use the modifier from the patch if method is present in base and patch, and patchOverride is true. (./test/resources/class/{base|patch}/class_6.ts)', () => {
        /**
         * fails if the result doesn't use the modifier from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_6.ts", patchTestResources + "class_6.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('public b(a: any): void')).to.be.greaterThan(0, 'b should have modifier from patch');
    });

});