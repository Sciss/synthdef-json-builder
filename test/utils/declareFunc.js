"use strict";

const assert = require("assert");
const sinon = require("sinon");
const declareFunc = require("../../src/utils/declareFunc");

describe("utils/NodeUtils/declareFunc(propValues, fn)", () => {
  it("should apply given arguments", () => {
    const fn = sinon.spy();
    const gen = declareFunc([ [ "a", 0 ], [ "b", 1 ], [ "c", 2 ] ], fn);

    gen(3, 4, 5, 6);

    assert(fn.callCount === 1);
    assert.deepEqual(fn.args[0], [ 3, 4, 5 ]);
  });

  it("should apply default arguments", () => {
    const fn = sinon.spy();
    const gen = declareFunc([ [ "a", 0 ], [ "b", 1 ], [ "c", 2 ] ], fn);

    gen(3);

    assert(fn.callCount === 1);
    assert.deepEqual(fn.args[0], [ 3, 1, 2 ]);
  });

  it("should apply keyword arguments", () => {
    const fn = sinon.spy();
    const gen = declareFunc([ [ "a", 0 ], [ "b", 1 ], [ "c", 2 ] ], fn);

    gen({ c: 5, d: 6 });

    assert(fn.callCount === 1);
    assert.deepEqual(fn.args[0], [ 0, 1, 5 ]);
  });
});
