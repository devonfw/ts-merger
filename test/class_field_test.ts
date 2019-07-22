import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merging class fields', () => {
  describe('should add the field from', () => {
    const base = `class a { private b; }`,
      patch = `class a { private c; }`;

    it('from the patch.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n') // get each individual line
        .map((value) => value.trim()) // trim all lines (no white spaces at the beginning and end of a line)
        .filter((value) => value != ''); // remove empty lines
      expect(result.indexOf('private c;')).to.be.greaterThan(
        0,
        'declaration should be present in class a',
      );
    });
    it('from the patch with patchOverride.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(result.indexOf('private c;')).to.be.greaterThan(
        0,
        'declaration should be present in class a',
      );
    });
  });

  describe('should use the value from', () => {
    const base = `class a { private b = 1; }`,
      patch = `class a { private b = 2; }`;

    it('the base if variable is present in base and patch.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((res) => /private\s+b\s*=\s*1;/.test(res.toString())),
      ).length.is.greaterThan(0);
      //expect(result.indexOf('private b = 1;')).to.be.greaterThan(0, 'b should have value from base');
    });
    it('the patch if variable is present in base and patch, and patchOverride is true.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((res) => /private\s+b\s*=\s*2;/.test(res.toString())),
      ).length.is.greaterThan(0, 'b should have value from patch');
    });
  });

  describe('should use the modifier from', () => {
    const base = `class a { private b; }`,
      patch = `class a { public b; }`;

    it('the base if variable is present in base and patch.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(result.indexOf('private b;')).to.be.greaterThan(
        0,
        'b should have modifier from base',
      );
    });
    it('the patch if variable is present in base and patch, and patchOverride is true.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(result.indexOf('public b;')).to.be.greaterThan(
        0,
        'b should have modifier from patch',
      );
    });
  });

  describe('should add the optional token', () => {
    const base = `class a { b?: string; }`,
      patch = `class a { b: string; }`;

    it('from the base.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n') // get each individual line
        .map((value) => value.trim()) // trim all lines (no white spaces at the beginning and end of a line)
        .filter((value) => value != ''); // remove empty lines
      expect(result.indexOf('b?: string;')).to.be.greaterThan(
        0,
        'optional token should be present in class a',
      );
    });
    it('from the patch with patchOverride.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(result.indexOf('b: string;')).to.be.greaterThan(
        0,
        'optional token should not be present in class a',
      );
    });
  });
});
