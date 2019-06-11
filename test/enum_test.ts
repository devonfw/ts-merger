import merge from "../src/index";
import { expect } from "chai";
import "mocha";

describe("should merge enums", () => {
  const base = `enum Direction {
                  Up = 1,
                  Down = 2,
              }`,
    patch = `enum Direction {
                  Up = 0,
                  Left = 3,
                  Right = 4,
              }`;

  it("the enum should contain all the elements and Up element should equal 1.", () => {
    const result: String[] = merge(base, patch, false)
      .split("\n")
      .map(value => value.trim())
      .filter(value => value != "");
    expect(
      result.filter(res =>
        /enum\s+direction\s*\{\n*\s*Up\s*=\s*1,\n*\s*Down\s*=\s*2,\n*\s*Left\s*=\s*3,\n*\s*Right\s*=\s*4,\n*\}/.test(
          res.toString()
        )
      )
    ).length.to.be.greaterThan(
      0,
      "enum not correct, does not contain all elements"
    );
  });
  it("when patchOverride is true, enum should contain all elements and Up element should equal 0.", () => {
    const result: String[] = merge(base, patch, true)
      .split("\n")
      .map(value => value.trim())
      .filter(value => value != "");
    expect(
      result.filter(res =>
        /enum\s+direction\s*\{\n*\s*Up\s*=\s*0,\n*\s*Down\s*=\s*2,\n*\s*Left\s*=\s*3,\n*\s*Right\s*=\s*4,\n*\}/.test(
          res.toString()
        )
      )
    ).length.to.be.greaterThan(
      0,
      "enum not correct, does not contain all elements. Result is " +
        result.reduce((prev, curr) => prev.toString() + curr.toString(), "")
    );
  });
});
