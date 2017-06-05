"use strict";

const assert = require("assert");
const isNumber = require("../../src/utils/isNumber");

describe("utils/isNumber(value)", () => {
  it("should return true when given a number", () => {
    assert(isNumber(0) === true);
    assert(isNumber(1) === true);
    assert(isNumber(Infinity) === true);
    assert(isNumber(NaN) === false);
    assert(isNumber("1") === false);
    assert(isNumber(null) === false);
    assert(isNumber([ 1 ]) === false);
  });
});
