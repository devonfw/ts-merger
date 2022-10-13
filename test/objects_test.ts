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
  describe("with text", () => {
    const base = "let searchTerm: any = { id: Number };",
      patch = "let secondSearchTerm: String = { name: String };";

    it("should yield a valid object declaration.", () => {
      const result: String = merge(base, patch, true).replace(/\n/g, " ");
      expect(result).equal(
        " let searchTerm: any = { id: Number }; let secondSearchTerm: String = { name: String }; "
      );
    });
  });

  describe("while directly initializing it", () => {
    const base = `export const environment: { production: string } = { production: 'yes' };`,
      patch = "";

    it("should yield a valid object declaration.", () => {
      const result: String = merge(base, patch, true).replace(/\n/g, " ").trim();
      expect(result).equal(base)
    });
  })
});
