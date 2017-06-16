import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merge class decorators with merge():', () => {
    let testResources = './test/resources/class/';
    let baseTestResources = testResources + 'base/';
    let patchTestResources = testResources + 'patch/';

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
        expect(result.indexOf('@deca(true)')).to.be.greaterThan(-1, 'decoration should have value from base');
    });
    it('should use the value from the patch if decoration is present in base and patch, and patchOverride is true. (./test/resources/class/{base|patch}/class_8.ts)', () => {
        /**
         * fails if the result doesn't use the value from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_8.ts", patchTestResources + "class_8.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('@deca(false)')).to.be.greaterThan(-1, 'decoration should have value from patch');
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

    it('should add the patch decorator although base hase none (resources/class/{base|patch}/class_14.ts)', () => {
        /**
         * fails if the result doesn't use the decorator from the patch
         */
        const result:String[] = merge(false, baseTestResources + "class_14.ts", patchTestResources + "class_14.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /@deca.*/.test(value.toString())).length).to.be.equal(1, 'id should have value from patch');
    });
    it('should add the patch decorator although base hase none with patchOverride (resources/class/{base|patch}/class_14.ts)', () => {
        /**
         * fails if the result doesn't use the decorator from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_14.ts", patchTestResources + "class_14.ts")
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /@deca.*/.test(value.toString())).length).to.be.equal(1, 'id should have value from patch');
    });

});