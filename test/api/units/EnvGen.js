"use strict";

const assert = require("assert");
const EnvGen = require("../../../src/api/units/EnvGen");
const env = require("../../../src/api/api/env");
const createRef = require("../../../src/utils/createRef");
const isSCNode = require("../../../src/utils/isSCNode");
const toUnitInput = require("../../../src/utils/toUnitInput");

describe("units/EnvGen(env, gate, levelScale, levelBias, timeScale, doneAction, mul, add)", () => {
  it("default rate is control rate", () => {
    const envelope = env.perc(1, 2, 0.5);
    const node = EnvGen(envelope, 1, 0.25);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "EnvGen", rate: "control", props: [ 1, 0.25, 0, 1, 0 ].concat(toUnitInput(envelope))
    });
  });

  it(".ar should create audio rate node", () => {
    const envelope = env.perc(1, 2, 0.5);
    const node = EnvGen.ar(envelope, 1, 0.25);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "EnvGen", rate: "audio", props: [ 1, 0.25, 0, 1, 0 ].concat(toUnitInput(envelope))
    });
  });

  it(".kr should create audio rate node", () => {
    const envelope = env.perc(1, 2, 0.5);
    const node = EnvGen.kr(envelope, 1, 0.25);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "EnvGen", rate: "control", props: [ 1, 0.25, 0, 1, 0 ].concat(toUnitInput(envelope))
    });
  });

  it("should throw TypeError when given invalid envelope", () => {
    const envelope = createRef([ 0, 2, -99, 10, 1, 0.5, 2, -4, 0, 3, 5, -4 ]);

    assert.throws(() => {
      EnvGen(envelope, 1, 0.25);
    });
  });
});
