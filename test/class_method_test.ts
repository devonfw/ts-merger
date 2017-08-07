import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merging class methods', () => {

  describe('should add the method from', () => {

    const base = `class a {
                      private b(b:any):void{
                          // Do Something
                      }
                  }`,
      patch = `class a {
                  private c(b:any):number{
                      return 1;
                  }
              }`;

    it('the patch.', () => {
      const result: String[] = merge(base, patch, false)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "");
      expect(result.filter(res => /private\s+c\s*\(\s*b\s*:\s*any\s*\)\s*:\s*number\s*\{?/.test(res.toString()))).length.to.be.greaterThan(0, 'declaration should be present in class a');
    });
    it('the patch with patchOverride.', () => {
      const result: String[] = merge(base, patch, true)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "");
      expect(result.filter(res => /private\s+c\s*\(\s*b\s*:\s*any\s*\)\s*:\s*number\s*\{?/.test(res.toString()))).length
        .to.be.greaterThan(0, 'declaration should be present in class a');
    });
  });

  describe('should use the method body from', () => {

    const base = `class a {
                      private b(a:any):void{
                          let c = 5;
                      }
                  }`,
      patch = `class a {
                  private b(a:any):void{
                      let d = 6;
                  }
              }`;

    it('the base if method is present in base and patch.', () => {
      const result: String[] = merge(base, patch, false)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "");
      expect(result.filter(res => /let\s+c\s*=\s*5\s*;/.test(res.toString()))).length.to.be.greaterThan(0, 'b should have body from base');
    });
    it('the patch if method is present in base and patch, and patchOverride is true.', () => {
      const result: String[] = merge(base, patch, true)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "");
      expect(result.filter(res => /let\s+d\s*=\s*6\s*;/.test(res.toString()))).length.to.be.greaterThan(0, 'b should have body from patch');
    });
  });

  describe('should use the modifier from', () => {

    const base = `class a {
                      private b(a:any):void{
                          //to something
                      }
                  }`,
      patch = `class a {
                    public b(a:any):void{
                        //to something
                    }
                }`;

    it('the base if method is present in base and patch.', () => {
      const result: String[] = merge(base, patch, false)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "");
      expect(result.filter(res => /private\s+b\s*\(\s*a\s*:\s*any\s*\)\s*:\s*void\s*\{?/.test(res.toString()))).length.to.be.greaterThan(0, 'b should have modifier from base');
    });
    it('the patch if method is present in base and patch, and patchOverride is true.', () => {
      const result: String[] = merge(base, patch, true)
        .split("\n")
        .map(value => value.trim())
        .filter(value => value != "");
      expect(result.filter(res => /public\s+b\s*\(\s*a\s*:\s*any\s*\)\s*:\s*void\s*\{?/.test(res.toString()))).length.to.be.greaterThan(0, 'b should have modifier from patch but was ' + result.reduce((prev, curr) => prev.toString() + curr.toString(), ""));
    });
  });

});