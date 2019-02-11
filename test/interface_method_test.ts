import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merging interface methods', () => {
  describe('should add the method from', () => {
    const base = `interface a {
                      b(b:any):void;
                  }`,
      patch = `interface a {
                  c(b:any):number;
              }`;

    it('the patch.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((res) =>
          /\s*c\s*\(\s*b\s*:\s*any\s*\)\s*:\s*number\s*;/.test(res.toString()),
        ),
      ).length.to.be.greaterThan(
        0,
        'declaration should be present in interface a',
      );
    });
    it('the patch with patchOverride.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((res) =>
          /\s*c\s*\(\s*b\s*:\s*any\s*\)\s*:\s*number\s*;/.test(res.toString()),
        ),
      ).length.to.be.greaterThan(
        0,
        'declaration should be present in interface a',
      );
    });
  });

  describe('should add the method parameters from', () => {
    const base = `interface a {
                      b(c:any):void;
                  }`,
      patch = `interface a {
                  b(b:any):number;
              }`;

    it('the patch.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((res) =>
          /\s*b\s*\(\s*c\s*:\s*any\s*,\s*b\s*:\s*any\s*\)\s*:\s*void\s*;/.test(
            res.toString(),
          ),
        ),
      ).length.to.be.greaterThan(
        0,
        'both method parameters should be present, and should use base method type',
      );
    });
    it('the patch with patchOverride.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((res) =>
          /\s*b\s*\(\s*c\s*:\s*any\s*,\s*b\s*:\s*any\s*\)\s*:\s*number\s*;/.test(
            res.toString(),
          ),
        ),
      ).length.to.be.greaterThan(
        0,
        'both method parameters should be present, and should use patch method type',
      );
    });
  });

  describe('should not change the method from', () => {
    const base = `interface a {
                      b(c:any):void;
                  }`,
      patch = `interface a {
                  b(c:any):number;
              }`;

    it('the base.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((res) =>
          /\s*b\s*\(\s*c\s*:\s*any\s*\)\s*:\s*void\s*;/.test(res.toString()),
        ),
      ).length.to.be.greaterThan(0, 'base method should not change');
    });
    it('the patch with patchOverride.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((res) =>
          /\s*b\s*\(\s*c\s*:\s*any\s*\)\s*:\s*number\s*;/.test(res.toString()),
        ),
      ).length.to.be.greaterThan(
        0,
        'only the base method type should be changed, using patch type',
      );
    });
  });
});
