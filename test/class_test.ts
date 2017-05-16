import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merge class declarations with merge():', () => {
    let testResources = './test/resources/class/';
    let baseTestResources = testResources + 'base/';
    let patchTestResources = testResources + 'patch/';

    it('should use the patch extension (resources/class/{base|patch}/class_11.ts)', () => {
        /**
         * fails if the extension from the patch isn't applied 
         */
        const result:String[] = merge(false, baseTestResources + "class_11.ts", patchTestResources + "class_11.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a extends b[^]*/.test(value.toString())).length).to.be.equal(1, 'extension from patch should be applied');
    });
    it('should use the patch extension with patchOverride (resources/class/{base|patch}/class_11.ts)', () => {
        /**
         * fails if the extension from the patch isn't applied
         */
        const result:String[] = merge(true, baseTestResources + "class_11.ts", patchTestResources + "class_11.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a extends b[^]*/.test(value.toString())).length).to.be.equal(1, 'extension from patch should be applied');
    });
    it('should keep the base extension (resources/class/{base|patch}/class_11.ts, base and patch switched)', () => {
        /**
         * fails if the patch overrides the base extension declaration. This tests also uses class_11.ts, but the file in base directory is used as patch and vice versa!
         */
        const result:String[] = merge(false, patchTestResources + "class_11.ts", baseTestResources + "class_11.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a extends b[^]*/.test(value.toString())).length).to.be.equal(1, 'extension from base should be kept');
    });
    it('should keep the base extension with patchOverride (resources/class/{base|patch}/class_11.ts, base and patch switched)', () => {
        /**
         * fails if the patch override the base extension declaration. This tests also uses class_11.ts, but the file in base directory is used as patch and vice versa!
         */
        const result:String[] = merge(true, patchTestResources + "class_11.ts", baseTestResources + "class_11.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a extends b[^]*/.test(value.toString())).length).to.be.equal(1, 'extension from base should be kept');
    });
    it('should use the patch implementations (resources/class/{base|patch}/class_12.ts)', () => {
        /**
         * fails if the implementation from the patch isn't applied 
         */
        const result:String[] = merge(false, baseTestResources + "class_12.ts", patchTestResources + "class_12.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a implements b[^]*/.test(value.toString())).length).to.be.equal(1, 'implementation from patch should be applied');
    });
    it('should use the patch implementation with patchOverride (resources/class/{base|patch}/class_12.ts)', () => {
        /**
         * fails if the implementation from the patch isn't applied
         */
        const result:String[] = merge(true, baseTestResources + "class_12.ts", patchTestResources + "class_12.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a implements b[^]*/.test(value.toString())).length).to.be.equal(1, 'implementation from patch should be applied');
    });
    it('should keep the base implementation (resources/class/{base|patch}/class_11.ts, base and patch switched)', () => {
        /**
         * fails if the patch overrides the base implementation declaration. This tests also uses class_12.ts, but the file in base directory is used as patch and vice versa!
         */
        const result:String[] = merge(false, patchTestResources + "class_12.ts", baseTestResources + "class_12.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a implements b[^]*/.test(value.toString())).length).to.be.equal(1, 'implementation from base should be kept');
    });
    it('should keep the base implementation with patchOverride (resources/class/{base|patch}/class_12.ts, base and patch switched)', () => {
        /**
         * fails if the patch override the base implementation declaration. This tests also uses class_12.ts, but the file in base directory is used as patch and vice versa!
         */
        const result:String[] = merge(true, patchTestResources + "class_12.ts", baseTestResources + "class_12.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a implements b[^]*/.test(value.toString())).length).to.be.equal(1, 'implementation from base should be kept');
    });
    it('should merge implementations (resources/class/{base|patch}/class_13.ts)', () => {
        /**
         * fails if the implementations aren't merged
         */
        const result:String[] = merge(false, baseTestResources + "class_13.ts", patchTestResources + "class_13.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a implements\s*\w\s*,\s*\w.*/.test(value.toString())).length).to.be.equal(1, 'missformed class declaration');
    });
    it('should merge implementations with patchOverrides (resources/class/{base|patch}/class_13.ts)', () => {
        /**
         * fails if the implementations aren't merged
         */
        const result:String[] = merge(false, baseTestResources + "class_13.ts", patchTestResources + "class_13.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /class a implements\s*\w\s*,\s*\w.*/.test(value.toString())).length).to.be.equal(1, 'missformed class declaration');
    });
});