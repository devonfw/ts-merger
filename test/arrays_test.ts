import merge from "../src/index";
import { expect } from "chai";
import "mocha";

describe("Declaring an object", () => {
  describe("simple mergers", () => {
    let  base = "let pageSizes: number[] = [8, 16, 24];",
      patch = "";

    it("should yield a valid object declaration.", () => {
      let result: String = merge( base, patch, true).replace(/\n/g, "");
     
      expect(result).equal(
        "let pageSizes: number[] = [8, 16, 24];"
      );

    });
  });

  describe("successive mergers", () => {
    let  base = "let pageSizes: number[] = [8, 16, 24];",
      patch = "";

    it("should yield a valid object declaration.", () => {
      let result: String = merge( merge(base, patch, true), patch, true).replace(/\n/g, "");
     
      expect(result).equal(
        "let pageSizes: number[] = [8, 16, 24];"
      );

    });
  });
});