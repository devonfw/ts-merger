import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merge class methods with merge():', () => {
    let testResources = './test/resources/class/';
    let baseTestResources = testResources + 'base/';
    let patchTestResources = testResources + 'patch/';
    let outputTestTempResources = testResources + 'output/';
    
    it('should add the method from the patch. (./test/resources/class/{base|patch}/class_4.ts)', () => {
        /**
         * fails if the result doesn't contain the method from the patch
         */
        const result:String[] = merge(false, baseTestResources + "class_4.ts", patchTestResources + "class_4.ts", outputTestTempResources + 'class_4_output.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(res => /private\s+c\s*\(\s*b\s*:\s*any\s*\)\s*:\s*number\s*\{?/.test(res.toString()))).length.to.be.greaterThan(0, 'declaration should be present in class a');
    });
    it('should add the method from the patch with patchOverride. (./test/resources/class/{base|patch}/class_4.ts)', () => {
        /**
         * fails if the result doesn't contain the method from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_4.ts", patchTestResources + "class_4.ts", outputTestTempResources + 'class_4_output_override.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(res => /private\s+c\s*\(\s*b\s*:\s*any\s*\)\s*:\s*number\s*\{?/.test(res.toString()))).length
            .to.be.greaterThan(0, 'declaration should be present in class a');
    });
    it('should use the method body from the base if method is present in base and patch. (./test/resources/class/{base|patch}/class_5.ts)', () => {
        /**
         * fails if the result doesn't use the method body from the base
         */
        const result:String[] = merge(false, baseTestResources + "class_5.ts", patchTestResources + "class_5.ts", outputTestTempResources + 'class_5_output.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(res => /let\s+c\s*=\s*5\s*;/.test(res.toString()))).length.to.be.greaterThan(0, 'b should have body from base');
    });
    it('should use the method body from the patch if method is present in base and patch, and patchOverride is true. (./test/resources/class/{base|patch}/class_5.ts)', () => {
        /**
         * fails if the result doesn't use the body from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_5.ts", patchTestResources + "class_5.ts", outputTestTempResources + 'class_5_output_override.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(res => /let\s+d\s*=\s*6\s*;/.test(res.toString()))).length.to.be.greaterThan(0, 'b should have body from patch');
    });
    it('should use the modifier from the base if method is present in base and patch. (./test/resources/class/{base|patch}/class_6.ts)', () => {
        /**
         * fails if the result doesn't use the modifier from the base
         */
        const result:String[] = merge(false, baseTestResources + "class_6.ts", patchTestResources + "class_6.ts", outputTestTempResources + 'class_6_output.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(res => /private\s+b\s*\(\s*a\s*:\s*any\s*\)\s*:\s*void\s*\{?/.test(res.toString()))).length.to.be.greaterThan(0, 'b should have modifier from base');
    });
    it('should use the modifier from the patch if method is present in base and patch, and patchOverride is true. (./test/resources/class/{base|patch}/class_6.ts)', () => {
        /**
         * fails if the result doesn't use the modifier from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_6.ts", patchTestResources + "class_6.ts", outputTestTempResources + 'class_6_output_override.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(res => /public\s+b\s*\(\s*a\s*:\s*any\s*\)\s*:\s*void\s*\{?/.test(res.toString()))).length.to.be.greaterThan(0, 'b should have modifier from patch but was ' + result.reduce((prev, curr) => prev.toString() + curr.toString(), ""));
    });

});