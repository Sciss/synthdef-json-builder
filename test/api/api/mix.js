"use strict";

const assert = require("assert");
const mix = require("../../../src/api/api/mix");
const createNode = require("../../../src/utils/createNode");
const isSCNode = require("../../../src/utils/isSCNode");

describe("api/mix(items)", () => {
  it("should create a summed sc.node", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("SinOsc", "audio", [ 442, 0 ]);
    const c = createNode("SinOsc", "audio", [ 444, 0 ]);
    const node = mix([ a, b, c ]);

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "Sum3", rate: "audio", props: [ a, b, c ]
    });
  });

  it("should create sc.node[] from nested items", () => {
    const a1 = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b1 = createNode("SinOsc", "audio", [ 442, 0 ]);
    const c1 = createNode("SinOsc", "audio", [ 444, 0 ]);
    const a2 = createNode("SinOsc", "audio", [ 441, 0 ]);
    const b2 = createNode("SinOsc", "audio", [ 443, 0 ]);
    const node = mix([ [ a1, a2 ], [ b1, b2 ], c1 ]);

    assert(Array.isArray(node) && node.length === 2);
    assert(isSCNode(node[0]));
    assert(isSCNode(node[1]));
    assert.deepEqual(node[0], {
      type: "Sum3", rate: "audio", props: [ a1, b1, c1 ]
    });
    assert.deepEqual(node[1], {
      type: "Sum3", rate: "audio", props: [ a2, b2, c1 ]
    });
  });

  it("is an unbinded function", () => {
    const a = createNode("SinOsc", "audio", [ 440, 0 ]);
    const b = createNode("SinOsc", "audio", [ 442, 0 ]);
    const c = createNode("SinOsc", "audio", [ 444, 0 ]);
    const node = [ a, b, c ]::mix();

    assert(isSCNode(node));
    assert.deepEqual(node, {
      type: "Sum3", rate: "audio", props: [ a, b, c ]
    });
  });
});
