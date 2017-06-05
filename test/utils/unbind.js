"use strict";

const assert = require("assert");
const unbind = require("../../src/utils/unbind");

describe("utils.unbind(fn)", () => {
  it("should return an unbinded function (a receiver is to the first arguments)", () => {
    const add = unbind((a, b) => a + b);

    assert(add(2, 3) === 5);
    assert(2::add(3) === 5);
  });
});
