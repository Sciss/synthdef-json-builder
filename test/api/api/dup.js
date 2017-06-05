"use strict";

const assert = require("assert");
const dup = require("../../../src/api/api/dup");

describe("api/dup(value, length)", () => {
  it("should create copies", () => {
    const a = [ 10 ];
    const b = dup(a);

    assert.deepEqual(b, [ a, a ]);
  });

  it("is an unbinded function", () => {
    const a = [ 10 ];
    const b = a::dup(4);

    assert.deepEqual(b, [ a, a, a, a ]);
  });
});
