"use strict";

const assert = require("assert");
const isPlainObject = require("../../src/utils/isPlainObject");

describe("utils/isPlainObject(value)", () => {
  it("should return true when given a plain object", () => {
    assert(isPlainObject({ value: 100 }) === true);
    assert(isPlainObject([ 10, 20, 30 ]) === false);
    assert(isPlainObject(new class F {}) === false);
    assert(isPlainObject(Object.create({})) === false);
    assert(isPlainObject(null) === false);
    assert(isPlainObject(1000) === false);
  });
});
