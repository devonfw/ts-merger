import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merging interface fields', () => {
  describe('should add the field from', () => {
    const base = `interface a { private b; }`,
      patch = `interface a { private c; }`;

    it('from the patch.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n') // get each individual line
        .map((value) => value.trim()) // trim all lines (no white spaces at the beginning and end of a line)
        .filter((value) => value != ''); // remove empty lines
      expect(result.indexOf('private c;')).to.be.greaterThan(
        0,
        'declaration should be present in interface a',
      );
    });
    it('from the patch with patchOverride.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(result.indexOf('private c;')).to.be.greaterThan(
        0,
        'declaration should be present in interface a',
      );
    });
  });

  describe('should use the modifier from', () => {
    const base = `interface a { private b; }`,
      patch = `interface a { public b; }`;

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

  describe('should use the type from', () => {
    const base = `interface a { private b: string; }`,
      patch = `interface a { private b: number; }`;

    it('the base if variable is present in base and patch.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(result.indexOf('private b: string;')).to.be.greaterThan(
        0,
        'b should have modifier from base',
      );
    });
    it('the patch if variable is present in base and patch, and patchOverride is true.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(result.indexOf('private b: number;')).to.be.greaterThan(
        0,
        'b should have modifier from patch',
      );
    });
  });

  describe('should add the index signature from', () => {
    const base = `interface a { [key: string]: any; }`,
      patch = `interface a { [key: string]: string; }`;

    it('from the patch.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n') // get each individual line
        .map((value) => value.trim()) // trim all lines (no white spaces at the beginning and end of a line)
        .filter((value) => value != ''); // remove empty lines
      expect(result.indexOf('[key: string]: any;')).to.be.greaterThan(
        0,
        'base index should be present in interface a',
      );
    });
    it('from the patch with patchOverride.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(result.indexOf('[key: string]: string;')).to.be.greaterThan(
        0,
        'declaration should be present in interface a',
      );
    });
  });
});
