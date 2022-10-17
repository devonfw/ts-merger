import merge from '../src/index';
import { expect } from 'chai';
import 'mocha';

function splitLines(s: string): String[] {
  return s.split('\n').filter(r => r.trim() != '')
}

function compareIgnoreSpace(s1: String, s2: String): boolean {
  return s1.replace(' ', '') === s2.replace(' ', '')
}

describe('Merging inline interface type declarations with empty string', () => {
  describe('Inline interface for variable', () => {
    const base = 'let x: { y: SomeType, z: AnotherType };'
    const patch = ''
    it('Shouldn\'t change.', () => {
      const result = splitLines(merge(base, patch, false))
      const baseLines = splitLines(base)
      expect(result.length).equal(baseLines.length)
      for (let i in result) {
        expect(compareIgnoreSpace(result[i], baseLines[i]))
      }
    })
  })
  describe('Inline interface for Parameter of Object type', () => {
    const base = 'const k: ObjectClass<{ y: SomeType, z: AnotherType }> = new ObjectClass();'
    const patch = ''
    it('Shouldn\'t change.', () => {
      const result = splitLines(merge(base, patch, false))
      const baseLines = splitLines(base)
      expect(result.length).equal(baseLines.length)
      for (let i in result) {
        expect(compareIgnoreSpace(result[i], baseLines[i]))
      }
    })
  })
  describe('Example from Issue', () => {
    const base = `function getSampleData(size: number, page: number): Observable<{ content: SampledataModel[] }> 
    {
      const searchCriteria: SearchCriteria = {
        pageable: {
          pageSize: size,
          pageNumber: page,
        },
        name: searchTerms.name,
        surname: searchTerms.surname,
      };
      return this.http.post<{ content: SampledataModel[] }>(
        this.urlService + 'search',
        searchCriteria,
      );
    }`
    const patch = ''
    it('Shouldn\'t change.', () => {
      const result: String[] = splitLines(merge(base, patch, false))
      const baseLines: String[] = splitLines(base)
      expect(result.length).equal(baseLines.length)
      for (let i in result) {
        expect(result[i] == baseLines[i])
      }
    })
  })

})