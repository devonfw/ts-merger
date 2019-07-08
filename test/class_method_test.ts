import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('Merging class methods', () => {
  describe('should add the method from', () => {
    const base = `
    /**
     * Should format correctly this line
     * Api Documentation
     *
     * OpenAPI spec version: 1.0
     */
    class a {
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
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((res) =>
          /private\s+c\s*\(\s*b\s*:\s*any\s*\)\s*:\s*number\s*\{?/.test(
            res.toString(),
          ),
        ),
      ).length.to.be.greaterThan(0, 'declaration should be present in class a');
    });
    it('the patch with patchOverride.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((res) =>
          /private\s+c\s*\(\s*b\s*:\s*any\s*\)\s*:\s*number\s*\{?/.test(
            res.toString(),
          ),
        ),
      ).length.to.be.greaterThan(0, 'declaration should be present in class a');
    });
  });

  describe('should use the method body from', () => {
    const base = `
    /**
     * Should format correctly this line
     * Api Documentation
     *
     * OpenAPI spec version: 1.0
     */
    class a {
              private b(a:any):void{
                let c = 5;
                }
              }`,
      patch = `
      /**
       * Should format correctly this line
       * Api Documentation
       *
       * OpenAPI spec version: 2.0
       */
      class a {
                private b(a:any):void{
                    let d = 6;
                }
              }`;

    it('the base if method is present in base and patch.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((res) => /let\s+c\s*=\s*5\s*;/.test(res.toString())),
      ).length.to.be.greaterThan(0, 'b should have body from base');
    });
    it('the patch if method is present in base and patch, and patchOverride is true.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((res) => /let\s+d\s*=\s*6\s*;/.test(res.toString())),
      ).length.to.be.greaterThan(0, 'b should have body from patch');
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
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((res) =>
          /private\s+b\s*\(\s*a\s*:\s*any\s*\)\s*:\s*void\s*\{?/.test(
            res.toString(),
          ),
        ),
      ).length.to.be.greaterThan(0, 'b should have modifier from base');
    });
    it('the patch if method is present in base and patch, and patchOverride is true.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((res) =>
          /public\s+b\s*\(\s*a\s*:\s*any\s*\)\s*:\s*void\s*\{?/.test(
            res.toString(),
          ),
        ),
      ).length.to.be.greaterThan(
        0,
        'b should have modifier from patch but was ' +
          result.reduce((prev, curr) => prev.toString() + curr.toString(), ''),
      );
    });
  });

  describe('should use async await modifiers', () => {
    const base = `class a {
      public async f() {
        const dialog = await this.createDialog();
        await dialog.present();
      }
    }`,
      patch = `class a {
        public f() {
          const dialog = this.createDialog();
          dialog.present();
        }
      }`;

    it('the base if method is present in base and patch.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((res) =>
          /public\s+async\s+f\s*\(\s*\)\s*\{?/.test(res.toString()),
        ),
      ).length.to.be.greaterThan(0, 'f should have modifier from base');
      expect(
        result.filter((res) =>
          /await.+this\.createDialog\(\)?/.test(res.toString()),
        ),
      ).length.to.be.greaterThan(
        0,
        'this.createDialog() should have modifier from base',
      );
      expect(
        result.filter((res) =>
          /await\s+dialog\.present\(\)?/.test(res.toString()),
        ),
      ).length.to.be.greaterThan(
        0,
        'dialog.present() should have modifier from base',
      );
    });
    it('the patch if method is present in base and patch, and patchOverride is true.', () => {
      const result: String[] = merge(base, patch, true)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((res) =>
          /public\s+f\s*\(\s*\)\s*\{?/.test(res.toString()),
        ),
      ).length.to.be.greaterThan(
        0,
        'f should have modifier from patch but was ' +
          result.reduce((prev, curr) => prev.toString() + curr.toString(), ''),
      );
      expect(
        result.filter((res) =>
          /^(\s*)dialog\.present\(\)?/.test(res.toString()),
        ),
      ).length.to.be.greaterThan(
        0,
        'dialog.present() should have modifier from patch but was ' +
          result.reduce((prev, curr) => prev.toString() + curr.toString(), ''),
      );
    });
  });

  describe('should merge destructuring arrays', () => {
    const base = `class a {
      openConfirm(): void {
        const payload: any = {
          id: this.selectedRow.id,
          searchTerms: { ...this.bla },
        };
      }
    }`,
      patch = `class a {
        openConfirm(): void {
          const payload: any = {
            searchTerms: { ...this.searchTerms },
          };
        }`;
    it('having two destructuring array values.', () => {
      const result: String[] = merge(base, patch, false)
        .split('\n')
        .map((value) => value.trim())
        .filter((value) => value != '');
      expect(
        result.filter((res) => /bla\s*:\s*...this.bla,/.test(res.toString())),
      ).length.to.be.greaterThan(0, 'f should have modifier from base');
      expect(
        result.filter((res) =>
          /searchTerms\s*:\s*...this.searchTerms/.test(res.toString()),
        ),
      ).length.to.be.greaterThan(0, 'f should have modifier from base');
    });
  });
});
