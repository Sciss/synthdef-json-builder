"use strict";

const assert = require("assert");
const toArray = require("../../src/utils/toArray");

describe("utils/toArray(value)", () => {
  it("should convert to an array when given not an array", () => {
    assert.deepEqual(toArray(10), [ 10 ]);
  });

  it("should return directly when given an array", () => {
    assert.deepEqual(toArray([ 10 ]), [ 10 ]);
  });
});
