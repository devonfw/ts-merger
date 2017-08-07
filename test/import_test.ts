import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merging imports', () => {
  let testResources = './test/resources/import/';
  let baseTestResources = testResources + 'base/';
  let patchTestResources = testResources + 'patch/';
  let outputTestTempResources = testResources + 'output/';

  describe('should accumulate imports from', () => {

    describe('disjunct import sets', () => {

      const base = `import { a } from 'b';
                  import { thit as that } from 'e';`,
        patch = `import { c } from 'd';
               import { thit as thot } from 'somewhere';`;

      it('by default.', () => {
        const result: String[] = merge(base, patch, false).split('\n').filter(r => { return r.trim() != "" });
        expect(result.length, "to contain all imports").to.equal(4);
        expect(result.map(value => value == "import { a } from 'b';").reduce((previous, current) => previous || current, false), "to contain the first import from base").to.equal(true);
        expect(result.map(value => value == "import { thit as that } from 'e';").reduce((previous, current) => previous || current, false), "to contain the second import from base").to.equal(true);
        expect(result.map(value => value == "import { c } from 'd';").reduce((previous, current) => previous || current, false), "to contain the import from patch").to.equal(true);
        expect(result.map(value => value == "import { thit as thot } from 'somewhere';").reduce((previous, current) => previous || current, false), "to contain the import from patch").to.equal(true);
      });
      it('with patchOverride. (Should not make any difference).', () => {
        const result: String[] = merge(base, patch, true).split('\n').filter(r => { return r.trim() != "" });
        expect(result.length, "to contain all imports").to.equal(4);
        expect(result.map(value => value == "import { a } from 'b';").reduce((previous, current) => previous || current, false), "to contain the first import from base").to.equal(true);
        expect(result.map(value => value == "import { thit as that } from 'e';").reduce((previous, current) => previous || current, false), "to contain the second import from base").to.equal(true);
        expect(result.map(value => value == "import { c } from 'd';").reduce((previous, current) => previous || current, false), "to contain the import from patch").to.equal(true);
        expect(result.map(value => value == "import { thit as thot } from 'somewhere';").reduce((previous, current) => previous || current, false), "to contain the import from patch").to.equal(true);
      });
    });

    describe('overlapping import sets', () => {

      const base = `import { a } from 'b';
                  import { c } from 'd';`,
        patch = `import { e } from 'f';
               import { a } from 'b';`;

      it('by default.', () => {
        const result: String[] = merge(base, patch, false).split('\n').filter(r => { return r.trim() != "" });
        expect(result.length, "to contain unique imports").to.equal(3);
        expect(result.filter(value => value == "import { a } from 'b';").length).to.equal(1);
      });
      it('with patchOverride. (Should not make any difference)', () => {
        const result: String[] = merge(base, patch, true).split('\n').filter(r => { return r.trim() != "" });
        expect(result.length, "to contain unique imports").to.equal(3);
        expect(result.filter(value => value == "import { a } from 'b';").length).to.equal(1);
      });
    });

    describe('the same source in a single import statement', () => {

      const base = `import { a } from 'somewhere';`,
        patch = `import { b } from 'somewhere';`;

      it('by default.', () => {
        const result: String[] = merge(base, patch, false).split('\n').filter(r => { return r.trim() != "" });
        expect(result.length, "to contain only one import statement").to.equal(1);
        let importRegex = new RegExp(".*\{ [a,b], [a,b] \}.*");
        expect(importRegex.test(result[0].toString())).to.be.true;
      });
      it('with patchOverride. (Should not make any difference)', () => {
        const result: String[] = merge(base, patch, true).split('\n').filter(r => { return r.trim() != "" });
        expect(result.length, "to contain only one import statement").to.equal(1);
        let importRegex = new RegExp(".*\{ [a,b], [a,b] \}.*");
        expect(importRegex.test(result[0].toString()), "to contain both imported artifacts from the module").to.be.true;
      });
    });

    describe('the base if the patch is empty', () => {

      const base = `import { a } from 'b';`,
        patch = ``;

      it('by default. This is a borderline case.', () => {
        const result: String[] = merge(base, patch, false).split('\n').filter(r => { return r.trim() != "" });
        expect(result.length).to.be.equal(1);
      });
      it('and patchOverride is set. This is a borderline case.', () => {
        const result: String[] = merge(base, patch, true).split('\n').filter(r => { return r.trim() != "" });
        expect(result.length).to.be.equal(1);
      });
    });

    describe('the patch if the base is empty', () => {

      const base = ``,
        patch = `import { a } from 'b';`;

      it('by default. This is a borderline case.', () => {
        const result: String[] = merge(base, patch, false).split('\n').filter(r => { return r.trim() != "" });
        expect(result.length).to.be.equal(1);
      });
      it('and patchOverride is set. This is a borderline case.', () => {
        const result: String[] = merge(base, patch, true).split('\n').filter(r => { return r.trim() != "" });
        expect(result.length).to.be.equal(1);
      });
    });

    describe('the same source', () => {

      const base = `import a from 'b';
                  import c from 'd';`,
        patch = `import e from 'd';`;

      it('by default.', () => {
        const result: String[] = merge(base, patch, false).split('\n').filter(r => { return r.trim() != "" });
        let importRegex = /import\s*\{\s*c\s*,\s*e\s*\}\s*from\s*'d'\s*[;]?/;
        expect(result.filter(value => importRegex.test(value.toString())).length).equal(1);
      });

      it('with patchOverride is set (should not make a difference).', () => {
        const result: String[] = merge(base, patch, true).split('\n').filter(r => { return r.trim() != "" });
        let importRegex = /import\s*\{\s*c\s*,\s*e\s*\}\s*from\s*'d'\s*[;]?/;
        expect(result.filter(value => importRegex.test(value.toString())).length).equal(1);
      });

    });
  });

  describe('in case of conflicts of the import name', () => {

    const base = `import { a as b } from 'c';`,
      patch = `import { a as d } from 'c';`;

    xit('should prefer the base by default.', () => {
      /**
       * currently not supported
       */
      const result: String[] = merge(base, patch, false).split('\n').filter(r => { return r.trim() != "" });
      expect(result.length).to.be.equal(1);
      let importRegex = new RegExp('.*\{ a as b \}.*');
      expect(importRegex.test(result[0].toString())).to.be.true;
    });
    xit('should prefer the patch if patchOverride==true.', () => {
      /**
       * currently not supported
       */
      const result: String[] = merge(base, patch, true).split('\n').filter(r => { return r.trim() != "" });
      expect(result.length).to.be.equal(1);
      let importRegex = new RegExp('.*\{ a as d \}.*');
      expect(importRegex.test(result[0].toString())).to.be.true;
    });
  });

  describe('in case of conflicts of imports', () => {

    const base = `import { a as b } from 'c';`,
      patch = `import { d as b } from 'c';`;

    xit('should prefer the base by default.', () => {
      /**
       * currently not supported
       */
      const result: String[] = merge(base, patch, false).split('\n').filter(r => { return r.trim() != "" });
      expect(result.length).to.be.equal(1);
      let importRegex = new RegExp('.*\{ a as b \}.*');
      expect(importRegex.test(result[0].toString())).to.be.true;
    });
    xit('should prefer the patch if patchOverride==true.', () => {
      /**
       * currently not supported
       */
      const result: String[] = merge(base, patch, true).split('\n').filter(r => { return r.trim() != "" });
      expect(result.length).to.be.equal(1);
      let importRegex = new RegExp('.*\{ d as b \}.*');
      expect(importRegex.test(result[0].toString())).to.be.true;
    });
  });
});