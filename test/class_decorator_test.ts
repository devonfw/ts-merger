import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merge class decorators with merge():', () => {
    let testResources = './test/resources/class/';
    let baseTestResources = testResources + 'base/';
    let patchTestResources = testResources + 'patch/';
    let outputTestTempResources = testResources + 'output/';

    it('should add the decorator from the patch. (./test/resources/class/{base|patch}/class_7.ts)', () => {
        /**
         * fails if the result doesn't contain the decorator from the patch
         */
        const result:String[] = merge(false, baseTestResources + "class_7.ts", patchTestResources + "class_7.ts", outputTestTempResources + 'decorator_7_output.ts', 'UTF-8')
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
        const result:String[] = merge(true, baseTestResources + "class_7.ts", patchTestResources + "class_7.ts", outputTestTempResources + 'decorator_7_output_override.ts', 'UTF-8')
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
        const result:String[] = merge(false, baseTestResources + "class_8.ts", patchTestResources + "class_8.ts", outputTestTempResources + 'decorator_8_output.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('@deca(true)')).to.be.greaterThan(-1, 'decoration should have value from base');
    });
    it('should use the value from the patch if decoration is present in base and patch, and patchOverride is true. (./test/resources/class/{base|patch}/class_8.ts)', () => {
        /**
         * fails if the result doesn't use the value from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_8.ts", patchTestResources + "class_8.ts", outputTestTempResources + 'decorator_8_output_override.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.indexOf('@deca(false)')).to.be.greaterThan(-1, 'decoration should have value from patch');
    });
    it('should merge the NgModule decorator properties (./test/resources/class/{base|patch}/class_9.ts)', () => {
        /**
         * fails if the result doesn't use the values from the base and patch
         */
        const fullResult:String = merge(false, baseTestResources + "class_9.ts", patchTestResources + "class_9.ts", outputTestTempResources + 'decorator_9_output.ts', 'UTF-8');
        const result:String[] = fullResult.split("\n").map(value => value.trim()).filter(value => value != "");
        const concatResult:String=result.reduce((prev, curr) => prev.toString() + curr.toString(), "");
        let ngModuleRegex=/@NgModule\(\{.*/;
        let ngModuleFullRegex=/@NgModule\(\{.*,.*\}\).*/;
        let providerRegex=/.*providers:\s*\[\s*a\s*,\s*b\s*\].*/;
        let idRegex =/.*id:\s*'1'.*/;
        expect(result.filter(value => ngModuleRegex.test(value.toString())).length).to.be.equal(1, 'There should exactly be one @NgModule decorator');
        //expect(result.filter(value => providerRegex.test(value.toString())).length).to.be.equal(1, 'There should exactly be one providers property in the NgModule');
        expect(providerRegex.test(concatResult.toString()), 'The "providers" property should be present').to.be.true;
        expect(idRegex.test(concatResult.toString()), 'The "id" property should be present').to.be.true;
        expect(ngModuleFullRegex.test(concatResult.toString()), 'The @NgModule decorator should be valid TypeScript').to.be.true;
    });
    it('should merge the NgModule decorator properties with patchOverride (./test/resources/class/{base|patch}/class_9.ts)', () => {
        /**
         * fails if the result doesn't use the values from the base and patch
         */
        const fullResult:String = merge(true, baseTestResources + "class_9.ts", patchTestResources + "class_9.ts", outputTestTempResources + 'decorator_9_output_override.ts', 'UTF-8');
        const result:String[] = fullResult.split("\n").map(value => value.trim()).filter(value => value != "");
        const concatResult:String=result.reduce((prev, curr) => prev.toString() + curr.toString(), "");
        console.log(concatResult);
        let ngModuleRegex=/@NgModule\(\{.*/;
        let ngModuleFullRegex=/@NgModule\(\{.*,.*\}\)/;
        let providerExistenceRegex=/.*providers\s*:.*/;
        let providerRegex=/.*providers:\s*\[\s*a\s*,\s*b\s*\].*/;
        let idExistenceRegex=/.*id\s*:.*/;
        let idRegex = /.*id\s*:\s*'1'.*/;
        expect(result.filter(value => ngModuleRegex.test(value.toString())).length).to.be.equal(1, 'There should exactly be one @NgModule decorator');
        //TODO: 0, if patchOverride doesn't merge. If so, adapt message
        expect(result.filter(value => providerExistenceRegex.test(value.toString())).length).to.be.equal(1, 'There should exactly be one providers property in the NgModule');
        expect(result.filter(value => idExistenceRegex.test(value.toString())).length).to.be.equal(1, 'There should exactly be one id property in the NgModule');
        expect(ngModuleFullRegex.test(fullResult.toString()), 'The @NgModule decorator should be valid TypeScript').to.be.true;
    });
    it('should use the value from the base if NgModule property is present in base and patch. (./test/resources/class/{base|patch}/class_10.ts)', () => {
        /**
         * fails if the result doesn't use the value from the base
         */
        const result:String[] = merge(false, baseTestResources + "class_10.ts", patchTestResources + "class_10.ts", outputTestTempResources + 'decorator_10_output.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /[^]*id: '1'[^]*/.test(value.toString())).length).to.be.equal(1, 'id should have value from base');
    });
    it('should use the value from the patch if ngModule property is present in base and patch, and patchOverride is true. (./test/resources/class/{base|patch}/class_10.ts)', () => {
        /**
         * fails if the result doesn't use the value from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_10.ts", patchTestResources + "class_10.ts", outputTestTempResources + 'decorator_9_output_override.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /[^]*id: '2'[^]*/.test(value.toString())).length).to.be.equal(1, 'id should have value from patch');
    });

    it('should add the patch decorator although base hase none (resources/class/{base|patch}/class_14.ts)', () => {
        /**
         * fails if the result doesn't use the decorator from the patch
         */
        const result:String[] = merge(false, baseTestResources + "class_14.ts", patchTestResources + "class_14.ts", outputTestTempResources + 'decorator_14_output.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /@deca.*/.test(value.toString())).length).to.be.equal(1, 'id should have value from patch');
    });
    it('should add the patch decorator although base hase none with patchOverride (resources/class/{base|patch}/class_14.ts)', () => {
        /**
         * fails if the result doesn't use the decorator from the patch
         */
        const result:String[] = merge(true, baseTestResources + "class_14.ts", patchTestResources + "class_14.ts", outputTestTempResources + 'decorator_14_output_override.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "");
        expect(result.filter(value => /@deca.*/.test(value.toString())).length).to.be.equal(1, 'id should have value from patch');
    });

    it('should use the property value from the base (resources/class/{base|patch}/class_15.ts)', () => {
        const result = merge(false, baseTestResources + "class_15.ts", patchTestResources + "class_15.ts", outputTestTempResources + 'decorator_15_output.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "").reduce((prev, curr) => prev.toString() + curr.toString(), "");
        const baseDecoratorRegex = /@decorator\(\s*["']a["']\s*,\s*["']b["']\s*\).*/;
        expect(baseDecoratorRegex.test(result.toString()), 'id of the base should be present').to.be.true;
    });

    it('should use the property value from the patch with patchOverride (resources/class/{base|patch}/class_15.ts)', () => {
        const result = merge(true, baseTestResources + "class_15.ts", patchTestResources + "class_15.ts", outputTestTempResources + 'decorator_15_output_override.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "").reduce((prev, curr) => prev.toString() + curr.toString(), "");
        const patchDecoratorRegex = /@decorator\(\s*["']c["']\s*,\s*["']d["']\s*\).*/;
        expect(patchDecoratorRegex.test(result.toString()), 'id of the patch should be present').to.be.true;
    });
    
    it('shouldn\'t merge the decorator argument since 2 are present (resources/class/{base|patch}/class_16.ts)', () => {
        const result = merge(false, baseTestResources + "class_16.ts", patchTestResources + "class_16.ts", outputTestTempResources + 'decorator_16_output.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "").reduce((prev, curr) => prev.toString() + curr.toString(), "");
        const patchDecoratorRegex = /.*id.*/;
        expect(patchDecoratorRegex.test(result.toString()), 'id of the base should be present').to.be.false;
    });
    
    it('shouldn\'t merge the decorator argument since 2 are present with patchOverride (resources/class/{base|patch}/class_16.ts)', () => {
        const result = merge(true, baseTestResources + "class_16.ts", patchTestResources + "class_16.ts", outputTestTempResources + 'decorator_16_output_override.ts', 'UTF-8')
            .split("\n")
            .map(value => value.trim())
            .filter(value => value != "").reduce((prev, curr) => prev.toString() + curr.toString(), "");
        const baseDecoratorRegex = /.*provider.*/;
        expect(baseDecoratorRegex.test(result.toString()), 'id of the patch should be present').to.be.false;
    });


});