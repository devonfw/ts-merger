import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merging interface declarations', () => {
  describe('handling inheritance', () => {
    const base = `interface a {}`,
      patch = `interface a extends b {}`;

    it('should yield a valid interface.', () => {
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
        'interface a extends b {}',
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
          /interface\s*a\s*extends\s*\w\s*/.test(value.toString()),
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
          /interface a extends b[^]*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'extension from patch should be applied');
    });
    it('should keep the base extension.', () => {
      const result: String[] = merge(patch, base, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((value) =>
          /interface\s*a\s*extends\s*\w\s*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'extension from base should be kept');
    });
  });

  describe('multiple interface definitions', () => {
    const base = `interface a {}`,
      patch = `interface b {}`;

    it('should be accumulated.', () => {
      const result: String = merge(patch, base, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '')
        .reduce((prev, curr) => prev.toString() + curr.toString(), '');
      let regex = /\s*interface\s+[ab]\s*\{\}\s*interface\s+[ab].*/;
      expect(regex.test(result.toString())).true;
    });
    it('should be accumulated with patchOverride (should not make any difference).', () => {
      const result: String = merge(patch, base, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '')
        .reduce((prev, curr) => prev.toString() + curr.toString(), '');
      let regex = /\s*interface\s+[ab]\s*\{\}\s*interface\s+[ab].*/;
      expect(regex.test(result.toString())).true;
    });
  });

  describe('should accumulate extended interfaces', () => {
    const base = `interface a extends b {}`,
      patch = `interface a extends b,c {}`;

    it('by default should be accumulated.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n') // get each individual line
        .map((value) => value.trim()) // trim all lines (no white spaces at the beginning and end of a line)
        .filter((value) => value != ''); // remove empty lines
      expect(
        result.filter((value) =>
          /interface\s*a\s*extends\s*\w\s*,\s*\w.*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'misformed class declaration');
    });
    it('should be accumulated with patchOverride (should not make any difference).', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n') // get each individual line
        .map((value) => value.trim()) // trim all lines (no white spaces at the beginning and end of a line)
        .filter((value) => value != ''); // remove empty lines
      expect(
        result.filter((value) =>
          /interface\s*a\s*extends\s*\w\s*,\s*\w.*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'misformed class declaration');
    });
  });
});
