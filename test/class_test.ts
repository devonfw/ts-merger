import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merging class declarations', () => {
  describe('handling inheritance', () => {
    const base = `class a {}`,
      patch = `class a extends b {}`;

    it('should yield a valid class.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value.trim() != '');
      const assembledResult: String = result.reduce(
        (prev: String, current: String) => {
          return prev.toString() + current.toString();
        },
        '',
      );
      expect(assembledResult).equal('class a {}', 'Result is not valid');
    });
    it('should not use the patch extension.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value.trim() != '');
      expect(
        result.filter((value) => /class a \{[^]*/.test(value.toString()))
          .length,
      ).to.be.equal(1, 'extension from patch should not be applied');
    });
    it('should use the patch extension with patchOverride.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((value) => /class a extends b[^]*/.test(value.toString()))
          .length,
      ).to.be.equal(1, 'extension from patch should be applied');
    });
    it('should keep the base extension.', () => {
      const result: String[] = merge(patch, base, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((value) => /class a extends b[^]*/.test(value.toString()))
          .length,
      ).to.be.equal(1, 'extension from base should be kept');
    });
    it('should not keep the base extension with patchOverride.', () => {
      const result: String[] = merge(patch, base, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((value) => /class a \{[^]*/.test(value.toString()))
          .length,
      ).to.be.equal(1, 'extension from base should not be kept');
    });
  });

  describe('handling aliasing', () => {
    const base = `class a {}`,
      patch = `class a implements b {}`;

    it('should not use the patch implementations.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((value) => /class a \{[^]*/.test(value.toString()))
          .length,
      ).to.be.equal(1, 'implementation from patch should not be applied');
    });
    it('should use the patch implementation with patchOverride.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((value) =>
          /class a implements b[^]*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'implementation from patch should be applied');
    });
    it('should keep the base implementation.', () => {
      const result: String[] = merge(patch, base, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((value) =>
          /class a implements b[^]*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'implementation from base should be kept');
    });
    it('should not keep the base implementation with patchOverride.', () => {
      const result: String[] = merge(patch, base, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((value) => /class a \{[^]*/.test(value.toString()))
          .length,
      ).to.be.equal(1, 'implementation from base should not be kept');
    });
  });

  describe('multiple class definitions', () => {
    const base = `class a {}`,
      patch = `class b {}`;

    it('should be accumulated.', () => {
      const result: String = merge(patch, base, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '')
        .reduce((prev, curr) => prev.toString() + curr.toString(), '');
      let regex = /\s*class\s+[ab]\s*\{\}\s*class\s+[ab].*/;
      expect(regex.test(result.toString())).true;
    });
    it('should be accumulated with patchOverride (should not make a difference).', () => {
      const result: String = merge(patch, base, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '')
        .reduce((prev, curr) => prev.toString() + curr.toString(), '');
      let regex = /\s*class\s+[ab]\s*\{\}\s*class\s+[ab].*/;
      expect(regex.test(result.toString())).true;
    });
  });

  describe('should accumulate implemented interfaces', () => {
    const base = `class a implements b {}`,
      patch = `class a implements c {}`;

    xit('by default.', () => {
      /**
       * currently not supported
       */
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((value) =>
          /class a implements\s*\w\s*,\s*\w.*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'misformed class declaration');
    });
    xit('with patchOverrides.', () => {
      /**
       * currently not supported
       */
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((value) =>
          /class a implements\s*\w\s*,\s*\w.*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'misformed class declaration');
    });
  });

  describe('comments on class definitions', () => {
    const base = `/* Test this */
      // Bla test
      class a { }`,
      patch = `/* Test that */
      // Ble test
      class a {}`;

    it('should be accumulated.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n') // get each individual line
        .map((value) => value.trim()) // trim all lines (no white spaces at the beginning and end of a line)
        .filter((value) => value != ''); // remove empty lines
      expect(result.indexOf('/* Test this */')).to.be.greaterThan(
        -1,
        'first base comment should be present in interface a',
      );
      expect(result.indexOf('// Bla test')).to.be.greaterThan(
        0,
        'second base comment should be present in interface a',
      );
    });
    it('should accumulate patch comments with patchOverride.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n') // get each individual line
        .map((value) => value.trim()) // trim all lines (no white spaces at the beginning and end of a line)
        .filter((value) => value != ''); // remove empty lines
      expect(result.indexOf('/* Test that */')).to.be.greaterThan(
        -1,
        'first patch comment should be present in interface',
      );
      expect(result.indexOf('// Ble test')).to.be.greaterThan(
        0,
        'second patch comment should be present in interface',
      );
    });
  });
});
