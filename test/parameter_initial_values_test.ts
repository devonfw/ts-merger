import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

describe('should use the modifier from', () => {
  const base = `
 export function reducer(
   state: SampleDataState = initialState,
   action: SampleDataAction,
 ): SampleDataState {
      return state;
 }
  `,
    patch = `  
   export function reducer(
     state: SampleDataState,
     action: SampleDataAction,
   ): SampleDataState {
        return state;
   }
    `;

  it('Should  preserve initial value of the state parameter', () => {
    const result: String[] = merge(base, patch, false)
      .split('\n')
      .map((value) => value.trim())
      .filter((value) => value != '');
    expect(result.length).equal(4);
    expect(result[0].indexOf('= initialState')).to.be.greaterThan(
      -1,
      'reducer should have parameter from base',
    );
  });
  it('Initial parameter values should be overwritten when patchOverride is true.', () => {
    const result: String[] = merge(base, patch, true)
      .split('\n')
      .map((value) => value.trim())
      .filter((value) => value != '');
    expect(result.length).equal(4);
    let test = result[0].indexOf('= initialState');

    expect(result[0].indexOf('= initialState')).to.be.equal(
      -1,
      'reducer should have parameter from patch ',
    );
  });
});
