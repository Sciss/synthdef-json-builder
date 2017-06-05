"use strict";

const assert = require("assert");
const Out = require("../../../src/api/units/Out");
const createNode = require("../../../src/utils/createNode");
const isSCNode = require("../../../src/utils/isSCNode");

describe("units/Out(bus, channels)", () => {
  it("default rate is the same as input nodes", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const node = Out(0, a);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: 0, rate: "scalar", props: [ {
        type: "Out", rate: "audio", props: [ 0, a ]
      } ]
    });
    assert(node.toUnitInput() === 0);
  });

  it("should deal with nested channels", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("SinOsc", "audio", [ 660, 0 ]);
    const c = createNode("SinOsc", "audio", [ 880, 0 ]);
    const node = Out([ 0, 1 ], [ a, [ b, c ] ]);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: 0, rate: "scalar", props: [ {
        type: "Out", rate: "audio", props :[ 0, a, b ]
      }, {
        type: "Out", rate: "audio", props: [ 1, a, c ]
      }
    ] });
    assert(node.toUnitInput() === 0);
  });

  it("should throw TypeError when no inputs", () => {
    assert.throws(() => {
      Out.ar(0);
    }, TypeError);
  });

  it("should throw TypeError when given different rate input", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("SinOsc", "audio", [ 660, 0 ]);
    const c = createNode("SinOsc", "control", [ 880, 0 ]);

    assert.throws(() => {
      Out.ar(0, [ a, b, c ]);
    }, TypeError);
  });
});
