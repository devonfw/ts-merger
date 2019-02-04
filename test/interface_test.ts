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
      expect(assembledResult).equal('interface a {}', 'Result is not valid');
    });
    it('should not use the patch extension.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value.trim() != '');
      expect(
        result.filter((value) => /interface a \{[^]*/.test(value.toString()))
          .length,
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
          /interface a extends b[^]*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'extension from base should be kept');
    });
    it('should not keep the base extension with patchOverride.', () => {
      const result: String[] = merge(patch, base, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((value) => /interface a \{[^]*/.test(value.toString()))
          .length,
      ).to.be.equal(1, 'extension from base should not be kept');
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
    it('should be accumulated with patchOverride (should not make a difference).', () => {
      const result: String = merge(patch, base, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '')
        .reduce((prev, curr) => prev.toString() + curr.toString(), '');
      let regex = /\s*interface\s+[ab]\s*\{\}\s*interface\s+[ab].*/;
      expect(regex.test(result.toString())).true;
    });
  });

  describe('should accumulate implemented interfaces', () => {
    const base = `interface a implements b {}`,
      patch = `interface a implements c {}`;

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
          /interface a implements\s*\w\s*,\s*\w.*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'misformed interface declaration');
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
          /interface a implements\s*\w\s*,\s*\w.*/.test(value.toString()),
        ).length,
      ).to.be.equal(1, 'misformed interface declaration');
    });
  });
});
