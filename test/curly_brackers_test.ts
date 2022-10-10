import merge from "../src/index";
import { expect } from "chai";
import "mocha";

describe("merging property without initialization its value", () => {
  const base = `
  import Observable from 'rxjs/observable';

  class test {
    getSampleData(
    size: number,
    page: number,
  ): Observable<{ content: SampledataModel[] }> {
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
  }}
  `,
        patch = "";

  it("Test", () => {
    const result: String = merge(base, patch, true).replace(/\n/g, " ");
    expect(result).equal(
      "import Observable from 'rxjs/observable';   class test { getSampleData(size: number, page: number): Observable<{ content: SampledataModel[] }> {  const searchCriteria: SearchCriteria = { pageable: { pageSize: size, pageNumber: page }, name:  searchTerms.name, surname:  searchTerms.surname };      return this.http.post<{ content: SampledataModel[] }>(       this.urlService + 'search',       searchCriteria,     ); }   } "
    );
  });
});

describe("merging without curly brackets {}", () => {
  const base = `
  import Observable from 'rxjs/observable';

  class test {
    getSampleData(
    size: number,
    page: number,
  ): Observable<SampledataModel[]> {
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
  }}
  `,
        patch = "";

  it("Test", () => {
    const result: String = merge(base, patch, true).replace(/\n/g, " ");
    expect(result).equal(
      "import Observable from 'rxjs/observable';   class test { getSampleData(size: number, page: number): Observable<SampledataModel[]> {  const searchCriteria: SearchCriteria = { pageable: { pageSize: size, pageNumber: page }, name:  searchTerms.name, surname:  searchTerms.surname };      return this.http.post<{ content: SampledataModel[] }>(       this.urlService + 'search',       searchCriteria,     ); }   } "
    );
  });
});


describe("Declaration curly brackets {} with type inizialisation", () => {
  const base = `
  const searchCriteria: any = {
    name: 'test',
    surname: 'test',
  };
  `,
        patch = "";

  it("Test", () => {
    const result: String = merge(base, patch, true).replace(/\n/g, " ");
    expect(result).equal(
      " const searchCriteria: any = { name: 'test', surname: 'test' }; "
    );
  });
});

// if we declare a property without assigning it to a specific type (e.g. number ,any ...) 
//its value will not be read and thus not merged, because the compiler tries to use the value 
//before it is assigned a specific value.

describe("Declaration curly brackets {} without type inizialisation", () => {
  const base = `
const searchCriteria: {
    name: 'test',
    surname: 'test',
  };
  `,
        patch = "";

  it("Test", () => {
    const result: String = merge(base, patch, true).replace(/\n/g, " ");
    expect(result).equal(
      " const searchCriteria: { name: 'test', surname: 'test' }; "
    );
  });
});
