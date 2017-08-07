import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merging class decorators', () => {

  describe('should add the decorator from', () => {

    const base = "@deca class a {}", patch = "@decb class a {}";

    it('the patch.', () => {
      const result: String[] = merge(base, patch, false)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "");
      expect(result.indexOf('@decb'))
        .to.be.greaterThan(-1, 'decoration from patch should be present at class a');
      expect(result.indexOf('@deca'))
        .to.be.greaterThan(-1, 'decoration from base should be present at class a');
    });

    it('the patch with patchOverride.', () => {
      const result: String[] = merge(base, patch, true)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "");
      expect(result.indexOf('@decb'))
        .to.be.greaterThan(-1, 'decoration from patch should be present in class a');
      expect(result.indexOf('@deca'))
        .to.be.greaterThan(-1, 'decoration from base should be present at class a');
    });

  });

  describe('should use the value from', () => {

    const base = "@deca(true) class a {}", patch = "@deca(false) class a {}";

    it('the base if decorator is present in base and patch.', () => {
      const result: String[] = merge(base, patch, false)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "");
      expect(result.indexOf('@deca(true)')).to.be.greaterThan(-1, 'decoration should have value from base');
    });
    it('the patch if decoration is present in base and patch, and patchOverride is true.', () => {
      const result: String[] = merge(base, patch, true)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "");
      expect(result.indexOf('@deca(false)')).to.be.greaterThan(-1, 'decoration should have value from patch');
    });
  });

  describe('should merge the NgModule decorator properties', () => {

    const base = `@NgModule({
                      providers: [a, b]
                  })
                  class a {}`,
      patch = `@NgModule({
                    id: '1'
                })
                class a {}`;

    it('preserving patch', () => {
      const fullResult: String = merge(base, patch, false);
      const result: String[] = fullResult.split("\n").map(value => value.trim()).filter(value => value != "");
      const concatResult: String = result.reduce((prev, curr) => prev.toString() + curr.toString(), "");
      let ngModuleRegex = /@NgModule\(\{.*/;
      let ngModuleFullRegex = /@NgModule\(\{.*,*.*\}\).*/;
      let providerRegex = /.*providers:\s*\[\s*a\s*,\s*b\s*\].*/;
      let idRegex = /.*id:\s*'1'.*/;
      expect(result.filter(value => ngModuleRegex.test(value.toString())).length).to.be.equal(1, 'There should exactly be one @NgModule decorator');
      //expect(result.filter(value => providerRegex.test(value.toString())).length).to.be.equal(1, 'There should exactly be one providers property in the NgModule');
      expect(providerRegex.test(concatResult.toString()), 'The "providers" property should be present').to.be.true;
      expect(idRegex.test(concatResult.toString()), 'The "id" property should be present').to.be.true;
      expect(ngModuleFullRegex.test(concatResult.toString()), 'The @NgModule decorator should be valid TypeScript').to.be.true;
    });

    it('with patchOverride', () => {
      const fullResult: String = merge(base, patch, true);
      const result: String[] = fullResult.split("\n").map(value => value.trim()).filter(value => value != "");
      const concatResult: String = result.reduce((prev, curr) => prev.toString() + curr.toString(), "");
      console.log(concatResult);
      let ngModuleRegex = /@NgModule\(\{.*/;
      let ngModuleFullRegex = /@NgModule\(\{.*,.*\}\)/;
      let providerExistenceRegex = /.*providers\s*:.*/;
      let providerRegex = /.*providers:\s*\[\s*a\s*,\s*b\s*\].*/;
      let idExistenceRegex = /.*id\s*:.*/;
      let idRegex = /.*id\s*:\s*'1'.*/;
      expect(result.filter(value => ngModuleRegex.test(value.toString())).length).to.be.equal(1, 'There should exactly be one @NgModule decorator');
      expect(result.filter(value => providerExistenceRegex.test(value.toString())).length).to.be.equal(1, 'There should exactly be one providers property in the NgModule');
      expect(result.filter(value => idExistenceRegex.test(value.toString())).length).to.be.equal(1, 'There should exactly be one id property in the NgModule');
      expect(ngModuleFullRegex.test(concatResult.toString()), 'The @NgModule decorator should be valid TypeScript').to.be.true;
    });
  });

  describe('should use the value from', () => {

    const base = `@NgModule({
                        id: '1'
                    })
                    class a {}`,
      patch = `@NgModule({
                    id: '2'
                })
                class a {}`;

    it('the base if NgModule property is present in base and patch.', () => {
      const result: String[] = merge(base, patch, false)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "");
      expect(result.filter(value => /[^]*id: '1'[^]*/.test(value.toString())).length).to.be.equal(1, 'id should have value from base');
    });

    it('the patch if ngModule property is present in base and patch, and patchOverride is true.', () => {
      const result: String[] = merge(base, patch, true)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "");
      expect(result.filter(value => /[^]*id: '2'[^]*/.test(value.toString())).length).to.be.equal(1, 'id should have value from patch');
    });
  });

  describe('should add the patch decorator', () => {

    const base = `class a {}`, patch = `@deca class a {}`;

    it('although base has none.', () => {
      const result: String[] = merge(base, patch, false)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "");
      expect(result.filter(value => /@deca.*/.test(value.toString())).length).to.be.equal(1, 'id should have value from patch');
    });

    it('although base base none with patchOverride.', () => {
      const result: String[] = merge(base, patch, true)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "");
      expect(result.filter(value => /@deca.*/.test(value.toString())).length).to.be.equal(1, 'id should have value from patch');
    });
  });

  describe('should use the property value from', () => {

    const base = `@decorator("a", "b") class a {}`, patch = `@decorator("c", "d") class a {}`;

    it('should use the property value from the base.', () => {
      const result = merge(base, patch, false)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "").reduce((prev, curr) => prev.toString() + curr.toString(), "");
      const baseDecoratorRegex = /@decorator\(\s*["']a["']\s*,\s*["']b["']\s*\).*/;
      expect(baseDecoratorRegex.test(result.toString()), 'id of the base should be present').to.be.true;
    });

    it('should use the property value from the patch with patchOverride.', () => {
      const result = merge(base, patch, true)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "").reduce((prev, curr) => prev.toString() + curr.toString(), "");
      const patchDecoratorRegex = /@decorator\(\s*["']c["']\s*,\s*["']d["']\s*\).*/;
      expect(patchDecoratorRegex.test(result.toString()), 'id of the patch should be present').to.be.true;
    });
  });

  describe('should not merge the decorator argument since 2 are present', () => {

    const base = `@decorator([provider:a], "b") class a {}`, patch = `@decorator([id:b], "b") class a {}`;

    it('preserving base.', () => {
      const result = merge(base, patch, false)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "").reduce((prev, curr) => prev.toString() + curr.toString(), "");
      const patchDecoratorRegex = /.*id.*/;
      expect(patchDecoratorRegex.test(result.toString()), 'id of the base should be present').to.be.false;
    });

    it('should not merge the decorator argument since 2 are present with patchOverride.', () => {
      const result = merge(base, patch, true)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "").reduce((prev, curr) => prev.toString() + curr.toString(), "");
      const baseDecoratorRegex = /.*provider.*/;
      expect(baseDecoratorRegex.test(result.toString()), 'id of the patch should be present').to.be.false;
    });
  });
});