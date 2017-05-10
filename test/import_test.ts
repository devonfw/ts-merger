import merge from '../src/index';
import { expect } from 'chai';
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
import 'mocha';


// describe('Hello function', () => {
//   it('should return hello world', () => {
//     const result = merge(false, './test/importsBase.ts', './test/importsPatch.ts');
//     expect(result).to.equal('Hello World!');
//   });
// });

let testResources = './test/resources/';
let baseTestResources = testResources + 'base/';
let patchTestResources = testResources + 'patch/';

describe('Merge imports with merge()', () => {
  it('should accumulate imports from disjunct import sets (resources/{base|patch}/imports_1.ts)', () => {
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
  it('should accumulate imports from disjunct import sets with patchOverride. Shouldn\'t make any difference. (resources/{base|patch}/imports_1.ts)', () => {
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
  it('should acucmulate imports from overlapping import sets (resources/{base|patch}/imports_2.ts)', () => {
    /**
     * fails if the result contains the same import twice (one time from base, one time from patch)
     */
    const result : String[] = merge(false, baseTestResources + 'imports_2.ts', patchTestResources + 'imports_2.ts').split('\n');
    expect(result.length, "to contain unique imports").to.equal(3);
    expect(result.filter(value => value == "import { a } from 'b';").map(val => 1).reduce((a, b) => a + b, 0)).to.equal(1);
  });
  it('should acucmulate imports from overlapping import sets with patchOverride. Shouldn\'t make any difference. (resources/{base|patch}/imports_2.ts)', () => {
    /**
     * fails if the result contains the same import twice (one time from base, one time from patch)
     */
    const result : String[] = merge(true, baseTestResources + 'imports_2.ts', patchTestResources + 'imports_2.ts').split('\n');
    expect(result.length, "to contain unique imports").to.equal(3);
    expect(result.filter(value => value == "import { a } from 'b';").map(val => 1).reduce((a, b) => a + b, 0)).to.equal(1);
  });
  it('should accumulate imports from the same source in a single import statement (resources/{base|patch}/imports_3.ts)', () => {
    const result : String[] = merge(false, baseTestResources + 'imports_3.ts', patchTestResources + 'imports_3.ts').split('\n');
    expect(result.length, "to contain only one import statement").to.equal(1);

  });

});