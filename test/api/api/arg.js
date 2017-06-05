"use strict";

const assert = require("assert");
const arg = require("../../../src/api/api/arg");
const isSCNode = require("../../../src/utils/isSCNode");

describe("api/arg(name, value)", () => {
  it("should create a control rate Control", () => {
    const a = arg("freq", 440);

    assert.deepEqual(a, {
      type: "#freq", rate: "control", props: [ 440, 0, 1 ]
    });
    assert(isSCNode(a));
  });

  it("should create Controls when given an array", () => {
    const a = arg("freq", [ 440, 442 ]);

    assert.deepEqual(a, [
      { type: "#freq", rate: "control", props: [ 440, 0, 2 ] },
      { type: "#freq", rate: "control", props: [ 442, 1, 2 ] },
    ]);
  });

  it(".kr should create a audio rate Control", () => {
    const a = arg.ar("freq", 440);

    assert.deepEqual(a, {
      type: "#freq", rate: "audio", props: [ 440, 0, 1 ]
    });
    assert(isSCNode(a));
  });

  it(".ar should create a control rate Control", () => {
    const a = arg.kr("freq", 440);

    assert.deepEqual(a, {
      type: "#freq", rate: "control", props: [ 440, 0, 1 ]
    });
    assert(isSCNode(a));
  });

  it(".ir should create a scalar rate Control", () => {
    const a = arg.ir("freq", 440);

    assert.deepEqual(a, {
      type: "#freq", rate: "scalar", props: [ 440, 0, 1 ]
    });
    assert(isSCNode(a));
  });

  it(".tr should create a trigger Control", () => {
    const a = arg.tr("freq", 440);

    assert.deepEqual(a, {
      type: "!freq", rate: "control", props: [ 1, 0, 1 ]
    });
    assert(isSCNode(a));
  });

  it("should throw an TypeError when given invalid name", () => {
    assert.throws(() => {
      arg("(x'_'x)");
    }, TypeError);
  });
});
