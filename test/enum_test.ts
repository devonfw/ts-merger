import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('should merge enums', () => {
  const base = `export enum Direction {
                  Up = 1,
                  Down = 2,
              }`,
    patch = `enum Direction {
                  Up = 0,
                  Left = 3,
                  Right = 4,
              }`;

  it('the enum should contain all the elements and Up element should equal 1.', () => {
    const result: String[] = merge(base, patch, false)
      .split('\n')
      .map((value) => value.trim())
      .filter((value) => value != '');
    expect(
      result.filter((res) =>
        /export\s*enum\s+Direction\s*\{\s*Up\s*=\s*1,\s*Down\s*=\s*2,\s*Left\s*=\s*3,\s*Right\s*=\s*4,\s*}/.test(
          res.toString(),
        ),
      ),
    ).length.to.be.greaterThan(
      0,
      'enum not correct, does not contain all elements. Result is ' +
        result.reduce((prev, curr) => prev.toString() + curr.toString(), ''),
    );
  });
  it('when patchOverride is true, enum should contain all elements and Up element should equal 0.', () => {
    const result: String[] = merge(base, patch, true)
      .split('\n')
      .map((value) => value.trim())
      .filter((value) => value != '');
    expect(
      result.filter((res) =>
        /enum\s+Direction\s*\{\s*Up\s*=\s*0,\s*Down\s*=\s*2,\s*Left\s*=\s*3,\s*Right\s*=\s*4,\s*}/.test(
          res.toString(),
        ),
      ),
    ).length.to.be.greaterThan(
      0,
      'enum not correct, does not contain all elements. Result is ' +
        result.reduce((prev, curr) => prev.toString() + curr.toString(), ''),
    );
  });
});
