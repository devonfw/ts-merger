import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merge class declarations with merge():', function() {
    let testResources = './test/resources/class/';
    let baseTestResources = testResources + 'base/';
    let patchTestResources = testResources + 'patch/';
    let outputTestTempResources = testResources + 'output/';

    it('merge should yield a valid class (resources/class/{base|patch}/class_11.ts)', function() {
        /**
         * fails if the result isn't a valid typescript class
         */
        const result:String[] = merge(false, baseTestResources + "class_11.ts", patchTestResources + "class_11.ts", outputTestTempResources + 'class_11_output.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value.trim() != "");
        const assembledResult : String = result.reduce((prev:String, current:String) => {return prev.toString() + current.toString(); }, ""); 
        expect(assembledResult).equal("class a {}", "Result is not valid");
    });
    it('shouldn\'t use the patch extension (resources/class/{base|patch}/class_11.ts)', function() {
        /**
         * fails if the extension from the patch is applied 
         */
        const result:String[] = merge(false, baseTestResources + "class_11.ts", patchTestResources + "class_11.ts", outputTestTempResources + 'class_11_output1.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value.trim() != "");
        expect(result.filter(value => /class a \{[^]*/.test(value.toString())).length).to.be.equal(1, 'extension from patch shouldn\'t be applied');
    });
    it('should use the patch extension with patchOverride (resources/class/{base|patch}/class_11.ts)', function() {
        /**
         * fails if the extension from the patch isn't applied
         */
        const result:String[] = merge(true, baseTestResources + "class_11.ts", patchTestResources + "class_11.ts", outputTestTempResources + 'class_11_output_override.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a extends b[^]*/.test(value.toString())).length).to.be.equal(1, 'extension from patch should be applied');
    });
    it('should keep the base extension (resources/class/{base|patch}/class_11.ts, base and patch switched)', function() {
        /**
         * fails if the patch overrides the base extension declaration. This tests also uses class_11.ts, but the file in base directory is used as patch and vice versa!
         */
        const result:String[] = merge(false, patchTestResources + "class_11.ts", baseTestResources + "class_11.ts", outputTestTempResources + 'class_11_output3.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a extends b[^]*/.test(value.toString())).length).to.be.equal(1, 'extension from base should be kept');
    });
    it('shouldn\'t keep the base extension with patchOverride (resources/class/{base|patch}/class_11.ts, base and patch switched)', function() {
        /**
         * fails if the patch override the base extension declaration. This tests also uses class_11.ts, but the file in base directory is used as patch and vice versa!
         */
        const result:String[] = merge(true, patchTestResources + "class_11.ts", baseTestResources + "class_11.ts", outputTestTempResources + 'class_11_output1_override.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a \{[^]*/.test(value.toString())).length).to.be.equal(1, 'extension from base shouldn\'t be kept');
    });
    it('shouldn\'t use the patch implementations (resources/class/{base|patch}/class_12.ts)', function() {
        /**
         * fails if the implementation from the patch is applied 
         */
        const result:String[] = merge(false, baseTestResources + "class_12.ts", patchTestResources + "class_12.ts", outputTestTempResources + 'class_12_output.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a \{[^]*/.test(value.toString())).length).to.be.equal(1, 'implementation from patch shouldn\'t be applied');
    });
    it('should use the patch implementation with patchOverride (resources/class/{base|patch}/class_12.ts)', function() {
        /**
         * fails if the implementation from the patch isn't applied
         */
        const result:String[] = merge(true, baseTestResources + "class_12.ts", patchTestResources + "class_12.ts", outputTestTempResources + 'class_12_output_override.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a implements b[^]*/.test(value.toString())).length).to.be.equal(1, 'implementation from patch should be applied');
    });
    it('should keep the base implementation (resources/class/{base|patch}/class_11.ts, base and patch switched)', function() {
        /**
         * fails if the patch overrides the base implementation declaration. This tests also uses class_12.ts, but the file in base directory is used as patch and vice versa!
         */
        const result:String[] = merge(false, patchTestResources + "class_12.ts", baseTestResources + "class_12.ts", outputTestTempResources + 'class_12_output1.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a implements b[^]*/.test(value.toString())).length).to.be.equal(1, 'implementation from base should be kept');
    });
    it('shouldn\'t keep the base implementation with patchOverride (resources/class/{base|patch}/class_12.ts, base and patch switched)', function() {
        /**
         * fails if the patch doesn't override the base implementation declaration. This tests also uses class_12.ts, but the file in base directory is used as patch and vice versa!
         */
        const result:String[] = merge(true, patchTestResources + "class_12.ts", baseTestResources + "class_12.ts", outputTestTempResources + 'class_12_output1_override.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a \{[^]*/.test(value.toString())).length).to.be.equal(1, 'implementation from base shouldn\'t be kept');
    });
    xit('should merge implementations (resources/class/{base|patch}/class_13.ts)', function() {
        /**
         * fails if the implementations aren't merged
         * currently not supported
         */
        const result:String[] = merge(false, baseTestResources + "class_13.ts", patchTestResources + "class_13.ts", outputTestTempResources + 'class_13_output.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a implements\s*\w\s*,\s*\w.*/.test(value.toString())).length).to.be.equal(1, 'missformed class declaration');
    });
    xit('should merge implementations with patchOverrides (resources/class/{base|patch}/class_13.ts)', function() {
        /**
         * fails if the implementations aren't merged
         * currently not supported
         */
        const result:String[] = merge(false, baseTestResources + "class_13.ts", patchTestResources + "class_13.ts", outputTestTempResources + 'class_13_output_override.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a implements\s*\w\s*,\s*\w.*/.test(value.toString())).length).to.be.equal(1, 'missformed class declaration');
    });
});