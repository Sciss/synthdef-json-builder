"use strict";

const assert = require("assert");
const createNode = require("../../src/utils/createNode");
const createRef = require("../../src/utils/createRef");
const isSCNode = require("../../src/utils/isSCNode");
const isSCRef = require("../../src/utils/isSCRef");
const toUnitInput = require("../../src/utils/toUnitInput");

describe("utils/createNode(type, rate, props)", () => {
  it("should create a sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);

    assert(isSCNode(a));
    assert.deepEqual(a, {
      type: "SinOsc", rate: "audio", props: [ 440, 0 ]
    });
  });

  it("should create a nested sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("Delay1", "audio", [ a ]);

    assert.deepEqual(b, {
      type: "Delay1", rate: "audio", props: [
        { type: "SinOsc", rate: "audio", props: [ 440, 0 ] }
      ]
    });
  });

  it("should create a random sc.node when `type` ends with ~", () => {
    const a = createNode("WhiteNoise~", "audio");
    const b = createNode("WhiteNoise~", "audio");

    assert(isSCNode(a));
    assert(isSCNode(b));
    assert(/^WhiteNoise~\d+/.test(a.type));
    assert(/^WhiteNoise~\d+/.test(b.type));
    assert(a.type !== b.type);
  });

  it("should create a sc.ref when given sc.ref", () => {
    const a = createNode("SinOsc", "audio", [ createRef(440), 0 ]);

    assert(isSCRef(a));
    assert(isSCNode(toUnitInput(a)));
    assert.deepEqual(toUnitInput(a), {
      type: "SinOsc", rate: "audio", props: [ 440, 0 ]
    });
  });

  it("should reveal with rate when given rate is function", () => {
    const audioRate = () => "audio";
    const a = createNode("SinOsc", audioRate, [ 440, 0 ]);

    assert(isSCNode(a));
    assert.deepEqual(a, {
      type: "SinOsc", rate: "audio", props: [ 440, 0 ]
    });
  });

  it("should throw TypeError when given invalid inputs", () => {
    assert.throws(() => {
      createNode("SinOsc", "audio", [ [ 440, 442 ], 0 ]);
    }, TypeError);
  });
});
