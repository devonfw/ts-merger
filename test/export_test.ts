import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merging exports', () => {
  describe('should accumulate exports from', () => {
    describe('disjunct export sets', () => {
      const base = `export { a } from 'b';
                  export { thit as that } from 'e';`,
        patch = `export { c } from 'd';
               export { thit as thot } from 'somewhere';`;

      it('by default.', () => {
        const result: String[] = merge(base, patch, false)
          .split('\n')
          .filter((r) => {
            return r.trim() != '';
          });
        expect(result.length, 'to contain all exports').to.equal(4);
        expect(
          result
            .map((value) => value == "export { a } from 'b';")
            .reduce((previous, current) => previous || current, false),
          'to contain the first export from base',
        ).to.equal(true);
        expect(
          result
            .map((value) => value == "export { thit as that } from 'e';")
            .reduce((previous, current) => previous || current, false),
          'to contain the second export from base',
        ).to.equal(true);
        expect(
          result
            .map((value) => value == "export { c } from 'd';")
            .reduce((previous, current) => previous || current, false),
          'to contain the export from patch',
        ).to.equal(true);
        expect(
          result
            .map(
              (value) => value == "export { thit as thot } from 'somewhere';",
            )
            .reduce((previous, current) => previous || current, false),
          'to contain the export from patch',
        ).to.equal(true);
      });
      it('with patchOverride. (Should not make any difference).', () => {
        const result: String[] = merge(base, patch, true)
          .split('\n')
          .filter((r) => {
            return r.trim() != '';
          });
        expect(result.length, 'to contain all exports').to.equal(4);
        expect(
          result
            .map((value) => value == "export { a } from 'b';")
            .reduce((previous, current) => previous || current, false),
          'to contain the first export from base',
        ).to.equal(true);
        expect(
          result
            .map((value) => value == "export { thit as that } from 'e';")
            .reduce((previous, current) => previous || current, false),
          'to contain the second export from base',
        ).to.equal(true);
        expect(
          result
            .map((value) => value == "export { c } from 'd';")
            .reduce((previous, current) => previous || current, false),
          'to contain the export from patch',
        ).to.equal(true);
        expect(
          result
            .map(
              (value) => value == "export { thit as thot } from 'somewhere';",
            )
            .reduce((previous, current) => previous || current, false),
          'to contain the export from patch',
        ).to.equal(true);
      });
    });

    describe('overlapping export sets', () => {
      const base = `export { a } from 'b';
                  export { c } from 'd';`,
        patch = `export { e } from 'f';
               export { a } from 'b';`;

      it('by default.', () => {
        const result: String[] = merge(base, patch, false)
          .split('\n')
          .filter((r) => {
            return r.trim() != '';
          });
        expect(result.length, 'to contain unique exports').to.equal(3);
        expect(
          result.filter((value) => value == "export { a } from 'b';").length,
        ).to.equal(1);
      });
      it('with patchOverride. (Should not make any difference)', () => {
        const result: String[] = merge(base, patch, true)
          .split('\n')
          .filter((r) => {
            return r.trim() != '';
          });
        expect(result.length, 'to contain unique exports').to.equal(3);
        expect(
          result.filter((value) => value == "export { a } from 'b';").length,
        ).to.equal(1);
      });
    });

    describe('the same source in a single export statement', () => {
      const base = `export { a } from 'somewhere';`,
        patch = `export { b } from 'somewhere';`;

      it('by default.', () => {
        const result: String[] = merge(base, patch, false)
          .split('\n')
          .filter((r) => {
            return r.trim() != '';
          });
        expect(result.length, 'to contain only one export statement').to.equal(
          1,
        );
        let exportRegex = new RegExp('.*{ [a,b], [a,b] }.*');
        expect(exportRegex.test(result[0].toString())).to.be.true;
      });
      it('with patchOverride. (Should not make any difference)', () => {
        const result: String[] = merge(base, patch, true)
          .split('\n')
          .filter((r) => {
            return r.trim() != '';
          });
        expect(result.length, 'to contain only one export statement').to.equal(
          1,
        );
        let exportRegex = new RegExp('.*{ [a,b], [a,b] }.*');
        expect(
          exportRegex.test(result[0].toString()),
          'to contain both exported artifacts from the module',
        ).to.be.true;
      });
    });

    describe('the base if the patch is empty', () => {
      const base = `export { a } from 'b';`,
        patch = ``;

      it('by default. This is a borderline case.', () => {
        const result: String[] = merge(base, patch, false)
          .split('\n')
          .filter((r) => {
            return r.trim() != '';
          });
        expect(result.length).to.be.equal(1);
      });
      it('and patchOverride is set. This is a borderline case.', () => {
        const result: String[] = merge(base, patch, true)
          .split('\n')
          .filter((r) => {
            return r.trim() != '';
          });
        expect(result.length).to.be.equal(1);
      });
    });

    describe('the patch if the base is empty', () => {
      const base = ``,
        patch = `export { a } from 'b';`;

      it('by default. This is a borderline case.', () => {
        const result: String[] = merge(base, patch, false)
          .split('\n')
          .filter((r) => {
            return r.trim() != '';
          });
        expect(result.length).to.be.equal(1);
      });
      it('and patchOverride is set. This is a borderline case.', () => {
        const result: String[] = merge(base, patch, true)
          .split('\n')
          .filter((r) => {
            return r.trim() != '';
          });
        expect(result.length).to.be.equal(1);
      });
    });

    describe('the same source', () => {
      const base = `export a from 'b';
                  export c from 'd';`,
        patch = `export e from 'd';`;

      xit('by default.', () => {
        /**
         * currently not supported
         */
        const result: String[] = merge(base, patch, false)
          .split('\n')
          .filter((r) => {
            return r.trim() != '';
          });
        let exportRegex = /export\s*\{\s*c\s*,\s*e\s*\}\s*from\s*'d'\s*[;]?/;
        expect(
          result.filter((value) => exportRegex.test(value.toString())).length,
        ).equal(1);
      });

      xit('when patchOverride is set (should not make a difference).', () => {
        /**
         * currently not supported
         */
        const result: String[] = merge(base, patch, true)
          .split('\n')
          .filter((r) => {
            return r.trim() != '';
          });
        let exportRegex = /export\s*\{\s*c\s*,\s*e\s*\}\s*from\s*'d'\s*[;]?/;
        expect(
          result.filter((value) => exportRegex.test(value.toString())).length,
        ).equal(1);
      });
    });
  });

  describe('Should merge exports with *', () => {
    const base = `export * from 'b';`,
      patch = `export * from 'b';
      export * from 'd';`;

    it('by default.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .filter((r) => {
          return r.trim() != '';
        });
      let exportRegex = /export\s*\*\s*from\s*'b'\s*[;]?/;
      expect(
        result.filter((value) => exportRegex.test(value.toString())).length,
      ).equal(1);
      exportRegex = /export\s*\*\s*from\s*'d'\s*[;]?/;
      expect(
        result.filter((value) => exportRegex.test(value.toString())).length,
      ).equal(1);
    });

    it('when patchOverride is set (should not make a difference).', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .filter((r) => {
          return r.trim() != '';
        });
      let exportRegex = /export\s*\*\s*from\s*'b'\s*[;]?/;
      expect(
        result.filter((value) => exportRegex.test(value.toString())).length,
      ).equal(1);
      exportRegex = /export\s*\*\s*from\s*'d'\s*[;]?/;
      expect(
        result.filter((value) => exportRegex.test(value.toString())).length,
      ).equal(1);
    });
  });

  describe('Should not mix imports and exports', () => {
    const base = `import { O } from 'OS';
    import { N } from 'NS';
    export 'OC';
    export const APIS = [ O, N ];`,
      patch = `import { G } from 'GS';
      export a, b from 'bla'
      export const APIS = [G];`;

    xit('by default.', () => {
      /**
       * currently not supported
       */
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .filter((r) => {
          return r.trim() != '';
        });
      let exportRegex = /export\s*{\s*\w,\s*\w\s*}\s*from\s*'bla';/;
      expect(
        result.filter((value) => exportRegex.test(value.toString())).length,
      ).equal(1);
    });

    xit('when patchOverride is set (should not make a difference).', () => {
      /**
       * currently not supported
       */
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .filter((r) => {
          return r.trim() != '';
        });
      let exportRegex = /export\s*{\s*\w,\s*\w\s*}\s*from\s*'bla';/;
      expect(
        result.filter((value) => exportRegex.test(value.toString())).length,
      ).equal(1);
    });
  });

  describe('in case of conflicts of the export name', () => {
    const base = `export { a as b } from 'c';`,
      patch = `export { a as d } from 'c';`;

    xit('should prefer the base by default.', () => {
      /**
       * currently not supported
       */
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .filter((r) => {
          return r.trim() != '';
        });
      expect(result.length).to.be.equal(1);
      let exportRegex = new RegExp('.*{ a as b }.*');
      expect(exportRegex.test(result[0].toString())).to.be.true;
    });
    xit('should prefer the patch if patchOverride==true.', () => {
      /**
       * currently not supported
       */
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .filter((r) => {
          return r.trim() != '';
        });
      expect(result.length).to.be.equal(1);
      let exportRegex = new RegExp('.*{ a as d }.*');
      expect(exportRegex.test(result[0].toString())).to.be.true;
    });
  });

  describe('in case of conflicts of exports', () => {
    const base = `export { a as b } from 'c';`,
      patch = `export { d as b } from 'c';`;

    xit('should prefer the base by default.', () => {
      /**
       * currently not supported
       */
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .filter((r) => {
          return r.trim() != '';
        });
      expect(result.length).to.be.equal(1);
      let exportRegex = new RegExp('.*{ a as b }.*');
      expect(exportRegex.test(result[0].toString())).to.be.true;
    });
    xit('should prefer the patch if patchOverride==true.', () => {
      /**
       * currently not supported
       */
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .filter((r) => {
          return r.trim() != '';
        });
      expect(result.length).to.be.equal(1);
      let exportRegex = new RegExp('.*{ d as b }.*');
      expect(exportRegex.test(result[0].toString())).to.be.true;
    });
  });
});
