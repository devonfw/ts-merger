import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merge imports with merge()', () => {
  let testResources = './test/resources/import/';
  let baseTestResources = testResources + 'base/';
  let patchTestResources = testResources + 'patch/';
  it('should accumulate imports from disjunct import sets (resources/import/{base|patch}/imports_1.ts)', () => {
    /**
     * fails if not all 4 import statements are present in the result
     */
    const result : String[] = merge(false, baseTestResources + 'imports_1.ts', patchTestResources + 'imports_1.ts').split('\n');
    expect(result.length, "to contain all imports").to.equal(4);
    expect(result.map(value => value == "import { a } from 'b';").reduce((previous, current) => previous || current, false), "to contain the first import from base").to.equal(true);
    expect(result.map(value => value == "import { thit as that } from 'e';").reduce((previous, current) => previous || current, false), "to contain the second import from base").to.equal(true);
    expect(result.map(value => value == "import { c } from 'd';").reduce((previous, current) => previous || current, false), "to contain the import from patch").to.equal(true); 
    expect(result.map(value => value == "import { thit as thot } from 'somewhere';").reduce((previous, current) => previous || current, false), "to contain the import from patch").to.equal(true);
  });
  it('should accumulate imports from disjunct import sets with patchOverride. Shouldn\'t make any difference. (resources/import/{base|patch}/imports_1.ts)', () => {
    /**
     * fails if not all 4 import statements are present in the result
     */
    const result : String[] = merge(true, baseTestResources + 'imports_1.ts', patchTestResources + 'imports_1.ts').split('\n');
    expect(result.length, "to contain all imports").to.equal(4);
    expect(result.map(value => value == "import { a } from 'b';").reduce((previous, current) => previous || current, false), "to contain the first import from base").to.equal(true);
    expect(result.map(value => value == "import { thit as that } from 'e';").reduce((previous, current) => previous || current, false), "to contain the second import from base").to.equal(true);
    expect(result.map(value => value == "import { c } from 'd';").reduce((previous, current) => previous || current, false), "to contain the import from patch").to.equal(true); 
    expect(result.map(value => value == "import { thit as thot } from 'somewhere';").reduce((previous, current) => previous || current, false), "to contain the import from patch").to.equal(true);
  });
  it('should acucmulate imports from overlapping import sets (resources/import/{base|patch}/imports_2.ts)', () => {
    /**
     * fails if the result contains the same import twice (one time from base, one time from patch)
     */
    const result : String[] = merge(false, baseTestResources + 'imports_2.ts', patchTestResources + 'imports_2.ts').split('\n');
    expect(result.length, "to contain unique imports").to.equal(3);
    expect(result.filter(value => value == "import { a } from 'b';").length).to.equal(1);
  });
  it('should acucmulate imports from overlapping import sets with patchOverride. Shouldn\'t make any difference. (resources/import/{base|patch}/imports_2.ts)', () => {
    /**
     * fails if the result contains the same import twice (one time from base, one time from patch)
     */
    const result : String[] = merge(true, baseTestResources + 'imports_2.ts', patchTestResources + 'imports_2.ts').split('\n');
    expect(result.length, "to contain unique imports").to.equal(3);
    expect(result.filter(value => value == "import { a } from 'b';").length).to.equal(1);
  });
  it('should accumulate imports from the same source in a single import statement (resources/import/{base|patch}/imports_3.ts)', () => {
    /**
     * fails if the import merge yields more than one import statement or doesn't contain the imported artefacts from base and patch
     */
    const result : String[] = merge(false, baseTestResources + 'imports_3.ts', patchTestResources + 'imports_3.ts').split('\n').filter(value => value != "");
    expect(result.length, "to contain only one import statement").to.equal(1);
    let importRegex = new RegExp(".*\{ [a,b], [a,b] \}.*");
    expect(importRegex.test(result[0].toString())).to.be.true;
  });
  it('should accumulate imports from the same source in a single import statement with patchOverride. Shouldn\'t make any difference.  (resources/import/{base|patch}/imports_3.ts)', () => {
    /**
     * fails if the import merge yields more than one import statement or doesn't contain the imported artefacts from base and patch
     */
    const result : String[] = merge(true, baseTestResources + 'imports_3.ts', patchTestResources + 'imports_3.ts').split('\n').filter(value => value != "");
    expect(result.length, "to contain only one import statement").to.equal(1);
    let importRegex = new RegExp(".*\{ [a,b], [a,b] \}.*");
    expect(importRegex.test(result[0].toString()), "to contain both imported artifacts from the module").to.be.true;
  });
  it('should accumulate the imports from the base if the patch is empty. This is a borderline case (resources/import/{base|patch}/imports_4.ts)', () => {
    /**
     * fails if the base import isn't present in the result.
     */
    const result : String[] = merge(false, baseTestResources + 'imports_4.ts', patchTestResources + 'imports_4.ts').split('\n').filter(value => value != "");
    expect(result.length).to.be.equal(1);
  });
  it('should accumulate the imports from the base if the patch is empty and patchOverride is set. This is a borderline case (resources/import/{base|patch}/imports_4.ts)', () => {
    /**
     * fails if the base import isn't present in the result.
     */
    const result : String[] = merge(true, baseTestResources + 'imports_4.ts', patchTestResources + 'imports_4.ts').split('\n').filter(value => value != "");
    expect(result.length).to.be.equal(1);
  });
  it('should accumulate the imports from the patch if the base is empty. This is a borderline case (resources/import/{base|patch}/imports_5.ts)', () => {
    /**
     * fails if the patch import isn't present in the result.
     */
    const result : String[] = merge(false, baseTestResources + 'imports_5.ts', patchTestResources + 'imports_5.ts').split('\n').filter(value => value != "");
    expect(result.length).to.be.equal(1);
  });
  it('should accumulate the imports from the patch if the base is empty and patchOverride is set. This is a borderline case (resources/import/{base|patch}/imports_5.ts)', () => {
    /**
     * fails if the patch import isn't present in the result.
     */
    const result : String[] = merge(true, baseTestResources + 'imports_5.ts', patchTestResources + 'imports_5.ts').split('\n').filter(value => value != "");
    expect(result.length).to.be.equal(1);
  });

  // ---- Guess work based tests ---- //
  it('Should prefer the base import name in case of conflicts if patchOverride==false. (resources/import/{base|patch}/imports_6.ts)', () => {
    /**
     * fails if the renaming of the patch is used
     */
    const result : String[] = merge(false, baseTestResources + 'imports_6.ts', patchTestResources + 'imports_6.ts').split('\n').filter(value => value != "");
    expect(result.length).to.be.equal(1);
    let importRegex = new RegExp('.*\{ a as b \}.*');
    expect(importRegex.test(result[0].toString())).to.be.true;
  });
  it('Should prefer the patch import name in case of conflicts if patchOverride==true. (resources/import/{base|patch}/imports_6.ts)', () => {
    /**
     * fails if the renaming of the base is used
     */
    const result : String[] = merge(true, baseTestResources + 'imports_6.ts', patchTestResources + 'imports_6.ts').split('\n').filter(value => value != "");
    expect(result.length).to.be.equal(1);
    let importRegex = new RegExp('.*\{ a as d \}.*');
    expect(importRegex.test(result[0].toString())).to.be.true;
  });
  it('Should prefer the base import artifact in case of conflicts if patchOverride==false. (resources/import/{base|patch}/imports_7.ts)', () => {
    /**
     * fails if the import artifact of the patch is used
     */
    const result : String[] = merge(false, baseTestResources + 'imports_7.ts', patchTestResources + 'imports_7.ts').split('\n').filter(value => value != "");
    expect(result.length).to.be.equal(1);
    let importRegex = new RegExp('.*\{ a as b \}.*');
    expect(importRegex.test(result[0].toString())).to.be.true;
  });
  it('Should prefer the patch import artifact in case of conflicts if patchOverride==true. (resources/import/{base|patch}/imports_7.ts)', () => {
    /**
     * fails if the import artifact of the base is used
     */
    const result : String[] = merge(true, baseTestResources + 'imports_7.ts', patchTestResources + 'imports_7.ts').split('\n').filter(value => value != "");
    expect(result.length).to.be.equal(1);
    let importRegex = new RegExp('.*\{ d as b \}.*');
    expect(importRegex.test(result[0].toString())).to.be.true;
  });
});