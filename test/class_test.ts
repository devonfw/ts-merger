import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merge classes with merge()', () => {
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

    // ---- Methods ---- //
    
    it('should add the method from the patch. (./test/resources/class/{base|patch}/class_4.ts)', () => {
        /**
         * fails if the result doesn't contain the method from the patch
         */
        const result:String[] = merge(false, baseTestResources + "class_4.ts", patchTestResources + "class_4.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('private c(b:any):number{'))
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
        expect(result.indexOf('private c(b:any):number{'))
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
        expect(result.indexOf('private b(a:any):void{')).to.be.greaterThan(0, 'b should have modifier from base');
    });
    it('should use the modifier from the patch if method is present in base and patch, and patchOverride is true. (./test/resources/class/{base|patch}/class_6.ts)', () => {
        /**
         * fails if the result doesn't use the modifier from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_6.ts", patchTestResources + "class_6.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('public b(a:any):void{')).to.be.greaterThan(0, 'b should have modifier from patch');
    });

    // ---- Decorators ---- //
    it('should add the decorator from the patch. (./test/resources/class/{base|patch}/class_7.ts)', () => {
        /**
         * fails if the result doesn't contain the decorator from the patch
         */
        const result:String[] = merge(false, baseTestResources + "class_7.ts", patchTestResources + "class_7.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('@decb'))
            .to.be.greaterThan(-1, 'decoration from patch should be present at class a');
        expect(result.indexOf('@deca'))
            .to.be.greaterThan(-1, 'decoration from base should be present at class a');
    });
    it('should add the decorator from the patch with patchOverride. (./test/resources/class/{base|patch}/class_7.ts)', () => {
        /**
         * fails if the result doesn't contain the decorator from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_7.ts", patchTestResources + "class_7.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('@decb'))
            .to.be.greaterThan(-1, 'decoration from patch should be present in class a');
        expect(result.indexOf('@deca'))
            .to.be.greaterThan(-1, 'decoration from base should be present at class a');
    });
    it('should use the value from the base if decorator is present in base and patch. (./test/resources/class/{base|patch}/class_8.ts)', () => {
        /**
         * fails if the result doesn't use the value from the base
         */
        const result:String[] = merge(false, baseTestResources + "class_8.ts", patchTestResources + "class_8.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('@deca(true)')).to.be.greaterThan(0, 'decoration should have value from base');
    });
    it('should use the value from the patch if decoration is present in base and patch, and patchOverride is true. (./test/resources/class/{base|patch}/class_8.ts)', () => {
        /**
         * fails if the result doesn't use the value from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_8.ts", patchTestResources + "class_8.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('@deca(false)')).to.be.greaterThan(0, 'decoration should have value from patch');
    });
    it('should merge the NgModule decorator properties (./test/resources/class/{base|patch}/class_9.ts)', () => {
        /**
         * fails if the result doesn't use the values from the base and patch
         */
        const fullResult:String = merge(false, baseTestResources + "class_9.ts", patchTestResources + "class_9.ts");
        const result:String[] = fullResult.split("\n").map(value => value.trim()).filter(value => value != "");
        let ngModuleRegex=new RegExp("@NgModule\\(\{.*");
        let ngModuleFullRegex=new RegExp("@NgModule(\{.*,.*\}).*");
        let providerRegex=new RegExp(".*providers: \[a, b\].*");
        let idRegex = new RegExp(".*id: '1'.*");
        expect(result.filter(value => ngModuleRegex.test(value.toString())).length).to.be.equal(1, 'There should exactly be one @NgModule decorator');
        expect(result.filter(value => providerRegex.test(value.toString())).length).to.be.equal(1, 'There should exactly be one providers property in the NgModule');
        expect(result.filter(value => idRegex.test(value.toString())).length).to.be.equal(1, 'There should exactly be one id property in the NgModule');
        expect(ngModuleFullRegex.test(fullResult.toString())).to.be.true('The @NgModule decorator should be valid TypeScript');
    });
    it('should merge the NgModule decorator properties with patchOverride (./test/resources/class/{base|patch}/class_9.ts)', () => {
        /**
         * fails if the result doesn't use the values from the base and patch
         */
        const fullResult:String = merge(true, baseTestResources + "class_9.ts", patchTestResources + "class_9.ts");
        const result:String[] = fullResult.split("\n").map(value => value.trim()).filter(value => value != "");
        let ngModuleRegex=new RegExp("@NgModule\\(\\{.*");
        let ngModuleFullRegex=new RegExp("@NgModule\\(\\{[^]*,[^]*\\}\\)[^]*");
        let providerRegex=new RegExp(".*providers: \\[a, b\\].*");
        let idRegex = new RegExp(".*id: '1'.*");
        expect(result.filter(value => ngModuleRegex.test(value.toString())).length).to.be.equal(1, 'There should exactly be one @NgModule decorator');
        expect(result.filter(value => providerRegex.test(value.toString())).length).to.be.equal(1, 'There should exactly be one providers property in the NgModule');
        expect(result.filter(value => idRegex.test(value.toString())).length).to.be.equal(1, 'There should exactly be one id property in the NgModule');
        expect(ngModuleFullRegex.test(fullResult.toString())).to.be.true('The @NgModule decorator should be valid TypeScript');
    });
    it('should use the value from the base if NgModule property is present in base and patch. (./test/resources/class/{base|patch}/class_10.ts)', () => {
        /**
         * fails if the result doesn't use the value from the base
         */
        const result:String[] = merge(false, baseTestResources + "class_10.ts", patchTestResources + "class_10.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /[^]*id: '1'[^]*/.test(value.toString())).length).to.be.equal(1, 'id should have value from base');
    });
    it('should use the value from the patch if ngModule property is present in base and patch, and patchOverride is true. (./test/resources/class/{base|patch}/class_10.ts)', () => {
        /**
         * fails if the result doesn't use the value from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_10.ts", patchTestResources + "class_10.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /[^]*id: '2'[^]*/.test(value.toString())).length).to.be.equal(1, 'id should have value from patch');
    });

    // ---- Inheritances ---- //
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