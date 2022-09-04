import merge from "../src/index";
import { expect } from "chai";
import "mocha";

describe("Declaring an object", () => {
  describe("with brackets", () => {
    const base = "let searchTerm: {} = { id: Number };",
      patch = "let secondSearchTerm: {} = { name: String };";

    it("should yield a valid object declaration.", () => {
      const result: String = merge(base, patch, true).replace(/\n/g, " ");
      expect(result).equal(
        " let searchTerm: {} = { id: Number }; let secondSearchTerm: {} = { name: String }; "
      );
    });
  });
});
