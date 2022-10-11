import merge from "../src/index";
import { expect } from "chai";
import "mocha";

describe("Merging a property without initializing its value", () => {
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

  it("does not yield a proper observable type.", () => {
    const result: String = merge(base, patch, true).replace(/\n/g, " ");
    expect(result).equal(
      "import Observable from 'rxjs/observable';   class test { getSampleData(size: number, page: number): Observable<{}> {  const searchCriteria: SearchCriteria = { pageable: { pageSize: size, pageNumber: page }, name:  searchTerms.name, surname:  searchTerms.surname };      return this.http.post<{ content: SampledataModel[] }>(       this.urlService + 'search',       searchCriteria,     ); }   } "
    );
  });
});

describe("Merging it with proper syntax", () => {
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

  it("yields a proper observable type", () => {
    const result: String = merge(base, patch, true).replace(/\n/g, " ");
    expect(result).equal(
      "import Observable from 'rxjs/observable';   class test { getSampleData(size: number, page: number): Observable<SampledataModel[]> {  const searchCriteria: SearchCriteria = { pageable: { pageSize: size, pageNumber: page }, name:  searchTerms.name, surname:  searchTerms.surname };      return this.http.post<{ content: SampledataModel[] }>(       this.urlService + 'search',       searchCriteria,     ); }   } "
    );
  });
});


describe("Declaring a variable with proper syntax", () => {
  const base = `
  const searchCriteria: any = {
    name: 'test',
    surname: 'test',
  };
  `,
        patch = "";

  it("yields a proper merged declaration", () => {
    const result: String = merge(base, patch, true).replace(/\n/g, " ");
    expect(result).equal(
      " const searchCriteria: any = { name: 'test', surname: 'test' }; "
    );
  });
});

// if we declare a property without assigning it to a specific type (e.g. number ,any ...) 
//its value will not be read and thus not merged, because the compiler tries to use the value 
//before it is assigned a specific value.

describe("Declaring a variable without proper syntax", () => {
  const base = `
const searchCriteria: {
    name: 'test',
    surname: 'test',
  };
  `,
   patch = "";


  it("does not yield a valid declaration", () => {
    const result: String = merge(base, patch, true).replace(/\n/g, " ");
    expect(result).equal(
      " const searchCriteria: {}; "
    );
  });
});
