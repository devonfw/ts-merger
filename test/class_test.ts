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
      expect(assembledResult).equal(
        'class a extends b {}',
        'Result is not valid',
      );
    });
    it('should use the patch extension.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value.trim() != '');
      expect(
        result.filter((value) =>
          /class\s*a\s*extends\s*b[^]*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'extension from patch should not be applied');
    });
    it('should use the patch extension with patchOverride.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((value) =>
          /class\s*a\s*extends\s*b[^]*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'extension from patch should be applied');
    });
  });

  describe('handling aliasing', () => {
    const base = `class a {}`,
      patch = `class a implements b {}`;

    it('should use the patch implementations.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((value) =>
          /class\s*a\s*implements\s*b[^]*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'implementation from patch should not be applied');
    });
    it('should use the patch implementation with patchOverride.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((value) =>
          /class\s*a\s*implements\s*b[^]*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'implementation from patch should be applied');
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
      patch = `class a implements b,c {}`;

    it('by default should be accumulated.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n') // get each individual line
        .map((value) => value.trim()) // trim all lines (no white spaces at the beginning and end of a line)
        .filter((value) => value != ''); // remove empty lines
      expect(
        result.filter((value) =>
          /class\s*a\s*implements\s*\w\s*,\s*\w.*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'misformed class declaration');
    });
    it('should be accumulated with patchOverride (should not make a difference).', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n') // get each individual line
        .map((value) => value.trim()) // trim all lines (no white spaces at the beginning and end of a line)
        .filter((value) => value != ''); // remove empty lines
      expect(
        result.filter((value) =>
          /class\s*a\s*implements\s*\w\s*,\s*\w.*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'misformed class declaration');
    });
  });

  describe('should accumulate extended interfaces', () => {
    const base = `class a extends b {}`,
      patch = `class a extends b,c {}`;

    it('by default should be accumulated.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n') // get each individual line
        .map((value) => value.trim()) // trim all lines (no white spaces at the beginning and end of a line)
        .filter((value) => value != ''); // remove empty lines
      expect(
        result.filter((value) =>
          /class\s*a\s*extends\s*\w\s*,\s*\w.*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'misformed class declaration');
    });
    it('should be accumulated with patchOverride (should not make a difference).', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n') // get each individual line
        .map((value) => value.trim()) // trim all lines (no white spaces at the beginning and end of a line)
        .filter((value) => value != ''); // remove empty lines
      expect(
        result.filter((value) =>
          /class\s*a\s*extends\s*\w\s*,\s*\w.*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'misformed class declaration');
    });
  });

});
